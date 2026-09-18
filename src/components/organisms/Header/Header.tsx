"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { useLocalCart } from "@/lib/cart/LocalCartProvider";

const NAV = [
  /* `primary` : le produit principal porte plus de poids que le reste. */
  { label: "Elisira", href: "/elisira", primary: true },
  { label: "La bougie", href: "/products/bougie-mandarine" },
  { label: "Notre histoire", href: "/about" },
  { label: "Professionnels", href: "/professionnels" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { totalQuantity, open: openCart } = useLocalCart();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Menu ouvert : on bloque le défilement derrière. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  /* Tunnel de commande : le visiteur a décidé d'acheter. Chaque lien de
     navigation devient une porte de sortie — on n'en garde aucun. */
  const checkout = pathname.startsWith("/commande");

  if (checkout) {
    return (
      <header
        className="fixed inset-x-0 top-0 z-50"
        style={{
          height: "var(--header-h)",
          backgroundColor: "rgba(250,246,239,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <div className="mx-auto flex h-full max-w-[1240px] items-center justify-between px-6 lg:px-10">
          <Link href="/" aria-label="H&H Spirits — accueil" className="flex items-center">
            <Image
              src="/images/logo-noir.png"
              alt="H&H Spirits"
              width={150}
              height={40}
              priority
              className="h-6 w-auto object-contain sm:h-7"
            />
          </Link>

          <span className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-earth-500)]">
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className="shrink-0"
            >
              <path
                d="M4.2 7V5a3.8 3.8 0 0 1 7.6 0v2"
                stroke="var(--color-terracotta)"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <rect
                x="2.8"
                y="7"
                width="10.4"
                height="7"
                rx="1.6"
                stroke="var(--color-terracotta)"
                strokeWidth="1.3"
              />
            </svg>
            Paiement sécurisé
          </span>
        </div>
      </header>
    );
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        height: "var(--header-h)",
        backgroundColor: solid ? "rgba(250,246,239,0.92)" : "transparent",
        backdropFilter: solid ? "blur(12px)" : "none",
        borderBottom: `1px solid ${solid ? "var(--hairline)" : "transparent"}`,
      }}
    >
      <div className="mx-auto flex h-full max-w-[1240px] items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          aria-label="Elisira — accueil"
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo-noir.png"
            alt="H&H Spirits"
            width={150}
            height={40}
            priority
            className="h-6 w-auto object-contain sm:h-7"
          />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV.map((link) => {
            const actif =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={actif ? "page" : undefined}
                className={`border-b pb-1 uppercase transition-colors duration-300 hover:text-[var(--color-terracotta)] ${
                  link.primary
                    ? "text-[0.8rem] tracking-[0.16em]"
                    : "text-[0.74rem] tracking-[0.17em]"
                } ${
                  actif
                    ? "border-[var(--color-terracotta)] text-[var(--color-earth-deep)]"
                    : `border-transparent ${
                        link.primary
                          ? "text-[var(--color-earth-deep)]"
                          : "text-[var(--color-earth-500)]"
                      }`
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/commander"
            aria-current={pathname === "/commander" ? "page" : undefined}
            className={`hidden rounded-[var(--radius-sm)] border border-[var(--color-terracotta)] px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.17em] transition-colors duration-300 sm:inline-block sm:px-6 sm:text-[0.72rem] ${
              pathname === "/commander"
                ? "bg-[var(--color-terracotta)] text-[var(--color-cream)] hover:bg-[var(--color-terracotta-dark)] hover:border-[var(--color-terracotta-dark)]"
                : "text-[var(--color-terracotta)] hover:bg-[var(--color-terracotta)] hover:text-white"
            }`}
          >
            Commander
          </Link>

          {/* Panier */}
          <button
            type="button"
            onClick={openCart}
            aria-label={`Panier${totalQuantity > 0 ? ` — ${totalQuantity} article(s)` : ""}`}
            className="relative flex h-9 items-center gap-2 text-[0.72rem] uppercase tracking-[0.17em] text-[var(--color-earth-500)] transition-colors duration-300 hover:text-[var(--color-terracotta)]"
          >
            Panier
            {totalQuantity > 0 && (
              <span className="tabular-nums text-[var(--color-terracotta)]">
                ({totalQuantity})
              </span>
            )}
          </button>

          {/* Bouton menu — mobile et tablette */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="-mr-1 flex h-9 w-8 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span
              className="block h-px w-[18px] transition-transform duration-300"
              style={{
                backgroundColor: "var(--color-earth)",
                transform: open ? "translateY(3px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block h-px w-[18px] transition-transform duration-300"
              style={{
                backgroundColor: "var(--color-earth)",
                transform: open ? "translateY(-3px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Panneau mobile */}
      <AnimatePresence>
        {open && (
          <m.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            className="plaster-grain absolute inset-x-0 top-full border-b lg:hidden"
            style={{
              borderColor: "var(--hairline)",
              backgroundColor: "var(--color-plaster)",
              boxShadow: "var(--shadow-2)",
            }}
          >
            <ul className="relative mx-auto max-w-[1240px] px-6 py-4">
              {NAV.map((link) => {
                const actif =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={actif ? "page" : undefined}
                      className={`block border-b py-4 text-[0.82rem] uppercase tracking-[0.17em] transition-colors duration-300 hover:text-[var(--color-terracotta)] ${
                        actif
                          ? "text-[var(--color-terracotta)]"
                          : "text-[var(--color-earth)]"
                      }`}
                      style={{ borderColor: "var(--hairline)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
