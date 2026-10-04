'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Article {
  id: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  boutique: number;
}

export default function VendeurArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const chargerArticles = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/connexion');
      return;
    }

    fetch('http://127.0.0.1:8000/api/catalogue/articles/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur de chargement');
        return res.json();
      })
      .then((data) => {
        setArticles(data);
        setErreur('');
      })
      .catch(() => setErreur('Impossible de charger les articles.'))
      .finally(() => setChargement(false));
  };

  useEffect(() => {
    chargerArticles();
  }, []);

  if (chargement) {
    return (
      <main className="min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="h-10 w-64 bg-white/5 rounded animate-pulse mb-8"></div>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 h-40 animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
              Espace vendeur
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white mt-2 mb-2">
              Mes articles
            </h1>
            <p className="text-stone-400">
              {articles.length} article(s) en vente
            </p>
          </div>

          <Link
            href="/vendeur/articles/nouveau"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvel article
          </Link>
        </div>

        {erreur && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">
            {erreur}
          </div>
        )}

        {articles.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10">
            <div className="text-7xl mb-4 opacity-80">📦</div>
            <p className="text-stone-400 mb-6">
              Vous n'avez pas encore d'articles.
            </p>
            <Link
              href="/vendeur/articles/nouveau"
              className="inline-block bg-gradient-to-r from-orange-500 to-amber-600 text-white font-medium px-6 py-3 rounded-full hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
            >
              Créer mon premier article
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="group bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:border-orange-500/40 hover:-translate-y-1 transition-all duration-500 flex flex-col"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1">
                    {article.nom}
                  </h3>
                  <p className="text-stone-400 text-sm line-clamp-2 mb-4">
                    {article.description || 'Pas de description'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <p className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                      {article.prix.toLocaleString('fr-FR')} FCFA
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Stock: {article.stock}
                    </p>
                  </div>
                  <Link
                    href={`/vendeur/articles/${article.id}`}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-stone-300 hover:bg-orange-500/10 hover:text-orange-400 hover:border-orange-500/30 transition-all duration-300"
                  >
                    Modifier
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}