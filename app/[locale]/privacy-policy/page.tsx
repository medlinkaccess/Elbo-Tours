import type { Metadata } from 'next';
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
