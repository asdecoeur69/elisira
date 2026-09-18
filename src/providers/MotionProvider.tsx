"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {/* Les apparitions sont pilotées en JS : la règle
          `prefers-reduced-motion` de globals.css ne neutralise que les
          transitions CSS et ne les atteint donc pas. `reducedMotion`
          s'en charge côté Framer — les déplacements sont supprimés, les
          fondus restent. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
