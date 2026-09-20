"use client";

import { useActionState } from "react";
import type { Commande } from "@/lib/admin/db";
import { deconnexion, expedier, majStock } from "./actions";

type Variante = { id: string; titre: string; quantite: number | null };

function francs(centimes: number, devise = "chf") {
  return `${devise.toUpperCase()} ${(centimes / 100).toFixed(2).replace(/\.00$/, ".—")}`;
}

function date(iso: string) {
  return new Date(iso).toLocaleDateString("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TableauDeBord({
  commandes,
  variantes,
}: {
  commandes: Commande[];
  variantes: Variante[];
}) {
  const aPreparer = commandes.filter((c) => c.statut === "a_preparer");

  /* Chiffre du mois en cours : la seule statistique utile au quotidien,
     le reste est déjà mieux présenté dans Stripe. */
  const debutMois = new Date();
  debutMois.setDate(1);
  debutMois.setHours(0, 0, 0, 0);
  const duMois = commandes.filter((c) => new Date(c.cree) >= debutMois);
  const caMois = duMois.reduce((t, c) => t + c.total, 0);
  const panierMoyen = duMois.length ? Math.round(caMois / duMois.length) : 0;

  return (
    <section className="mx-auto max-w-[1100px] px-6 pb-[var(--spacing-section-mobile)] pt-[calc(var(--header-h)+40px)] lg:px-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
            Gestion
          </p>
          <h1 className="mt-4 text-[length:var(--text-h3)]">Vos commandes.</h1>
        </div>
        <form action={deconnexion}>
          <button
            type="submit"
            className="border-b pb-1 text-[0.74rem] uppercase tracking-[0.14em] text-[var(--color-earth-500)] transition-colors hover:text-[var(--color-terracotta)]"
            style={{ borderColor: "var(--color-border-strong)" }}
          >
            Se déconnecter
          </button>
        </form>
      </div>

      {/* Chiffres du mois */}
      <div className="mt-10 grid grid-cols-2 gap-px lg:grid-cols-4" style={{ background: "var(--hairline)" }}>
        <Chiffre valeur={String(aPreparer.length)} label="À préparer" accent={aPreparer.length > 0} />
        <Chiffre valeur={String(duMois.length)} label="Commandes ce mois" />
        <Chiffre valeur={francs(caMois)} label="Chiffre du mois" />
        <Chiffre valeur={duMois.length ? francs(panierMoyen) : "—"} label="Panier moyen" />
      </div>

      {/* Stock */}
      <h2 className="mt-16 text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-terracotta)]">
        Stock
      </h2>
      <p className="mt-3 text-[0.85rem] text-[var(--color-earth-500)]">
        Un produit sans quantité saisie reste vendable sans limite. Mettez 0
        pour l&apos;afficher comme épuisé.
      </p>
      <div className="mt-6 flex flex-col gap-px" style={{ background: "var(--hairline)" }}>
        {variantes.map((v) => (
          <LigneStock key={v.id} variante={v} />
        ))}
      </div>

      {/* Commandes */}
      <h2 className="mt-16 text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-terracotta)]">
        Commandes
      </h2>

      {commandes.length === 0 ? (
        <p className="mt-6 text-[0.95rem] text-[var(--color-earth-500)]">
          Aucune commande pour le moment.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {commandes.map((c) => (
            <CarteCommande key={c.session_id} commande={c} />
          ))}
        </div>
      )}
    </section>
  );
}

function Chiffre({
  valeur,
  label,
  accent = false,
}: {
  valeur: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-[var(--color-cream)] p-6">
      <p
        className="font-[family-name:var(--font-heading)] text-[1.75rem] tabular-nums"
        style={{ color: accent ? "var(--color-terracotta)" : "var(--color-earth-deep)" }}
      >
        {valeur}
      </p>
      <p className="mt-2 text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-earth-500)]">
        {label}
      </p>
    </div>
  );
}

function LigneStock({ variante }: { variante: Variante }) {
  const [etat, action, enCours] = useActionState(majStock, { erreur: "" });
  const epuise = variante.quantite === 0;

  return (
    <form
      action={action}
      className="flex flex-wrap items-center justify-between gap-4 bg-[var(--color-cream)] px-5 py-4"
    >
      <input type="hidden" name="variante" value={variante.id} />
      <div>
        <span className="font-[family-name:var(--font-heading)] text-[1.05rem] text-[var(--color-earth-deep)]">
          {variante.titre}
        </span>
        {epuise && (
          <span className="ml-3 text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-terracotta)]">
            Épuisé
          </span>
        )}
        {etat.erreur && (
          <span role="alert" className="ml-3 text-[0.78rem] text-[var(--color-terracotta)]">
            {etat.erreur}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor={`q-${variante.id}`} className="sr-only">
          Quantité en stock pour {variante.titre}
        </label>
        <input
          id={`q-${variante.id}`}
          name="quantite"
          type="number"
          min={0}
          max={9999}
          defaultValue={variante.quantite ?? ""}
          placeholder="illimité"
          className="w-28 rounded-[3px] border bg-transparent px-3 py-2 text-[0.9rem] tabular-nums text-[var(--color-earth-deep)] focus:border-[var(--color-terracotta)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-terracotta)]"
          style={{ borderColor: "var(--color-border-strong)" }}
        />
        <button
          type="submit"
          disabled={enCours}
          className="rounded-[3px] border px-4 py-2 text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-earth-500)] transition-colors hover:border-[var(--color-terracotta)] hover:text-[var(--color-terracotta)] disabled:opacity-50"
          style={{ borderColor: "var(--color-border-strong)" }}
        >
          {enCours ? "…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

function CarteCommande({ commande }: { commande: Commande }) {
  const [etat, action, enCours] = useActionState(expedier, { erreur: "" });
  const retrait = /retrait/i.test(commande.mode ?? "");
  const faite = commande.statut !== "a_preparer";

  return (
    <article
      className="bg-[var(--color-cream)] p-6"
      style={{
        borderLeft: faite ? "3px solid var(--hairline-strong)" : "3px solid var(--color-terracotta)",
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <span className="font-[family-name:var(--font-heading)] text-[1.1rem] tabular-nums text-[var(--color-earth-deep)]">
            {commande.numero}
          </span>
          <span className="ml-3 text-[0.78rem] tabular-nums text-[var(--color-earth-300)]">
            {date(commande.cree)}
          </span>
        </div>
        <span
          className="text-[0.7rem] uppercase tracking-[0.14em]"
          style={{
            color: faite ? "var(--color-earth-300)" : "var(--color-terracotta)",
          }}
        >
          {commande.statut === "a_preparer"
            ? retrait
              ? "À préparer · retrait"
              : "À préparer · livraison"
            : commande.statut === "retiree"
              ? "Retirée"
              : "Expédiée"}
        </span>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Articles */}
        <div>
          <ul className="flex flex-col gap-1.5">
            {commande.lignes.map((l, i) => (
              <li key={i} className="flex justify-between gap-4 text-[0.9rem] text-[var(--color-earth-500)]">
                <span>
                  {l.titre}
                  <span className="ml-2 text-[var(--color-earth-300)]">× {l.quantite}</span>
                </span>
                <span className="tabular-nums">{francs(l.montant, commande.devise)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between border-t pt-3 text-[0.9rem]" style={{ borderColor: "var(--hairline)" }}>
            <span className="text-[var(--color-earth-500)]">Total réglé</span>
            <span className="font-[family-name:var(--font-heading)] text-[1.05rem] tabular-nums text-[var(--color-earth-deep)]">
              {francs(commande.total, commande.devise)}
            </span>
          </p>
        </div>

        {/* Client */}
        <div className="text-[0.88rem] leading-relaxed text-[var(--color-earth-500)]">
          <p className="text-[var(--color-earth-deep)]">{commande.client_nom}</p>
          {commande.client_email && (
            <p>
              <a href={`mailto:${commande.client_email}`} className="hover:text-[var(--color-terracotta)]">
                {commande.client_email}
              </a>
            </p>
          )}
          {commande.client_tel && (
            <p className="tabular-nums">
              <a href={`tel:${commande.client_tel}`} className="hover:text-[var(--color-terracotta)]">
                {commande.client_tel}
              </a>
            </p>
          )}
          <p className="mt-3 whitespace-pre-line">{commande.adresse}</p>
          {commande.suivi && (
            <p className="mt-3 tabular-nums text-[var(--color-earth-300)]">
              Suivi : {commande.suivi}
            </p>
          )}
        </div>
      </div>

      {/* Action */}
      {!faite && (
        <form action={action} className="mt-6 flex flex-wrap items-center gap-3 border-t pt-5" style={{ borderColor: "var(--hairline)" }}>
          <input type="hidden" name="session" value={commande.session_id} />
          {!retrait && (
            <>
              <label htmlFor={`s-${commande.session_id}`} className="sr-only">
                Numéro de suivi
              </label>
              <input
                id={`s-${commande.session_id}`}
                name="suivi"
                type="text"
                placeholder="Numéro de suivi La Poste"
                className="min-w-0 flex-1 rounded-[3px] border bg-transparent px-3.5 py-2.5 text-[0.88rem] tabular-nums text-[var(--color-earth-deep)] focus:border-[var(--color-terracotta)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-terracotta)]"
                style={{ borderColor: "var(--color-border-strong)" }}
              />
            </>
          )}
          <button
            type="submit"
            disabled={enCours}
            className="rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-6 py-2.5 text-[0.74rem] uppercase tracking-[0.14em] text-[var(--color-cream)] transition-colors hover:bg-[var(--color-terracotta-dark)] disabled:opacity-60"
          >
            {enCours
              ? "…"
              : retrait
                ? "Marquer comme retirée"
                : "Expédiée · prévenir le client"}
          </button>
        </form>
      )}

      {(etat.erreur || etat.message) && (
        <p
          role="status"
          className="mt-3 text-[0.82rem]"
          style={{
            color: etat.erreur ? "var(--color-terracotta)" : "var(--color-earth-500)",
          }}
        >
          {etat.erreur || etat.message}
        </p>
      )}
    </article>
  );
}
