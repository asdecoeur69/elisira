"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";

const STORAGE_KEY = "elisira-age-ok";

/**
 * Vérification d'âge. Standard du secteur pour la vente de spiritueux :
 * ce n'est pas un contrôle d'identité, c'est une déclaration de
 * l'utilisateur, conservée dans son navigateur.
 *
 * Le stockage peut échouer (navigation privée, cookies bloqués) : on
 * enveloppe chaque accès, et en cas d'échec le voile réapparaît
 * simplement à la visite suivante.
 */
export function AgeGate() {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const [refused, setRefused] = useState(false);

  useEffect(() => {
    let ok = false;
    try {
      ok = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      ok = false;
    }
    setAllowed(ok);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.body.style.overflow = allowed ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ready, allowed]);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* navigation privée : on laisse passer pour cette session */
    }
    setAllowed(true);
  }

  // Tant qu'on n'a pas lu le stockage, on n'affiche rien : évite que le
  // voile clignote à chaque chargement pour un visiteur déjà vérifié.
  if (!ready || allowed) return null;

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        role="dialog"
        aria-modal="true"
        aria-label="Vérification de l'âge"
        className="plaster-grain fixed inset-0 z-[100] flex min-h-dvh w-screen items-center justify-center overflow-y-auto px-6 py-16"
        style={{ background: "var(--product-bg)" }}
      >
        <div className="relative w-full max-w-[480px] text-center">
          <Image
            src="/images/logo-noir.png"
            alt="H&H Spirits"
            width={180}
            height={48}
            priority
            className="mx-auto h-9 w-auto object-contain"
          />

          {refused ? (
            <>
              <h1 className="mt-12 text-[length:var(--text-h3)]">
                À bientôt.
              </h1>
              <p className="mt-5 text-[0.98rem] text-[var(--color-earth-500)]">
                La vente d&apos;alcool est interdite aux personnes de moins de
                18 ans. Merci de votre visite.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-12 text-[length:var(--text-h3)]">
                Avez-vous <span className="accent-italic">18 ans</span> ou plus ?
              </h1>
              <p className="mt-5 text-[0.98rem] text-[var(--color-earth-500)]">
                Ce site présente des boissons alcoolisées. Vous devez avoir
                l&apos;âge légal pour consommer de l&apos;alcool dans votre pays
                afin d&apos;y accéder.
              </p>

              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={accept}
                  className="rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-10 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)]"
                >
                  Oui, j&apos;ai 18 ans
                </button>
                <button
                  type="button"
                  onClick={() => setRefused(true)}
                  className="border-b border-[var(--color-border-strong)] pb-1 text-[0.8rem] uppercase tracking-[0.16em] text-[var(--color-earth-500)] transition-colors duration-300 hover:text-[var(--color-terracotta)]"
                >
                  Non
                </button>
              </div>

              <p className="mt-12 text-[0.78rem] leading-relaxed text-[var(--color-earth-300)]">
                L&apos;abus d&apos;alcool est dangereux pour la santé.
                <br />À consommer avec modération.
              </p>
            </>
          )}
        </div>
      </m.div>
    </AnimatePresence>
  );
}
