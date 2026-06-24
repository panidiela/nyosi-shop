import Image from "next/image";
import Link from "next/link";

export default function Accueil() {
  return (
    <div className="min-h-screen bg-[#FCB001] flex flex-col items-center justify-center px-6 text-black text-center">

      {/* Logo principal */}
      <div className="mb-8">
        <Image
          src="/logo.png"
          alt="Nyosi"
          width={180}
          height={70}
          priority
          className="mx-auto"
        />
      </div>

      <p className="text-black/80 text-lg mb-2 max-w-xs font-medium leading-snug">
        Transforme ton WhatsApp et ton Facebook en boutique.
      </p>
      <p className="text-black/60 text-sm mb-10 max-w-xs">
        Tes clients commandent sans t&apos;envoyer un seul message.
      </p>

      <Link
        href="/marie-gateaux"
        className="bg-black text-[#FCB001] font-bold px-6 py-4 rounded-2xl text-base shadow-md active:opacity-80"
      >
        Voir la boutique de Marie 🍰
      </Link>
    </div>
  );
}
