import { SITE } from "@/lib/content";
import { CtaPrimary } from "./ui";
import { IconCalendar, IconCheck, IconClock, IconVideo } from "./icons";

const AGENDA = [
  "On regarde votre position actuelle sur vos recherches clés.",
  "On vous montre le tunnel et l’estimateur en conditions réelles.",
  "On chiffre ce que le système changerait pour votre agence.",
];

const MOCK_SLOTS = [
  { day: "jeu. 17 sept.", times: ["09:30", "11:00", "14:30"] },
  { day: "ven. 18 sept.", times: ["10:00", "13:30", "16:00"] },
  { day: "lun. 21 sept.", times: ["09:00", "11:30", "15:00"] },
];

/** Panneau de créneaux — remplacé par l'iframe dès que SITE.calendlyUrl est renseigné. */
function SchedulerPlaceholder() {
  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-page p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
        <span className="inline-flex items-center gap-2 font-display text-[0.95rem] font-semibold text-ink">
          <IconCalendar className="size-[17px] text-forest" />
          Choisir un créneau
        </span>
        <span className="text-[0.72rem] text-muted">Europe/Paris</span>
      </div>

      <div aria-hidden="true" className="mt-5 grid gap-3 sm:grid-cols-3">
        {MOCK_SLOTS.map((slot) => (
          <div key={slot.day}>
            <div className="text-[0.75rem] font-medium text-ink">{slot.day}</div>
            <div className="mt-2 flex flex-col gap-1.5">
              {slot.times.map((time) => (
                <span
                  key={time}
                  className="tnum rounded-pill border border-line bg-panel/50 px-3 py-1.5 text-center text-[0.78rem] text-muted"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 border-t border-line pt-4 text-[0.78rem] leading-relaxed text-muted lg:mt-auto">
        Le calendrier de réservation s’ouvre ici. En attendant son branchement,
        écrivez-nous à{" "}
        <a
          href={`mailto:${SITE.contactEmail}`}
          className="text-forest underline underline-offset-2"
        >
          {SITE.contactEmail}
        </a>{" "}
        et on vous propose trois créneaux.
      </p>
    </div>
  );
}

export function Booking() {
  return (
    <section id="reserver" className="shell scroll-mt-28 py-24 sm:py-32">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-5">
          <div className="flex h-full flex-col rounded-card border border-line bg-panel/45 p-6 sm:p-8">
            <h2 className="text-balance font-display text-[clamp(1.8rem,3.4vw,2.5rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-ink">
              Réserver un appel démo
            </h2>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-muted">
              Trente minutes, en visio, pour voir le système tourner sur votre
              marché plutôt que sur une plaquette.
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
          {SITE.calendlyUrl ? (
            <div className="h-full overflow-hidden rounded-card border border-line bg-page">
              <iframe
                src={SITE.calendlyUrl}
                title="Réserver un appel démo avec Vision Estate"
                loading="lazy"
                className="h-[700px] w-full border-0"
              />
            </div>
          ) : (
            <SchedulerPlaceholder />
          )}
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
