import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-pgd-red mb-4">404</div>
        <h1 className="text-2xl font-bold text-pgd-gray mb-3">Stran ni najdena</h1>
        <p className="text-gray-500 mb-8">Ta stran ne obstaja ali je bila premaknjena.</p>
        <Link
          href="/"
          className="bg-pgd-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-pgd-red-dark transition-colors inline-block"
        >
          Nazaj na domačo stran
        </Link>
      </div>
    </div>
  );
}
