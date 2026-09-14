import type { Metadata } from "next";
import { LEGAL_ENTITY, SITE } from "@/lib/content";
import {
  LegalHeader,
  LegalLines,
  LegalLink,
  LegalSection,
} from "@/components/legal";

export const metadata: Metadata = {
  title: "Mentions légales — Vision Estate",
  description:
    "Éditeur, hébergement, propriété intellectuelle et limitation de responsabilité du site visionestate.fr.",
};

export default function MentionsLegales() {
  return (
    <article>
      <LegalHeader title="Mentions légales" />

      <LegalSection title="Éditeur du site">
        <p>Le site visionestate.fr est édité par :</p>
        <LegalLines
          lines={[
            LEGAL_ENTITY.name,
            LEGAL_ENTITY.status,
            `SIRET : ${LEGAL_ENTITY.siret}`,
            `SIREN : ${LEGAL_ENTITY.siren}`,
            `Numéro de TVA intracommunautaire : ${LEGAL_ENTITY.vat}`,
            `Adresse : ${LEGAL_ENTITY.address}`,
            <>
              Email :{" "}
              <LegalLink href={`mailto:${SITE.contactEmail}`}>
                {SITE.contactEmail}
              </LegalLink>
            </>,
            `Responsable de publication : ${LEGAL_ENTITY.publisher}`,
          ]}
        />
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>Le site est hébergé par :</p>
        <LegalLines
          lines={[
            "Vercel Inc.",
            "440 N Barranca Ave #4133",
            "Covina, CA 91723, États-Unis",
            <>
              Site : <LegalLink href="https://vercel.com">vercel.com</LegalLink>
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          L’ensemble des contenus présents sur le site visionestate.fr est la
          propriété exclusive de {LEGAL_ENTITY.name} et est protégé par les lois
          françaises et internationales relatives à la propriété intellectuelle.
          Toute reproduction sans autorisation écrite préalable est interdite.
        </p>
      </LegalSection>

      <LegalSection title="Limitation de responsabilité">
        <p>
          {LEGAL_ENTITY.name} s’efforce de fournir des informations aussi
          précises que possible mais ne peut être tenu responsable des omissions
          ou inexactitudes.
        </p>
      </LegalSection>
    </article>
  );
}
