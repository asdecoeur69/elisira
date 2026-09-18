"use client";

import Link from "next/link";
import Image from "next/image";

const COLUMNS = [
  {
    title: "Produits",
    links: [
      { label: "Elisira — 50 cl", href: "/products/elisira-50cl" },
      { label: "Elisira Nero Imperiale — 70 cl", href: "/products/elisira-70cl" },
      { label: "La bougie Elisira", href: "/products/bougie-mandarine" },
      { label: "La liqueur", href: "/elisira" },
      { label: "Commander", href: "/commander" },
    ],
  },
  {
    title: "La maison",
    links: [
      { label: "Notre histoire", href: "/about" },
      { label: "Où nous trouver", href: "/points-de-vente" },
      { label: "Professionnels", href: "/professionnels" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Informations",
    links: [
      { label: "Livraison & retours", href: "/livraison" },
      { label: "Conditions générales", href: "/cgv" },
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="plaster relative bg-[var(--color-earth-deep)] text-[var(--color-sand)]">
      <div className="relative mx-auto max-w-[1240px] px-6 py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Marque */}
          <div>
            <Image
              src="/images/logo-blanc.png"
              alt="H&H Spirits"
              width={170}
              height={44}
              className="h-8 w-auto object-contain"
            />
            <p className="mt-6 max-w-[34ch] text-[0.92rem] leading-relaxed text-[var(--color-on-dark-muted)]">
              Liqueur artisanale de mandarines biologiques siciliennes,
              élaborée à Genève selon une recette familiale.
            </p>
            <p className="mt-6 text-[0.86rem] text-[var(--color-on-dark-muted)]">
              Chem. des Chaumets 35
              <br />
              1239 Collex-Bossy, Suisse
            </p>
            <a
              href="mailto:info@hh-spirits.com"
              className="mt-4 inline-block text-[0.86rem] text-[var(--color-terracotta-soft)] transition-opacity hover:opacity-70"
            >
              info@hh-spirits.com
            </a>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[0.7rem] uppercase tracking-[0.22em] text-[var(--color-terracotta-soft)]">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[0.9rem] text-[var(--color-on-dark-muted)] transition-colors duration-300 hover:text-[var(--color-sand)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mention légale — obligatoire, et jamais reléguée en petit */}
        <div
          className="mt-16 border-t pt-8"
          style={{ borderColor: "var(--hairline-light)" }}
        >
          <p className="text-[0.82rem] text-[var(--color-terracotta-soft)]">
            L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer
            avec modération. Vente interdite aux mineurs.
          </p>
          <p className="mt-4 text-[0.78rem] text-[var(--color-on-dark-muted)]">
            © {new Date().getFullYear()} H&amp;H Spirits — Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
