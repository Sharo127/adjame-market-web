'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LABELS_STATUT: Record<string, string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  en_preparation: 'En préparation',
  prete: 'Prête',
  en_livraison: 'En livraison',
  livree: 'Livrée',
  terminee: 'Terminée',
  annulee: 'Annulée',
  retournee: 'Retournée',
};

const COULEURS_STATUT: Record<string, string> = {
  en_attente: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmee: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  en_preparation: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  prete: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  en_livraison: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  livree: 'bg-green-500/10 text-green-400 border-green-500/20',
  terminee: 'bg-green-500/10 text-green-400 border-green-500/20',
  annulee: 'bg-red-500/10 text-red-400 border-red-500/20',
  retournee: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function VendeurCommandesPage() {
  const router = useRouter();
  const [commandes, setCommandes] = useState<any[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [actionEnCours, setActionEnCours] = useState<number | null>(null);

  const chargerCommandes = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/connexion');
      return;
    }

    fetch('http://127.0.0.1:8000/api/commandes/sous-commandes/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur de chargement');
        return res.json();
      })
      .then((data) => {
        setCommandes(data);
        setErreur('');
      })
      .catch(() => setErreur('Impossible de charger les commandes.'))
      .finally(() => setChargement(false));
  };

  useEffect(() => {
    chargerCommandes();
  }, []);

  const transition = async (id: number, action: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    setActionEnCours(id);
    setErreur('');

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/commandes/sous-commandes/${id}/${action}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.erreur || 'Action impossible');
      }

      chargerCommandes();
    } catch (err: any) {
      setErreur(err.message || 'Une erreur est survenue.');
    } finally {
      setActionEnCours(null);
    }
  };

  // Boutons à afficher selon le statut
  const renderActions = (sc: any) => {
    const boutons = [];

    if (sc.statut === 'en_attente') {
      boutons.push(
        <button
          key="confirmer"
          onClick={() => transition(sc.id, 'confirmer')}
          disabled={actionEnCours === sc.id}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:shadow-lg hover:shadow-orange-500/50 transition disabled:opacity-50"
        >
          {actionEnCours === sc.id ? '...' : '✓ Confirmer'}
        </button>
      );
    }

    if (sc.statut === 'confirmee') {
      boutons.push(
        <button
          key="preparer"
          onClick={() => transition(sc.id, 'preparer')}
          disabled={actionEnCours === sc.id}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50"
        >
          {actionEnCours === sc.id ? '...' : '📦 Préparer'}
        </button>
      );
    }

    if (sc.statut === 'en_preparation') {
      boutons.push(
        <button
          key="prete"
          onClick={() => transition(sc.id, 'marquer-prete')}
          disabled={actionEnCours === sc.id}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50"
        >
          {actionEnCours === sc.id ? '...' : '🎁 Prête'}
        </button>
      );
    }

    return boutons;
  };

  if (chargement) {
    return (
      <main className="min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 w-64 bg-white/5 rounded animate-pulse mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 h-32 animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
            Espace vendeur
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white mt-2 mb-2">
            Commandes entrantes
          </h1>
          <p className="text-stone-400">
            {commandes.length} commande(s) à traiter
          </p>
        </div>

        {erreur && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">
            {erreur}
          </div>
        )}

        {commandes.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10">
            <div className="text-7xl mb-4 opacity-80">📭</div>
            <p className="text-stone-400 mb-2">
              Aucune commande pour le moment.
            </p>
            <p className="text-stone-500 text-sm">
              Les nouvelles commandes apparaîtront ici automatiquement.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {commandes.map((sc) => (
              <div
                key={sc.id}
                className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-orange-500/20 transition-all duration-300"
              >
                {/* En-tête */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-semibold text-white text-lg">
                      Commande #{sc.commande}
                    </h2>
                    <p className="text-sm text-stone-400 mt-0.5">
                      {sc.boutique_nom || `Boutique #${sc.boutique}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent block">
                      {Number(sc.montant_total).toLocaleString('fr-FR')} FCFA
                    </span>
                    <span
                      className={`inline-block mt-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        COULEURS_STATUT[sc.statut] || 'bg-white/5 text-stone-400 border-white/10'
                      }`}
                    >
                      {LABELS_STATUT[sc.statut] || sc.statut}
                    </span>
                  </div>
                </div>

                {/* Lignes d'articles */}
                <div className="space-y-2 mb-4">
                  {sc.lignes?.map((ligne: any) => (
                    <div
                      key={ligne.id}
                      className="flex justify-between items-center bg-white/[0.03] rounded-lg px-3 py-2 border border-white/5"
                    >
                      <div>
                        <p className="text-sm text-stone-200">
                          {ligne.article_nom || `Article #${ligne.article}`}
                        </p>
                        <p className="text-xs text-stone-500">
                          {ligne.quantite} × {Number(ligne.prix_unitaire).toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-orange-400">
                        {Number(ligne.sous_total).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  ))}
                </div>

                {/* Boutons d'action */}
                {renderActions(sc).length > 0 && (
                  <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
                    {renderActions(sc)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}