import type { Metadata } from "next";
import { sessionValide, adminConfigure } from "@/lib/admin/session";
import { baseConfiguree, listerCommandes, lireStock } from "@/lib/admin/db";
import { LOCAL_PRODUCTS } from "@/lib/catalog/local";
import { Connexion } from "./Connexion";
import { TableauDeBord } from "./TableauDeBord";

/* Le tableau de bord dépend d'un cookie : il ne peut pas être prérendu. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gestion",
  /* Jamais dans un moteur de recherche, quoi qu'il arrive. */
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminPage() {
  if (!adminConfigure()) {
    return (
      <Avertissement titre="Accès non configuré">
        Renseignez <code>ADMIN_PASSWORD</code> (12 caractères minimum) et{" "}
        <code>ADMIN_SECRET</code> (24 minimum) dans les variables
        d&apos;environnement, puis redéployez.
      </Avertissement>
    );
  }

  if (!(await sessionValide())) return <Connexion />;

  if (!baseConfiguree()) {
    return (
      <Avertissement titre="Base de données non configurée">
        Renseignez <code>DATABASE_URL</code> (base Postgres, par exemple Neon
        depuis l&apos;onglet Storage de Vercel). Sans elle, ni le stock ni le
        suivi des commandes ne peuvent être enregistrés.
      </Avertissement>
    );
  }

  /* La base peut être injoignable : on l'annonce plutôt que d'afficher une
     page d'erreur générique. */
  try {
    const [commandes, stock] = await Promise.all([
      listerCommandes(100),
      lireStock(),
    ]);

    const variantes = LOCAL_PRODUCTS.flatMap((p) =>
      p.variants.edges.map((e) => ({
        id: e.node.id,
        titre: p.title,
        quantite: stock[e.node.id] ?? null,
      }))
    );

    return <TableauDeBord commandes={commandes} variantes={variantes} />;
  } catch (e) {
    console.error("[admin] base injoignable", e);
    return (
      <Avertissement titre="Base injoignable">
        La connexion a échoué. Vérifiez que <code>DATABASE_URL</code> est
        correcte et que la base accepte les connexions.
      </Avertissement>
    );
  }
}

function Avertissement({
  titre,
  children,
}: {
  titre: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[640px] px-6 pb-[var(--spacing-section-mobile)] pt-[calc(var(--header-h)+56px)] lg:px-10">
      <p className="text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
        Gestion
      </p>
      <h1 className="mt-6 text-[length:var(--text-h3)]">{titre}</h1>
      <p className="body-copy mt-6 text-[0.98rem] leading-relaxed text-[var(--color-earth-500)]">
        {children}
      </p>
    </section>
  );
}
