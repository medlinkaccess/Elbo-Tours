import type { Metadata } from 'next';

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
      Email: <a href="mailto:elbotours2025@gmail.com" className="text-[#C8960C] hover:underline">elbotours2025@gmail.com</a><br />
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
      E-mail : <a href="mailto:elbotours2025@gmail.com" className="text-[#C8960C] hover:underline">elbotours2025@gmail.com</a><br />
      Tél : <a href="tel:+212665889258" className="text-[#C8960C] hover:underline">+212 665-889258</a></p>
    </article>
  );
}
