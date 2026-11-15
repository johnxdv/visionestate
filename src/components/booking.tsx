import { SITE } from "@/lib/content";
import { CalEmbed } from "./cal-embed";
import { CtaPrimary } from "./ui";
import { IconCalendar, IconCheck, IconClock, IconVideo } from "./icons";

const AGENDA = [
  "Nous procédons à un bilan complet de votre situation actuelle.",
  "On vous présente notre funnel d’estimation pensé pour obtenir un maximum de mandats.",
  "On chiffre ce que le système changerait pour votre agence.",
];

/**
 * Carte de droite : l'en-tête de la charte, puis le calendrier Cal.com.
 * Le fuseau horaire n'est plus affiché ici — Cal le gère et l'indique
 * lui-même dans son interface.
 */
function Scheduler() {
  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-page p-5 sm:p-6">
      <div className="flex items-center gap-3 border-b border-line pb-4">
        <span className="inline-flex items-center gap-2 font-display text-[0.95rem] font-semibold text-ink">
          <IconCalendar className="size-[17px] text-forest" />
          Choisir un créneau
        </span>
      </div>

      <CalEmbed />
    </div>
  );
}

export function Booking() {
  return (
    <section id="reserver" className="shell scroll-mt-28 py-24 sm:py-32">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-5">
          <div className="flex h-full flex-col rounded-card border border-line bg-panel/45 p-6 sm:p-8">
            <h2 className="text-balance font-display text-[clamp(1.8rem,3.4vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink">
              Prêt pour une démonstration ?
            </h2>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-muted">
              En 30 minutes chrono, comprenez immédiatement notre système
              révolutionnaire avec une démonstration détaillée.
            </p>

            <ul className="mt-7 flex flex-col gap-3">
              {AGENDA.map((item) => (
                <li key={item} className="flex gap-3 text-[0.92rem] leading-relaxed text-ink">
                  <IconCheck className="mt-1 size-4 shrink-0 text-forest" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5 text-[0.8rem] text-muted">
              <span className="inline-flex items-center gap-2">
                <IconClock className="size-4" />
                30 minutes
              </span>
              <span className="inline-flex items-center gap-2">
                <IconVideo className="size-4" />
                Visioconférence
              </span>
              <span className="inline-flex items-center gap-2">
                <IconCalendar className="size-4" />
                Sans engagement
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Scheduler />
        </div>
      </div>

      <div className="mt-10 flex justify-center lg:hidden">
        <CtaPrimary href={`mailto:${SITE.contactEmail}`}>
          Nous écrire directement
        </CtaPrimary>
      </div>
    </section>
  );
}
