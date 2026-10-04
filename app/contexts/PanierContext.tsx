'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// CORRIGÉ : ajout du mot-clé "export" pour que les autres fichiers puissent l'importer
export type ArticlePanier = {
  id: number;
  nom: string;
  prix: number;
  boutique: number;
  boutiqueNom: string;
  quantite: number;
};

type PanierContextType = {
  articles: ArticlePanier[];
  ajouterArticle: (article: Omit<ArticlePanier, 'quantite'>) => void;
  retirerArticle: (id: number) => void;
  viderPanier: () => void;
  totalArticles: number;
};

const PanierContext = createContext<PanierContextType | undefined>(undefined);

export function PanierProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<ArticlePanier[]>([]);

  useEffect(() => {
    const stocke = localStorage.getItem('panier');
    if (stocke) {
      try {
        setArticles(JSON.parse(stocke));
      } catch (e) {
        console.error('Erreur de parsing du panier:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('panier', JSON.stringify(articles));
  }, [articles]);

  const ajouterArticle = (article: Omit<ArticlePanier, 'quantite'>) => {
    setArticles((prev) => {
      const existant = prev.find((a) => a.id === article.id);
      if (existant) {
        return prev.map((a) =>
          a.id === article.id ? { ...a, quantite: a.quantite + 1 } : a
        );
      }
      return [...prev, { ...article, quantite: 1 }];
    });
  };

  const retirerArticle = (id: number) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const viderPanier = () => setArticles([]);

  const totalArticles = articles.reduce((sum, a) => sum + a.quantite, 0);

  return (
    <PanierContext.Provider
      value={{ articles, ajouterArticle, retirerArticle, viderPanier, totalArticles }}
    >
      {children}
    </PanierContext.Provider>
  );
}

export function usePanier() {
  const context = useContext(PanierContext);
  if (!context) throw new Error('usePanier doit être utilisé dans PanierProvider');
  return context;
}