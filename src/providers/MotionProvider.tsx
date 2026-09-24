"use client";

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  useReducedMotion,
} from "framer-motion";
import { REVEAL } from "@/lib/animations";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  /* Les apparitions sont pilotées en JS : la règle
     `prefers-reduced-motion` de globals.css ne neutralise que les
     animations CSS et ne les atteint donc pas. `reducedMotion="user"`
     supprime les déplacements écrits en `x`/`y` ; ceux écrits en
     `transform` (voir `lib/animations.ts`) lui échappent, d'où la
     transition par défaut ramenée à zéro : le contenu est là, sans
     mouvement. */
  const reduire = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion="user"
        transition={reduire ? { duration: 0 } : REVEAL}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
