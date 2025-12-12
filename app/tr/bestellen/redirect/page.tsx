import Link from 'next/link';

export default function RedirectUberEats() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Geçici Yönlendirme</h1>
        <p className="mb-6 text-gray-700">
          Siparişlerinizi şu anda UberEats üzerinden alıyoruz.<br />
          Lütfen sipariş vermek için aşağıdaki butona tıklayınız.
        </p>
        <Link href="https://www.ubereats.com/tr" target="_blank" rel="noopener noreferrer">
          <span className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded transition-colors duration-200">
            UberEats üzerinden sipariş ver
          </span>
        </Link>
        <p className="mt-6 text-xs text-gray-400">Bu sayfa geçici olarak yönlendirilmiştir.</p>
      </div>
    </div>
  );
}
