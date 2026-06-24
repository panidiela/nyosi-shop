import Link from "next/link";

export default function Accueil() {
  return (
    <div className="min-h-screen bg-orange-500 flex flex-col items-center justify-center px-6 text-white text-center">
      <div className="text-6xl mb-4">🐝</div>
      <h1 className="text-4xl font-bold mb-3">Nyosi</h1>
      <p className="text-orange-100 text-lg mb-8 max-w-xs">
        Ta boutique en ligne en 2 minutes. Partage le lien sur WhatsApp et reçois des commandes.
      </p>
      <Link
        href="/marie-gateaux"
        className="bg-white text-orange-500 font-bold px-6 py-4 rounded-2xl text-base shadow-md"
      >
        Voir la boutique de Marie 🍰
      </Link>
    </div>
  );
}
