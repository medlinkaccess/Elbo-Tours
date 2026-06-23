import os

BASE = r"E:\projects\Elbo-Tours"

# ── 1. Privacy Policy page ────────────────────────────────────────────────────
PRIVACY = r'''import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Privacy Policy' : 'Politique de Confidentialité',
    description: isEn
      ? 'Privacy Policy for Elbo Tours – how we collect, use, and protect your data.'
      : 'Politique de confidentialité d\'Elbo Tours – comment nous collectons, utilisons et protégeons vos données.',
    robots: { index: true, follow: true },
  };
}

export default function PrivacyPolicyPage({ params: { locale } }: { params: { locale: string } }) {
  const isEn = locale === 'en';

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {isEn ? <EnContent /> : <FrContent />}
    </main>
  );
}

function EnContent() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 2025</p>

      <p>Elbo Tours (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your personal information. This policy explains what data we collect, how we use it, and your rights.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">1. Information We Collect</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li><strong>Contact details</strong> – name, email address, phone number provided via our contact or booking forms.</li>
        <li><strong>Trip details</strong> – travel dates, pickup/drop-off locations, number of passengers.</li>
        <li><strong>Usage data</strong> – pages visited, browser type, IP address (collected via Google Analytics).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">2. How We Use Your Information</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li>To respond to enquiries and confirm bookings.</li>
        <li>To send trip confirmations and operational communications.</li>
        <li>To improve our website and services through analytics.</li>
        <li>To comply with applicable legal obligations.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">3. Sharing of Information</h2>
      <p className="text-gray-700">We do not sell or rent your personal data. We may share it with trusted service providers (e.g., email delivery, analytics) solely to operate our services, under strict confidentiality obligations.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">4. Cookies</h2>
      <p className="text-gray-700">We use cookies for analytics (Google Analytics) and to improve your browsing experience. You can disable cookies in your browser settings at any time.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">5. Data Retention</h2>
      <p className="text-gray-700">We retain your personal data for as long as necessary to fulfil the purposes described above, or as required by law. Booking records are typically kept for 3 years.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">6. Your Rights</h2>
      <p className="text-gray-700">You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at <a href="mailto:contact@elbo-tours.com" className="text-[#C8960C] hover:underline">contact@elbo-tours.com</a>.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">7. Security</h2>
      <p className="text-gray-700">We implement appropriate technical and organisational measures to protect your data against unauthorised access, loss, or disclosure.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">8. Changes to This Policy</h2>
      <p className="text-gray-700">We may update this policy from time to time. The date at the top of this page reflects the latest revision.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">9. Contact</h2>
      <p className="text-gray-700">Elbo Tours – Marrakech, Morocco<br />
      Email: <a href="mailto:contact@elbo-tours.com" className="text-[#C8960C] hover:underline">contact@elbo-tours.com</a><br />
      Phone: <a href="tel:+212665889258" className="text-[#C8960C] hover:underline">+212 665-889258</a></p>
    </article>
  );
}

function FrContent() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de Confidentialité</h1>
      <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : juin 2025</p>

      <p>Elbo Tours (&laquo;&nbsp;nous&nbsp;&raquo;) s&apos;engage à protéger vos informations personnelles. Cette politique explique quelles données nous collectons, comment nous les utilisons et vos droits.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">1. Informations collectées</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li><strong>Coordonnées</strong> – nom, adresse e-mail, numéro de téléphone fournis via nos formulaires.</li>
        <li><strong>Détails du voyage</strong> – dates, lieux de prise en charge/dépose, nombre de passagers.</li>
        <li><strong>Données d&apos;utilisation</strong> – pages visitées, type de navigateur, adresse IP (via Google Analytics).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">2. Utilisation des données</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li>Répondre aux demandes et confirmer les réservations.</li>
        <li>Envoyer les confirmations de voyage et communications opérationnelles.</li>
        <li>Améliorer notre site et nos services grâce à l&apos;analyse des données.</li>
        <li>Respecter les obligations légales applicables.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">3. Partage des données</h2>
      <p className="text-gray-700">Nous ne vendons ni ne louons vos données personnelles. Nous pouvons les partager avec des prestataires de confiance (livraison d&apos;e-mails, analytics) uniquement pour exploiter nos services, sous strict accord de confidentialité.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">4. Cookies</h2>
      <p className="text-gray-700">Nous utilisons des cookies à des fins analytiques (Google Analytics) et pour améliorer votre expérience. Vous pouvez les désactiver dans les paramètres de votre navigateur.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">5. Conservation des données</h2>
      <p className="text-gray-700">Nous conservons vos données le temps nécessaire aux finalités décrites, ou tel que requis par la loi. Les dossiers de réservation sont généralement conservés 3 ans.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">6. Vos droits</h2>
      <p className="text-gray-700">Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Contactez-nous à <a href="mailto:contact@elbo-tours.com" className="text-[#C8960C] hover:underline">contact@elbo-tours.com</a>.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">7. Sécurité</h2>
      <p className="text-gray-700">Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">8. Modifications</h2>
      <p className="text-gray-700">Nous pouvons mettre à jour cette politique. La date en haut de page reflète la dernière révision.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">9. Contact</h2>
      <p className="text-gray-700">Elbo Tours – Marrakech, Maroc<br />
      E-mail : <a href="mailto:contact@elbo-tours.com" className="text-[#C8960C] hover:underline">contact@elbo-tours.com</a><br />
      Tél : <a href="tel:+212665889258" className="text-[#C8960C] hover:underline">+212 665-889258</a></p>
    </article>
  );
}
'''

# ── 2. Terms of Use page ──────────────────────────────────────────────────────
TERMS = r'''import type { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Terms of Use' : 'Conditions d\'Utilisation',
    description: isEn
      ? 'Terms and conditions governing the use of Elbo Tours services.'
      : 'Conditions générales régissant l\'utilisation des services Elbo Tours.',
    robots: { index: true, follow: true },
  };
}

export default function TermsPage({ params: { locale } }: { params: { locale: string } }) {
  const isEn = locale === 'en';
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {isEn ? <EnContent /> : <FrContent />}
    </main>
  );
}

function EnContent() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Use</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 2025</p>

      <p>By accessing or using the Elbo Tours website and services, you agree to be bound by these Terms of Use. Please read them carefully.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">1. Services</h2>
      <p className="text-gray-700">Elbo Tours provides private tours, airport transfers, and city-to-city transport services in Morocco. All bookings are subject to availability and confirmation by Elbo Tours.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">2. Bookings & Payment</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li>Bookings are confirmed upon receipt of a written confirmation from Elbo Tours.</li>
        <li>Payment terms are communicated at the time of booking confirmation.</li>
        <li>Prices are quoted in Moroccan Dirhams (MAD) or Euros (EUR) as indicated, and are subject to change without notice until a booking is confirmed.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">3. Cancellations & Refunds</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li><strong>48+ hours before departure:</strong> Full refund or free rescheduling.</li>
        <li><strong>24–48 hours before departure:</strong> 50% refund.</li>
        <li><strong>Less than 24 hours / no-show:</strong> No refund.</li>
        <li>Elbo Tours reserves the right to cancel a booking due to force majeure, extreme weather, or safety concerns, in which case a full refund or alternative date will be offered.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">4. Client Responsibilities</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li>Clients must provide accurate pickup information, including flight number for airport transfers.</li>
        <li>Clients are responsible for their personal belongings throughout the trip.</li>
        <li>Elbo Tours is not liable for delays caused by flight schedule changes, traffic, or other circumstances beyond our control.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">5. Liability</h2>
      <p className="text-gray-700">Elbo Tours carries appropriate vehicle insurance as required by Moroccan law. Our liability for any claim shall not exceed the total amount paid for the service in question. We are not liable for indirect or consequential losses.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">6. Intellectual Property</h2>
      <p className="text-gray-700">All content on this website — including text, images, and logos — is the property of Elbo Tours and may not be reproduced without written permission.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">7. Governing Law</h2>
      <p className="text-gray-700">These terms are governed by the laws of the Kingdom of Morocco. Any disputes shall be subject to the exclusive jurisdiction of the courts of Marrakech.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">8. Contact</h2>
      <p className="text-gray-700">Elbo Tours – Marrakech, Morocco<br />
      Email: <a href="mailto:contact@elbo-tours.com" className="text-[#C8960C] hover:underline">contact@elbo-tours.com</a><br />
      Phone: <a href="tel:+212665889258" className="text-[#C8960C] hover:underline">+212 665-889258</a></p>
    </article>
  );
}

function FrContent() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions d&apos;Utilisation</h1>
      <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : juin 2025</p>

      <p>En accédant au site et aux services d&apos;Elbo Tours, vous acceptez les présentes conditions. Veuillez les lire attentivement.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">1. Services</h2>
      <p className="text-gray-700">Elbo Tours propose des circuits privés, des transferts aéroport et des transports ville à ville au Maroc. Toute réservation est soumise à disponibilité et à confirmation écrite d&apos;Elbo Tours.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">2. Réservations et paiement</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li>La réservation est confirmée à réception d&apos;une confirmation écrite d&apos;Elbo Tours.</li>
        <li>Les modalités de paiement sont communiquées lors de la confirmation.</li>
        <li>Les tarifs sont indiqués en Dirhams marocains (MAD) ou en Euros (EUR) et peuvent être modifiés avant confirmation.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">3. Annulations et remboursements</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li><strong>Plus de 48 h avant le départ :</strong> Remboursement intégral ou report gratuit.</li>
        <li><strong>24 à 48 h avant le départ :</strong> Remboursement à 50 %.</li>
        <li><strong>Moins de 24 h / non-présentation :</strong> Aucun remboursement.</li>
        <li>Elbo Tours se réserve le droit d&apos;annuler une réservation en cas de force majeure, conditions météorologiques extrêmes ou raisons de sécurité, avec proposition de remboursement intégral ou de report.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">4. Responsabilités du client</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li>Le client doit fournir des informations de prise en charge exactes, y compris le numéro de vol pour les transferts aéroport.</li>
        <li>Le client est responsable de ses effets personnels durant le trajet.</li>
        <li>Elbo Tours décline toute responsabilité pour les retards dus à des modifications d&apos;horaires de vols, à la circulation ou à toute circonstance indépendante de notre volonté.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">5. Responsabilité</h2>
      <p className="text-gray-700">Elbo Tours dispose des assurances véhicule requises par la législation marocaine. Notre responsabilité est limitée au montant total payé pour le service concerné. Nous ne sommes pas responsables des pertes indirectes ou consécutives.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">6. Propriété intellectuelle</h2>
      <p className="text-gray-700">Tout le contenu de ce site – textes, images, logos – est la propriété d&apos;Elbo Tours et ne peut être reproduit sans autorisation écrite.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">7. Droit applicable</h2>
      <p className="text-gray-700">Les présentes conditions sont régies par le droit du Royaume du Maroc. Tout litige sera soumis à la compétence exclusive des tribunaux de Marrakech.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">8. Contact</h2>
      <p className="text-gray-700">Elbo Tours – Marrakech, Maroc<br />
      E-mail : <a href="mailto:contact@elbo-tours.com" className="text-[#C8960C] hover:underline">contact@elbo-tours.com</a><br />
      Tél : <a href="tel:+212665889258" className="text-[#C8960C] hover:underline">+212 665-889258</a></p>
    </article>
  );
}
'''

# ── 3. Updated Footer.tsx ─────────────────────────────────────────────────────
FOOTER = r'''import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();

  return (
    <footer className="bg-[#1A1A2E] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Image
              src="/images/logo.png"
              alt="Elbo Tours"
              width={130}
              height={46}
              className="h-11 w-auto object-contain mb-4 brightness-0 invert"
            />
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">{t('desc')}</p>
            <div className="flex gap-4 mt-5">
              <a href="https://wa.me/212665889258" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#C8960C] hover:text-[#C8960C] transition-colors text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#C8960C] hover:text-[#C8960C] transition-colors text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#C8960C] hover:text-[#C8960C] transition-colors text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56-.79.31-1.47.72-2.14 1.39-.67.67-1.08 1.35-1.39 2.14-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.47 1.39 2.14.67.67 1.35 1.08 2.14 1.39.76.3 1.63.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56.79-.31 1.47-.72 2.14-1.39.67-.67 1.08-1.35 1.39-2.14.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91-.31-.79-.72-1.47-1.39-2.14-.67-.67-1.35-1.08-2.14-1.39-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0z"/><path d="M12 5.84A6.16 6.16 0 1012 18.16 6.16 6.16 0 0012 5.84zm0 10.16a4 4 0 110-8 4 4 0 010 8z"/><circle cx="18.41" cy="5.59" r="1.44"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#C8960C] hover:text-[#C8960C] transition-colors text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.87.55 9.38.55 9.38.55s7.51 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.6 15.6V8.4l6.27 3.6-6.27 3.6z"/></svg>
              </a>
              <div id="TA_rated369" className="TA_rated flex items-center">
                <ul id="JWmEUz8p8e" className="TA_links 73An2c2 list-none m-0 p-0">
                  <li id="v6HgWV" className="9OrnlppIbcb">
                    <a target="_blank" rel="noopener noreferrer" href="https://www.tripadvisor.com/Attraction_Review-g293732-d34341288-Reviews-Elbo_Tours-Casablanca_Casablanca_Settat.html">
                      <img src="https://www.tripadvisor.com/img/cdsi/img2/badges/ollie-11424-2.gif" alt="TripAdvisor" className="h-9 w-auto" />
                    </a>
                  </li>
                </ul>
              </div>
              <Script
                async
                src="https://www.jscache.com/wejs?wtype=rated&uniq=369&locationId=34341288&lang=en_US&display_version=2"
                strategy="lazyOnload"
              />
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}`} className="hover:text-[#C8960C] transition-colors">{nav('home')}</Link></li>
              <li><Link href={`/${locale}/tours`} className="hover:text-[#C8960C] transition-colors">{nav('tours')}</Link></li>
              <li><Link href={`/${locale}/fleet`} className="hover:text-[#C8960C] transition-colors">{nav('fleet')}</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-[#C8960C] transition-colors">{nav('about')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-[#C8960C] transition-colors">{nav('contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><span className="text-[#C8960C] mt-0.5">📍</span> Marrakech, Morocco</li>
              <li className="flex items-start gap-2"><span className="text-[#C8960C]">📞</span><a href="tel:+212665889258" className="hover:text-[#C8960C]">+212 665-889258</a></li>
              <li className="flex items-start gap-2"><span className="text-[#C8960C]">✉️</span><a href="mailto:contact@elbo-tours.com" className="hover:text-[#C8960C]">contact@elbo-tours.com</a></li>
              <li className="flex items-start gap-2"><span className="text-[#C8960C]">🕐</span> 7 days, 8am – 9pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>{t('copyright')}</p>
          <div className="flex gap-6">
            <Link href={`/${locale}/privacy-policy`} className="hover:text-[#C8960C] transition-colors">
              {locale === 'en' ? 'Privacy Policy' : 'Politique de Confidentialité'}
            </Link>
            <Link href={`/${locale}/terms-of-use`} className="hover:text-[#C8960C] transition-colors">
              {locale === 'en' ? 'Terms of Use' : "Conditions d'Utilisation"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
'''

# ── Write files ───────────────────────────────────────────────────────────────
files = {
    r"app\[locale]\privacy-policy\page.tsx": PRIVACY,
    r"app\[locale]\terms-of-use\page.tsx": TERMS,
    r"components\layout\Footer.tsx": FOOTER,
}

for rel_path, content in files.items():
    full_path = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Written: {rel_path}")

print("\nDone. Commit and push to deploy.")
