'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import TypewriterText from './components/TypewriterText';
import CountUp from './components/CountUp';
import BoutiqueCard from './components/BoutiqueCard';
import HeroCarousel from './components/HeroCarousel';

interface Boutique {
  id: number;
  nom: string;
  description: string;
  articles?: any[];
}

export default function HomePage() {
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/catalogue/boutiques/`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Boutiques reçues:', data);
        const boutiquesArray = Array.isArray(data) ? data : data.results || [];
        setBoutiques(boutiquesArray);
      })
      .catch((err) => console.error('Erreur:', err))
      .finally(() => setChargement(false));
  }, []);

  return (
    <main className="min-h-screen">
      {/* ============ HERO ============ */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Carrousel d'images en arrière-plan */}
        <HeroCarousel />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 backdrop-blur-md border border-orange-500/30 text-orange-300 text-xs font-medium tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Marché d'Adjamé — Abidjan
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6">
            Le marché d'Adjamé,
            <br />
            <TypewriterText
              texts={[
                'à portée de clic.',
                'livré chez vous.',
                'sans intermédiaire.',
                'au meilleur prix.',
              ]}
              className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent"
            />
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Découvrez les boutiques et commerçants du marché, comparez les prix
            et commandez en toute simplicité.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/articles"
              className="group px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Explorer les articles
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/inscription"
              className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-white/10 hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              Créer un compte
            </Link>
          </div>

          <div className="mt-16 inline-flex flex-wrap justify-center gap-x-12 gap-y-6 px-8 py-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                <CountUp end={boutiques.length} duration={1500} />
              </div>
              <div className="text-xs text-stone-400 uppercase tracking-widest mt-1">
                Boutiques
              </div>
            </div>
            <div className="w-px bg-white/10 hidden sm:block" />
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                <CountUp end={100} duration={2000} suffix="%" />
              </div>
              <div className="text-xs text-stone-400 uppercase tracking-widest mt-1">
                Local
              </div>
            </div>
            <div className="w-px bg-white/10 hidden sm:block" />
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                <CountUp end={24} duration={1800} suffix="h" />
              </div>
              <div className="text-xs text-stone-400 uppercase tracking-widest mt-1">
                Livraison
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BOUTIQUES EN VEDETTE ============ */}
      <section className="relative px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
              Découvrir
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-3 tracking-tight">
              Boutiques en vedette
            </h2>
            <p className="text-stone-400">
              {chargement
                ? 'Chargement des boutiques...'
                : `${boutiques.length} boutique(s) disponible(s) sur le marché`}
            </p>
          </div>

          {chargement && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/5 rounded-3xl border border-white/10 h-72 animate-pulse"
                />
              ))}
            </div>
          )}

          {!chargement && boutiques.length === 0 && (
            <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-stone-400">
                Aucune boutique disponible pour le moment.
              </p>
            </div>
          )}

          {!chargement && boutiques.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {boutiques.map((boutique) => (
                <BoutiqueCard key={boutique.id} boutique={boutique} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}