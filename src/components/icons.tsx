import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconEye = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 12S6.1 6 12 6s9.5 6 9.5 6-3.6 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.7" />
  </Icon>
);

export const IconKey = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="7.6" cy="16.4" r="3.6" />
    <path d="M10.2 13.8 20 4" />
    <path d="M16.4 7.6 19 10.2" />
    <path d="M13.9 10.1 16 12.2" />
  </Icon>
);

export const IconClock = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="M12 7.2V12l3.1 2" />
  </Icon>
);

export const IconGrid = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.8" y="3.8" width="6.6" height="6.6" rx="1.4" />
    <rect x="13.6" y="3.8" width="6.6" height="6.6" rx="1.4" />
    <rect x="3.8" y="13.6" width="6.6" height="6.6" rx="1.4" />
    <rect x="13.6" y="13.6" width="6.6" height="6.6" rx="1.4" />
  </Icon>
);

export const IconUsers = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9.2" cy="8.2" r="3.4" />
    <path d="M3.4 19.2c0-3 2.6-4.9 5.8-4.9s5.8 1.9 5.8 4.9" />
    <path d="M16.4 5.6a3.4 3.4 0 0 1 0 5.9" />
    <path d="M17.8 14.6c2.2.6 3.6 2.2 3.6 4.4" />
  </Icon>
);

/** Estimations : le bien et sa valeur. */
export const IconEstimate = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.6 10.4 12 3.8l8.4 6.6V19a1.2 1.2 0 0 1-1.2 1.2H4.8A1.2 1.2 0 0 1 3.6 19Z" />
    <path d="M9 17v-2.6" />
    <path d="M12 17v-5" />
    <path d="M15 17v-3.8" />
  </Icon>
);

export const IconReport = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6.2 3h7L18.6 8.4V20a1.2 1.2 0 0 1-1.2 1.2H6.2A1.2 1.2 0 0 1 5 20V4.2A1.2 1.2 0 0 1 6.2 3Z" />
    <path d="M13 3v5.6h5.6" />
    <path d="M8.4 13.4h6.4" />
    <path d="M8.4 16.8h4" />
  </Icon>
);

export const IconSliders = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7.2h9.4M18.6 7.2H20" />
    <circle cx="16" cy="7.2" r="2.1" />
    <path d="M4 16.8h3.4M12.6 16.8H20" />
    <circle cx="10" cy="16.8" r="2.1" />
  </Icon>
);

export const IconLock = (p: IconProps) => (
  <Icon strokeWidth={1.9} {...p}>
    <rect x="4.8" y="10.2" width="14.4" height="9.6" rx="2.2" />
    <path d="M7.8 10.2V7.6a4.2 4.2 0 0 1 8.4 0v2.6" />
  </Icon>
);

export const IconChevronLeft = (p: IconProps) => (
  <Icon strokeWidth={2} {...p}>
    <path d="M14.4 5 7.8 12l6.6 7" />
  </Icon>
);

export const IconChevronRight = (p: IconProps) => (
  <Icon strokeWidth={2} {...p}>
    <path d="M9.6 5 16.2 12l-6.6 7" />
  </Icon>
);

export const IconSearch = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="10.6" cy="10.6" r="6.4" />
    <path d="M15.4 15.4 20.6 20.6" />
  </Icon>
);

export const IconExport = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.8v9.6" />
    <path d="M8.2 9.8 12 13.6l3.8-3.8" />
    <path d="M4.6 19.4h14.8" />
  </Icon>
);

/** Zéro temps perdu. */
export const IconBolt = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13.4 2.6 4.8 13.4h6l-.7 8 8.9-11.2h-6.2Z" />
  </Icon>
);

/** Actif jour et nuit : une activité qui ne s'interrompt pas. */
export const IconPulse = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="M6.6 12h2.3l1.7-3.9 2.4 7.8 1.7-3.9h2.7" />
  </Icon>
);

/** Livré en 72h. */
export const IconGauge = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 17.4a9 9 0 1 1 16 0" />
    <path d="M12 13.6 16.2 9" />
    <circle cx="12" cy="15.4" r="1.6" />
  </Icon>
);

export const IconMenu = (p: IconProps) => (
  <Icon strokeWidth={1.9} {...p}>
    <path d="M4 7.5h16M4 12h16M4 16.5h16" />
  </Icon>
);

export const IconClose = (p: IconProps) => (
  <Icon strokeWidth={1.9} {...p}>
    <path d="M6.2 6.2 17.8 17.8M17.8 6.2 6.2 17.8" />
  </Icon>
);

export const IconCalendar = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.6" y="5.2" width="16.8" height="15.2" rx="2.2" />
    <path d="M8.2 3v4M15.8 3v4M3.6 10h16.8" />
  </Icon>
);

export const IconVideo = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.8" y="6.4" width="12.6" height="11.2" rx="2.2" />
    <path d="m15.4 11 5.8-3.2v8.4L15.4 13Z" />
  </Icon>
);

export const IconCheck = (p: IconProps) => (
  <Icon strokeWidth={2} {...p}>
    <path d="m5 12.4 4.8 4.8L19 6.6" />
  </Icon>
);

export const IconSparkle = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.4 13.8 9 19.4 10.8 13.8 12.6 12 18.2 10.2 12.6 4.6 10.8 10.2 9Z" />
  </Icon>
);

export const IconPin = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s6.8-5.4 6.8-10.6a6.8 6.8 0 1 0-13.6 0C5.2 15.6 12 21 12 21Z" />
    <circle cx="12" cy="10.2" r="2.5" />
  </Icon>
);

/** Le jour, sur la bande des 24 heures. */
export const IconSun = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
  </Icon>
);

/** La nuit — et le système qui continue de tourner. */
export const IconMoon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20.4 14.6A8.8 8.8 0 1 1 9.4 3.6a6.9 6.9 0 0 0 11 11Z" />
  </Icon>
);

/** Livraison : le colis posé au bout des 72 heures. */
export const IconPackage = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20.4 7.6v8.8L12 21l-8.4-4.6V7.6L12 3Z" />
    <path d="m3.6 7.6 8.4 4.6 8.4-4.6" />
    <path d="M12 12.2V21" />
  </Icon>
);

/** Caret plein pour les badges de tendance. */
export const IconTrendUp = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M12 6.5 19 16H5Z" />
  </svg>
);
