'use client';

import { useEffect, useState, useMemo } from 'react';
import { usePanier } from '../contexts/PanierContext';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface Article {
  id: number;
  nom: string;
  prix: number;
  boutique: number;
  boutique_nom?: string;
  image?: string | null;
  description?: string | null;
  stock?: number;
}

interface Boutique {
  id: number;
  nom: string;
}

const IMAGES_FALLBACK = [
  'https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=800',
  'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=800',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800',
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [chargement, setChargement] = useState(true);
  const { ajouterArticle } = usePanier();
  const [ajoutes, setAjoutes] = useState<Set<number>>(new Set());

  const [recherche, setRecherche] = useState('');
  const [boutiqueFiltre, setBoutiqueFiltre] = useState('toutes');
  const [prixMin, setPrixMin] = useState<number | ''>('');
  const [prixMax, setPrixMax] = useState<number | ''>('');
  const [tri, setTri] = useState('recent');
  const [afficherFiltres, setAfficherFiltres] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/catalogue/articles/`).then((res) => res.json()),
      fetch(`${API_URL}/api/catalogue/boutiques/`).then((res) => res.json()),
    ])
      .then(([articlesData, boutiquesData]) => {
        const articlesArray = Array.isArray(articlesData) ? articlesData : articlesData.results || [];
        const boutiquesArray = Array.isArray(boutiquesData) ? boutiquesData : boutiquesData.results || [];
        setArticles(articlesArray);
        setBoutiques(boutiquesArray);
      })
      .catch((error) => console.error('Erreur de chargement:', error))
      .finally(() => setChargement(false));
  }, []);

  const articlesFiltres = useMemo(() => {
    let resultat = [...articles];
    if (recherche.trim()) {
      const q = recherche.toLowerCase().trim();
      resultat = resultat.filter((a) => a.nom.toLowerCase().includes(q));
    }
    if (boutiqueFiltre !== 'toutes') {
      resultat = resultat.filter((a) => String(a.boutique) === boutiqueFiltre);
    }
    if (prixMin !== '' && !isNaN(Number(prixMin))) {
      resultat = resultat.filter((a) => a.prix >= Number(prixMin));
    }
    if (prixMax !== '' && !isNaN(Number(prixMax))) {
      resultat = resultat.filter((a) => a.prix <= Number(prixMax));
    }
    if (tri === 'prix-asc') resultat.sort((a, b) => a.prix - b.prix);
    else if (tri === 'prix-desc') resultat.sort((a, b) => b.prix - a.prix);
    else if (tri === 'nom-asc') resultat.sort((a, b) => a.nom.localeCompare(b.nom));
    return resultat;
  }, [articles, recherche, boutiqueFiltre, prixMin, prixMax, tri]);

  const reinitialiserFiltres = () => {
    setRecherche('');
    setBoutiqueFiltre('toutes');
    setPrixMin('');
    setPrixMax('');
    setTri('recent');
  };

  const nbFiltresActifs = [
    recherche.trim() !== '',
    boutiqueFiltre !== 'toutes',
    prixMin !== '',
    prixMax !== '',
    tri !== 'recent',
  ].filter(Boolean).length;

  const handleAjouter = (article: Article) => {
    ajouterArticle({
      id: article.id,
      nom: article.nom,
      prix: article.prix,
      boutique: article.boutique,
      boutiqueNom: article.boutique_nom || `Boutique #${article.boutique}`,
    });
    setAjoutes((prev) => new Set(prev).add(article.id));
    setTimeout(() => {
      setAjoutes((prev) => {
        const next = new Set(prev);
        next.delete(article.id);
        return next;
      });
    }, 1500);
  };

  const getImage = (article: Article) => {
    if (article.image) return article.image;
    return IMAGES_FALLBACK[article.id % IMAGES_FALLBACK.length];
  };

  return (
    <main className="min-h-screen pt-28 pb-20">
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">Catalogue</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-2 mb-3">
            Tous les articles
          </h1>
          <p className="text-stone-400">
            {chargement ? 'Chargement...' : `${articlesFiltres.length} article(s) affiché(s) sur ${articles.length}`}
          </p>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-4 py-3.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition"
              />
            </div>
            <button
              onClick={() => setAfficherFiltres((v) => !v)}
              className={`relative px-5 py-3.5 rounded-full border font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                afficherFiltres || nbFiltresActifs > 0
                  ? 'bg-orange-500/10 border-orange-500/50 text-orange-400'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="hidden sm:inline">Filtres</span>
              {nbFiltresActifs > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-orange-500 to-amber-600 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center">
                  {nbFiltresActifs}
                </span>
              )}
            </button>
          </div>

          {afficherFiltres && (
            <div className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Boutique</label>
                  <select value={boutiqueFiltre} onChange={(e) => setBoutiqueFiltre(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                    <option value="toutes" className="bg-[#0a0a0a]">Toutes les boutiques</option>
                    {boutiques.map((b) => (
                      <option key={b.id} value={String(b.id)} className="bg-[#0a0a0a]">{b.nom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Prix min (FCFA)</label>
                  <input type="number" min="0" placeholder="0" value={prixMin} onChange={(e) => setPrixMin(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Prix max (FCFA)</label>
                  <input type="number" min="0" placeholder="Illimité" value={prixMax} onChange={(e) => setPrixMax(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Trier par</label>
                  <select value={tri} onChange={(e) => setTri(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                    <option value="recent" className="bg-[#0a0a0a]">Plus récents</option>
                    <option value="prix-asc" className="bg-[#0a0a0a]">Prix croissant</option>
                    <option value="prix-desc" className="bg-[#0a0a0a]">Prix décroissant</option>
                    <option value="nom-asc" className="bg-[#0a0a0a]">Nom (A-Z)</option>
                  </select>
                </div>
              </div>
              {nbFiltresActifs > 0 && (
                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button onClick={reinitialiserFiltres} className="text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors">✕ Réinitialiser tous les filtres</button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-4">
        <div className="max-w-6xl mx-auto">
          {chargement ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden animate-pulse">
                  <div className="h-48 bg-white/5"></div>
                  <div className="p-5">
                    <div className="h-4 bg-white/5 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-white/5 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : articlesFiltres.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-6xl mb-4 opacity-60">🔍</div>
              <p className="text-stone-400 mb-2">Aucun article ne correspond à vos critères.</p>
              {nbFiltresActifs > 0 && (
                <button onClick={reinitialiserFiltres} className="mt-4 text-sm text-orange-400 hover:text-orange-300 font-medium">Réinitialiser les filtres</button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articlesFiltres.map((article) => (
                <div key={article.id} className="group relative bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-500 flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${getImage(article)}')` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-orange-300">
                      {article.boutique_nom || `Boutique #${article.boutique}`}
                    </span>
                    {article.stock !== undefined && article.stock <= 3 && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-500/80 backdrop-blur-md text-white">Stock {article.stock}</span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-lg font-semibold text-white mb-1 line-clamp-1">{article.nom}</h2>
                    <p className="text-stone-400 text-sm line-clamp-2 mb-4">{article.description || 'Découvrez cet article du marché.'}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                        {article.prix.toLocaleString('fr-FR')} FCFA
                      </span>
                      <button onClick={() => handleAjouter(article)} disabled={ajoutes.has(article.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${ajoutes.has(article.id) ? 'bg-green-500/20 text-green-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105'}`}>
                        {ajoutes.has(article.id) ? '✓ Ajouté' : 'Ajouter'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}