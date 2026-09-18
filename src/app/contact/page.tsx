import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/molecules/PageHeader";

export const metadata: Metadata = {
  title: "Contact — H&H Spirits",
  description:
    "Nous écrire, nous appeler, nous rencontrer. H&H Spirits, Chem. des Chaumets 35, 1239 Collex-Bossy, Genève.",
};

const CONTACTS = [
  { name: "Matisse Huchon", phone: "+41 78 330 46 83", tel: "+41783304683" },
  { name: "Nathan Hubschi", phone: "+41 77 531 96 06", tel: "+41775319606" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Nous écrire, nous appeler,{" "}
            <span className="accent-italic">nous rencontrer.</span>
          </>
        }
        lead="Une question sur nos produits, une commande, un partenariat ? Nous répondons nous-mêmes, et rapidement."
      />

      <section className="pb-[var(--spacing-section-mobile)] lg:pb-[var(--spacing-section)]">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-14 px-6 lg:grid-cols-[1fr_0.85fr] lg:gap-20 lg:px-10">
          <div>
            {/* Téléphones */}
            <h2 className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--color-terracotta)]">
              Nous appeler
            </h2>
            <ul className="mt-6">
              {CONTACTS.map((c, i) => (
                <li
                  key={c.tel}
                  className="flex flex-wrap items-baseline justify-between gap-2 border-t py-5"
                  style={{
                    borderColor: "var(--hairline)",
                    borderBottomWidth: i === CONTACTS.length - 1 ? 1 : 0,
                    borderBottomStyle: "solid",
                  }}
                >
                  <span className="font-[family-name:var(--font-heading)] text-[1.35rem] text-[var(--color-earth-deep)]">
                    {c.name}
                  </span>
                  <a
                    href={`tel:${c.tel}`}
                    className="text-[0.95rem] text-[var(--color-terracotta)] transition-opacity hover:opacity-70"
                  >
                    {c.phone}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mail */}
            <h2 className="mt-14 text-[0.7rem] uppercase tracking-[0.24em] text-[var(--color-terracotta)]">
              Nous écrire
            </h2>
            <a
              href="mailto:info@hh-spirits.com"
              className="mt-5 block font-[family-name:var(--font-heading)] text-[clamp(1.6rem,3vw,2.2rem)] text-[var(--color-earth-deep)] transition-colors duration-300 hover:text-[var(--color-terracotta)]"
            >
              info@hh-spirits.com
            </a>

            {/* Adresse */}
            <h2 className="mt-14 text-[0.7rem] uppercase tracking-[0.24em] text-[var(--color-terracotta)]">
              Nous rencontrer
            </h2>
            <address className="mt-5 not-italic text-[1.05rem] leading-relaxed text-[var(--color-earth-500)]">
              H&amp;H Spirits
              <br />
              Chem. des Chaumets 35
              <br />
              1239 Collex-Bossy
              <br />
              Suisse
            </address>
            <a
              href="https://maps.google.com/?q=Chemin+des+Chaumets+35,+1239+Collex-Bossy"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block border-b border-[var(--color-border-strong)] pb-1 text-[0.8rem] uppercase tracking-[0.16em] text-[var(--color-earth-500)] transition-colors duration-300 hover:text-[var(--color-terracotta)]"
            >
              Ouvrir dans Maps
            </a>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-2)]">
            <Image
              src="/images/mandarines.jpg"
              alt="Mandarines siciliennes et feuilles d'agrume"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
