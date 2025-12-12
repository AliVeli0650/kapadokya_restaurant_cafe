import Link from 'next/link';

export default function RedirectUberEatsDe() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Vorübergehende Weiterleitung</h1>
        <p className="mb-6 text-gray-700">
          Bestellungen nehmen wir aktuell über UberEats entgegen.<br />
          Bitte klicken Sie auf den Button unten, um Ihre Bestellung aufzugeben.
        </p>
        <Link href="https://www.ubereats.com/de" target="_blank" rel="noopener noreferrer">
          <span className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded transition-colors duration-200">
            Über UberEats bestellen
          </span>
        </Link>
        <p className="mt-6 text-xs text-gray-400">Diese Seite wurde vorübergehend weitergeleitet.</p>
      </div>
    </div>
  );
}
