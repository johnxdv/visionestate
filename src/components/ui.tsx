import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { LogoMark } from "./icons";

/** Pill bordée avec point plein — motif d'accroche répété dans la page. */
export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border border-line bg-page/60 px-3.5 py-1.5 text-[0.8125rem] leading-none text-muted",
        className,
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-forest" aria-hidden="true" />
      {children}
    </span>
  );
}

export function CtaPrimary({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-pill bg-forest px-6 py-3 text-sm font-medium text-page",
        "transition-[background-color,transform] duration-200 hover:bg-[#0e2b1f] active:translate-y-px",
        className,
      )}
    >
      {children}
    </a>
  );
}

export function CtaSecondary({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-pill border border-line px-6 py-3 text-sm font-medium text-ink",
        "transition-[background-color,border-color,transform] duration-200 hover:border-[#cfc6ae] hover:bg-panel/60 active:translate-y-px",
        className,
      )}
    >
      {children}
    </a>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-forest"
        aria-hidden="true"
      >
        <LogoMark className="size-[18px] text-blob" />
      </span>
      <span className="whitespace-nowrap font-display text-[1.0625rem] font-semibold tracking-tight text-ink">
        Vision Estate
      </span>
    </a>
  );
}
