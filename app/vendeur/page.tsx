'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface Stats {
  par_statut: Record<string, number>;
  ca_total: number;
  ca_mois: number;
  nb_articles: number;
  top_articles: Array<{ nom: string; quantite: number }>;
}

export default function VendeurDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/connexion');
      return;
    }

    fetch(`${API_URL}/api/commandes/sous-commandes/stats-vendeur/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur de chargement');
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => {
        console.error(err);
        setErreur('Impossible de charger les statistiques.');
      })
      .finally(() => setChargement(false));
  }, [router]);

  if (chargement) {
    return (
      <main className="min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-10 w-64 bg-white/5 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/5 rounded-2xl border border-white/10 p-6 h-32 animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
            Espace vendeur
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-2 mb-2">
            Tableau de bord
          </h1>
          <p className="text-stone-400">
            Aperçu de votre activité sur Adjamé Market.
          </p>
        </div>

        {erreur && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">
            {erreur}
          </div>
        )}

        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-2xl border border-orange-500/20 p-6">
                <p className="text-xs text-orange-400 font-bold uppercase tracking-widest mb-2">
                  CA total
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.ca_total.toLocaleString('fr-FR')}{' '}
                  <span className="text-sm font-medium text-stone-400">FCFA</span>
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-2xl border border-green-500/20 p-6">
                <p className="text-xs text-green-400 font-bold uppercase tracking-widest mb-2">
                  CA ce mois
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.ca_mois.toLocaleString('fr-FR')}{' '}
                  <span className="text-sm font-medium text-stone-400">FCFA</span>
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-2xl border border-blue-500/20 p-6">
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">
                  Articles en vente
                </p>
                <p className="text-2xl font-bold text-white">{stats.nb_articles}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-2xl border border-purple-500/20 p-6">
                <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-2">
                  Commandes actives
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.par_statut.en_attente +
                    stats.par_statut.confirmee +
                    stats.par_statut.en_preparation +
                    stats.par_statut.prete}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h2 className="text-lg font-bold text-white mb-5">
                  Commandes par statut
                </h2>
                <div className="space-y-3">
                  {[
                    { key: 'en_attente', label: 'En attente', color: 'text-yellow-400' },
                    { key: 'confirmee', label: 'Confirmée', color: 'text-blue-400' },
                    { key: 'en_preparation', label: 'En préparation', color: 'text-blue-400' },
                    { key: 'prete', label: 'Prête', color: 'text-purple-400' },
                    { key: 'en_livraison', label: 'En livraison', color: 'text-purple-400' },
                    { key: 'livree', label: 'Livrée', color: 'text-green-400' },
                    { key: 'terminee', label: 'Terminée', color: 'text-green-400' },
                  ].map((s) => (
                    <div key={s.key} className="flex items-center justify-between">
                      <span className="text-sm text-stone-300">{s.label}</span>
                      <span className={`text-sm font-bold ${s.color}`}>
                        {stats.par_statut[s.key] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h2 className="text-lg font-bold text-white mb-5">Top 3 des ventes</h2>
                {stats.top_articles.length === 0 ? (
                  <p className="text-stone-500 text-sm text-center py-8">
                    Aucune vente pour le moment.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {stats.top_articles.map((a, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                            i === 0
                              ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-white'
                              : i === 1
                              ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white'
                              : 'bg-gradient-to-br from-orange-700 to-orange-800 text-white'
                          }`}
                        >
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium line-clamp-1">
                            {a.nom}
                          </p>
                          <p className="text-xs text-stone-500">{a.quantite} vendu(s)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/vendeur/commandes"
                className="group flex items-center gap-4 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-orange-500/40 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-2xl">
                  📦
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">Commandes reçues</p>
                  <p className="text-xs text-stone-400 mt-1">
                    {stats.par_statut.en_attente} en attente de traitement
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-stone-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <Link
                href="/vendeur/articles"
                className="group flex items-center gap-4 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-orange-500/40 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-2xl">
                  🏪
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">Mes articles</p>
                  <p className="text-xs text-stone-400 mt-1">
                    {stats.nb_articles} article(s) en vente
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-stone-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}