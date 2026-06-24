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
        href="/creer-boutique"
        className="bg-black text-[#FCB001] font-bold px-6 py-4 rounded-2xl text-base shadow-md active:opacity-80 w-full max-w-xs text-center"
      >
        Créer ma boutique <Image src="/logo-icon.png" alt="" width={20} height={20} className="inline ml-1 align-middle" />
      </Link>

      <Link
        href="/marie-gateaux"
        className="mt-4 text-black/60 text-sm underline underline-offset-2"
      >
        Voir un exemple de boutique →
      </Link>
    </div>
  );
}
