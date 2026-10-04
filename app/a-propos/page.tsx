'use client';

import Link from 'next/link';

export default function AProposPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-12">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
            Notre histoire
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-3 mb-4">
            À propos d'Adjamé Market
          </h1>
          <p className="text-stone-400 text-lg leading-relaxed max-w-2xl">
            Nous connectons les commerçants du marché d'Adjamé aux clients de toute
            la Côte d'Ivoire, avec une seule promesse : rendre le commerce local
            accessible à tous, partout, à tout moment.
          </p>
        </div>

        {/* Mission */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent rounded-3xl border border-orange-500/20 p-8 mb-12">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-4">Notre mission</h2>
            <p className="text-stone-300 leading-relaxed">
              Le marché d'Adjamé est l'un des plus grands et des plus dynamiques
              d'Afrique de l'Ouest. Des milliers de commerçants y vendent chaque
              jour des tissus, des vêtements, des cosmétiques et bien plus encore.
              Pourtant, cette richesse reste souvent invisible au-delà des
              frontières du marché.
            </p>
            <p className="text-stone-300 leading-relaxed mt-4">
              <span className="font-semibold text-white">Adjamé Market</span> a
              été créé pour changer cela : donner aux vendeurs une vitrine
              numérique et aux clients un accès simple, rapide et sécurisé aux
              trésors du marché.
            </p>
          </div>
        </div>

        {/* Chiffres clés */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { value: '2026', label: 'Année de création' },
            { value: '100%', label: 'Ivoirien' },
            { value: '3', label: 'Rôles : client, vendeur, livreur' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-stone-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Valeurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Nos valeurs</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                emoji: '🤝',
                title: 'Proximité',
                desc: "Nous valorisons le commerce local et les relations humaines.",
              },
              {
                emoji: '🔒',
                title: 'Confiance',
                desc: "Transactions sécurisées et vendeurs vérifiés.",
              },
              {
                emoji: '⚡',
                title: 'Simplicité',
                desc: "Une expérience pensée pour tous, même sans expérience numérique.",
              },
              {
                emoji: '🌍',
                title: 'Ouverture',
                desc: "Rendre le marché accessible partout en Côte d'Ivoire.",
              },
            ].map((valeur, i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-orange-500/40 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{valeur.emoji}</div>
                <h3 className="font-semibold text-white mb-2">{valeur.title}</h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  {valeur.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 transition-all duration-300"
          >
            Découvrir le marché
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}