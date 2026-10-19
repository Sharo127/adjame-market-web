'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TypewriterText from './components/TypewriterText';
import CountUp from './components/CountUp';
import BoutiqueCard from './components/BoutiqueCard';
import HeroCarousel from './components/HeroCarousel';
import Footer from './components/Footer';

const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface Boutique {
  id: number;
  nom: string;
  description: string;
  image: string | null;
  articles?: any[];
}

// Variantes d'animation pour les sections
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

export default function HomePage() {
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/catalogue/boutiques/`)
      .then((res) => res.json())
      .then((data) => {
        const boutiquesArray = Array.isArray(data) ? data : data.results || [];
        setBoutiques(boutiquesArray);
      })
      .catch((err) => console.error('Erreur:', err))
      .finally(() => setChargement(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        <HeroCarousel />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge animé */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 backdrop-blur-md border border-orange-500/30 text-orange-300 text-xs font-medium tracking-widest uppercase mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Marché d'Adjamé — Abidjan
          </motion.div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 flex flex-col items-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white"
            >
              Le marché d'Adjamé,
            </motion.span>
            
            <div className="min-h-[1.2em] mt-2">
              <TypewriterText
                texts={[
                  'à portée de clic.',
                  'livré chez vous.',
                  'sans intermédiaire.',
                  'au meilleur prix.',
                ]}
                className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]"
              />
            </div>
          </h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light tracking-wide"
          >
            Découvrez les boutiques et commerçants du marché, comparez les prix
            et commandez en toute simplicité.
          </motion.p>

          {/* Boutons d'action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/articles"
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">Explorer les articles</span>
              <svg className="relative w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/inscription"
              className="px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-white/10 hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              Créer un compte
            </Link>
          </motion.div>

          {/* Statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 inline-flex flex-wrap justify-center gap-x-12 gap-y-6 px-8 py-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-orange-500/30 transition-colors duration-500"
          >
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                <CountUp end={boutiques.length} duration={1500} />
              </div>
              <div className="text-xs text-stone-400 uppercase tracking-widest mt-1">
                Boutiques
              </div>
            </div>
            <div className="w-px bg-white/10 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                <CountUp end={100} duration={2000} suffix="%" />
              </div>
              <div className="text-xs text-stone-400 uppercase tracking-widest mt-1">
                Local
              </div>
            </div>
            <div className="w-px bg-white/10 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                <CountUp end={24} duration={1800} suffix="h" />
              </div>
              <div className="text-xs text-stone-400 uppercase tracking-widest mt-1">
                Livraison
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ BOUTIQUES EN VEDETTE ============ */}
      <section className="relative px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            custom={0}
            className="mb-12"
          >
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
          </motion.div>

          {chargement && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/5 rounded-3xl border border-white/10 h-80 animate-pulse"
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
              {boutiques.map((boutique, index) => (
                <motion.div
                  key={boutique.id}
                  custom={index + 1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUp}
                >
                  <BoutiqueCard boutique={boutique} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ COMMENT ÇA MARCHE ============ */}
      <section className="relative px-6 py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
              Simple & Rapide
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4 tracking-tight">
              Comment ça marche ?
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto">
              Acheter sur le marché d'Adjamé n'a jamais été aussi simple. Trois étapes suffisent.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0" />

            {[
              {
                step: '01',
                title: 'Explorez',
                description: 'Parcourez les boutiques et découvrez les articles proposés par les commerçants.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Commandez',
                description: 'Ajoutez vos articles au panier et validez votre commande en quelques clics.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Recevez',
                description: 'Votre commande est préparée et livrée directement chez vous en un temps record.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 h-full">
                  <div className="absolute top-6 right-6 text-6xl font-black text-white/5 group-hover:text-orange-500/10 transition-colors duration-500">
                    {item.step}
                  </div>
                  
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                    {item.icon}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-stone-400 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <Footer />
    </main>
  );
}