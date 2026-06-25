import Image from "next/image";
import Link from "next/link";

export default function Accueil() {
  return (
    <div className="min-h-screen bg-[#075E54] flex flex-col">

      {/* Zone centrale */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-16">

        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo-blanc.png"
            alt="Nyosi"
            width={160}
            height={62}
            priority
            className="mx-auto h-14 w-auto object-contain"
          />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#25D366] block"></span>
          <span className="text-white/90 text-xs font-medium tracking-wide">WhatsApp + Facebook First</span>
        </div>

        <h1 className="text-white text-3xl font-bold leading-tight mb-3 max-w-xs">
          Ta boutique en ligne en 2 minutes
        </h1>
        <p className="text-white/70 text-base mb-10 max-w-xs leading-relaxed">
          Partage ton lien, reçois tes commandes clairement.
        </p>

        {/* Bouton principal */}
        <Link
          href="/creer-boutique"
          className="w-full max-w-xs bg-[#25D366] text-white font-bold px-6 py-4 rounded-2xl text-base shadow-lg active:opacity-80 text-center flex items-center justify-center gap-2"
        >
          Créer ma boutique gratuite
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>

        <Link
          href="/marie-gateaux"
          className="mt-5 text-white/60 text-sm underline underline-offset-4"
        >
          Voir un exemple de boutique →
        </Link>
      </div>

      {/* Footer */}
      <div className="pb-8 px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <span className="text-white/50 text-xs">100% gratuit</span>
          <span className="text-white/20">·</span>
          <span className="text-white/50 text-xs">2 minutes</span>
          <span className="text-white/20">·</span>
          <span className="text-white/50 text-xs">Sans carte bancaire</span>
        </div>
        <p className="text-white/25 text-xs">nyosi.cm</p>
      </div>
    </div>
  );
}
