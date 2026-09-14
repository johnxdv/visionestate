import type { Metadata } from "next";
import { LEGAL_ENTITY, SITE } from "@/lib/content";
import {
  LegalHeader,
  LegalLines,
  LegalLink,
  LegalSection,
} from "@/components/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Vision Estate",
  description:
    "Données collectées, finalités, durée de conservation et exercice de vos droits sur visionestate.fr.",
};

export default function PolitiqueDeConfidentialite() {
  return (
    <article>
      <LegalHeader
        title="Politique de confidentialité"
        updatedAt="juillet 2026"
      />

      <LegalSection title="1. Responsable du traitement">
        <LegalLines
          lines={[
            `${LEGAL_ENTITY.name}, entrepreneur individuel`,
            `SIRET : ${LEGAL_ENTITY.siret}`,
            LEGAL_ENTITY.address,
            <>
              Email :{" "}
              <LegalLink href={`mailto:${SITE.contactEmail}`}>
                {SITE.contactEmail}
              </LegalLink>
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection title="2. Données collectées">
        <p>
          Dans le cadre de l’utilisation du site et de la réservation d’un
          appel, nous pouvons collecter : nom et prénom, adresse email
          professionnelle, numéro de téléphone, nom de l’entreprise.
        </p>
      </LegalSection>

      <LegalSection title="3. Finalité du traitement">
        <p>
          Les données collectées sont utilisées exclusivement pour : la prise de
          rendez-vous, l’envoi de confirmations et rappels, le suivi commercial
          et l’amélioration de nos services. Nous ne vendons ni ne partageons
          vos données avec des tiers à des fins commerciales.
        </p>
      </LegalSection>

      <LegalSection title="4. Base légale">
        <p>
          Le traitement est fondé sur votre consentement explicite lors de la
          prise de rendez-vous.
        </p>
      </LegalSection>

      <LegalSection title="5. Durée de conservation">
        <p>
          Vos données sont conservées pendant une durée maximale de 3 ans à
          compter du dernier contact.
        </p>
      </LegalSection>

      <LegalSection title="6. Destinataires des données">
        <p>
          Cal.com (prise de rendez-vous) et Vercel (hébergement) peuvent
          recevoir vos données dans le strict cadre de leurs services.
        </p>
      </LegalSection>

      <LegalSection title="7. Vos droits">
        <p>
          Conformément au RGPD, vous disposez des droits d’accès, rectification,
          effacement, limitation, opposition et portabilité. Pour les exercer :{" "}
          <LegalLink href={`mailto:${SITE.contactEmail}`}>
            {SITE.contactEmail}
          </LegalLink>
          . Vous pouvez également contacter la CNIL sur{" "}
          <LegalLink href="https://www.cnil.fr">www.cnil.fr</LegalLink>.
        </p>
      </LegalSection>

      <LegalSection title="8. Cookies">
        <p>
          Le site utilise uniquement des cookies techniques nécessaires à son
          fonctionnement.
        </p>
      </LegalSection>

      <LegalSection title="9. Sécurité">
        <p>
          Nous mettons en œuvre les mesures appropriées pour protéger vos
          données contre tout accès non autorisé.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          <LegalLink href={`mailto:${SITE.contactEmail}`}>
            {SITE.contactEmail}
          </LegalLink>
        </p>
      </LegalSection>

      <LegalSection title="Droit applicable">
        <p>
          Les présentes mentions légales sont soumises au droit français. En cas
          de litige, les tribunaux français seront seuls compétents.
        </p>
      </LegalSection>
    </article>
  );
}
