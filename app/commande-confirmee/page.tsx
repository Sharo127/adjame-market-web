'use client';

import Link from 'next/link';

export default function CommandeConfirmeePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-28 pb-16">
      <div className="text-center max-w-lg">
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute w-32 h-32 bg-green-500/20 rounded-full blur-3xl" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/40">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
          Confirmation
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-3 mb-4">
          Commande validée !
        </h1>
        <p className="text-stone-400 text-lg mb-8">
          Votre commande a bien été enregistrée. Le vendeur va la confirmer et
          vous recevrez un email à chaque étape.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/mes-commandes"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 transition-all duration-300"
          >
            Voir mes commandes
          </Link>
          <Link
            href="/articles"
            className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-white/10 hover:scale-105 transition-all duration-300"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </main>
  );
}