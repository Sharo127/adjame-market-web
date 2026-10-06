'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePanier, ArticlePanier } from '../contexts/PanierContext';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function PanierPage() {
  const router = useRouter();
  const { articles, retirerArticle, viderPanier } = usePanier();
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [adresse, setAdresse] = useState('');

  const total = articles.reduce((sum, a) => sum + a.prix * a.quantite, 0);

  const parBoutique = articles.reduce(
    (acc: Record<number, ArticlePanier[]>, article) => {
      if (!acc[article.boutique]) acc[article.boutique] = [];
      acc[article.boutique].push(article);
      return acc;
    },
    {} as Record<number, ArticlePanier[]>
  );

  const handleCommander = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/connexion');
      return;
    }

    if (!adresse.trim()) {
      setErreur("Merci d'indiquer une adresse de livraison.");
      return;
    }

    setErreur('');
    setChargement(true);

    try {
      const resCommande = await fetch(`${API_URL}/api/commandes/commandes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adresse_livraison: adresse }),
      });

      if (!resCommande.ok) {
        const errorData = await resCommande.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Erreur lors de la création de la commande');
      }

      const commande = await resCommande.json();

      for (const boutiqueId of Object.keys(parBoutique)) {
        const resSousCommande = await fetch(`${API_URL}/api/commandes/sous-commandes/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            commande: commande.id,
            boutique: parseInt(boutiqueId),
          }),
        });

        if (!resSousCommande.ok) {
          const errorData = await resSousCommande.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Erreur lors de la création de la sous-commande');
        }

        const sousCommande = await resSousCommande.json();

        for (const article of parBoutique[Number(boutiqueId)]) {
          const resLigne = await fetch(`${API_URL}/api/commandes/lignes/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              sous_commande: sousCommande.id,
              article: article.id,
              quantite: article.quantite,
              prix_unitaire: article.prix,
            }),
          });

          if (!resLigne.ok) {
            const errorData = await resLigne.json().catch(() => ({}));
            throw new Error(errorData.detail || "Erreur lors de l'ajout d'un article");
          }
        }
      }

      viderPanier();
      window.location.href = '/commande-confirmee';
    } catch (err: any) {
      setErreur(err.message || 'Une erreur est survenue lors de la commande.');
      setChargement(false);
    }
  };

  if (articles.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 pt-28 pb-16">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6 opacity-80">🛒</div>
          <h1 className="text-3xl font-bold text-white mb-3">Votre panier est vide</h1>
          <p className="text-stone-400 mb-8">Parcourez nos articles pour commencer vos achats au marché d'Adjamé.</p>
          <Link href="/articles" className="inline-block px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 transition-all duration-300">Voir les articles</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">Mon panier</span>
        <h1 className="text-4xl font-bold tracking-tight text-white mt-2 mb-8">Récapitulatif</h1>

        {erreur && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">{erreur}</div>
        )}

        <div className="space-y-3 mb-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-5 flex justify-between items-center hover:border-orange-500/30 transition-all duration-300">
              <div>
                <h3 className="font-medium text-white">{article.nom}</h3>
                <p className="text-sm text-stone-400 mt-1">{article.quantite} × {article.prix.toLocaleString('fr-FR')} FCFA</p>
              </div>
              <button onClick={() => retirerArticle(article.id)} className="text-sm text-stone-400 hover:text-red-400 font-medium transition-colors">Retirer</button>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-stone-300 mb-2">Adresse de livraison</label>
          <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Ex: Cocody Angré, 7ème tranche, près de la pharmacie" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition" />
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent rounded-2xl border border-orange-500/20 p-6 flex justify-between items-center mb-6">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />
          <span className="relative font-medium text-stone-300 uppercase tracking-widest text-sm">Total</span>
          <span className="relative text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">{total.toLocaleString('fr-FR')} FCFA</span>
        </div>

        <button onClick={handleCommander} disabled={chargement} className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold py-4 rounded-full hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50">
          {chargement ? 'Validation en cours...' : 'Valider la commande'}
        </button>
      </div>
    </main>
  );
}