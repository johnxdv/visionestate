"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * `reducedMotion="user"` neutralise les animations de transformation de
 * Framer Motion dès que le système le demande. Les animations pilotées
 * au scroll vérifient en plus `useReducedMotion()` pour rendre un état
 * final statique.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
