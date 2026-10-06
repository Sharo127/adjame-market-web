'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

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

export default function MesCommandesPage() {
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

    fetch(`${API_URL}/api/commandes/commandes/`, {
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
      .catch(() => setErreur('Impossible de charger vos commandes.'))
      .finally(() => setChargement(false));
  };

  useEffect(() => {
    chargerCommandes();
  }, []);

  const transitionStatut = async (
    sousCommandeId: number,
    action: 'annuler' | 'terminer'
  ) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    setActionEnCours(sousCommandeId);
    setErreur('');

    try {
      const res = await fetch(
        `${API_URL}/api/commandes/sous-commandes/${sousCommandeId}/${action}/`,
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

  const commandesAffichees = commandes
    .map((commande) => ({
      ...commande,
      sous_commandes: commande.sous_commandes.filter((sc: any) => sc.statut !== 'annulee'),
    }))
    .filter((commande) => commande.sous_commandes.length > 0);

  if (chargement) {
    return (
      <main className="min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-8"></div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 h-40 animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">Historique</span>
        <h1 className="text-4xl font-bold tracking-tight text-white mt-2 mb-8">Mes commandes</h1>

        {erreur && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">{erreur}</div>
        )}

        {commandesAffichees.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10">
            <div className="text-7xl mb-4 opacity-80">📦</div>
            <p className="text-stone-400 mb-6">Vous n'avez pas encore de commande active.</p>
            <Link href="/articles" className="inline-block bg-gradient-to-r from-orange-500 to-amber-600 text-white font-medium px-6 py-3 rounded-full hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300">Découvrir les articles</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {commandesAffichees.map((commande) => (
              <div key={commande.id} className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-orange-500/20 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-semibold text-white text-lg">Commande #{commande.id}</h2>
                    <p className="text-sm text-stone-500 mt-0.5">
                      {new Date(commande.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                    {Number(commande.montant_total).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <p className="text-sm text-stone-400 mb-4">{commande.adresse_livraison}</p>
                <div className="space-y-3">
                  {commande.sous_commandes.map((sc: any) => (
                    <div key={sc.id} className="flex items-center justify-between bg-white/[0.03] rounded-xl p-3.5 border border-white/5">
                      <div>
                        <p className="text-sm font-medium text-stone-200">{sc.boutique_nom || `Boutique #${sc.boutique}`}</p>
                        <p className="text-xs text-stone-500 mt-0.5">{sc.lignes.length} article(s)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${COULEURS_STATUT[sc.statut] || 'bg-white/5 text-stone-400 border-white/10'}`}>
                          {LABELS_STATUT[sc.statut] || sc.statut}
                        </span>
                        {['en_attente', 'confirmee'].includes(sc.statut) && (
                          <button onClick={() => transitionStatut(sc.id, 'annuler')} disabled={actionEnCours === sc.id} className="text-xs font-medium px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition disabled:opacity-50">
                            {actionEnCours === sc.id ? '...' : 'Annuler'}
                          </button>
                        )}
                        {sc.statut === 'livree' && (
                          <button onClick={() => transitionStatut(sc.id, 'terminer')} disabled={actionEnCours === sc.id} className="text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/40 transition disabled:opacity-50">
                            {actionEnCours === sc.id ? '...' : 'Confirmer la réception'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}