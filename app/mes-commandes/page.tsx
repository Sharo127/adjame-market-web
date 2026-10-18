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

  const transitionStatut = async (sousCommandeId: number, action: 'annuler' | 'terminer') => {
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
          <div className="h-10 w-64 bg-white/5 rounded-2xl animate-pulse mb-10" />
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white/5 rounded-3xl border border-white/10 p-8 h-48 animate-pulse" />
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
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-2 mb-10">Mes commandes</h1>

        {erreur && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl mb-6">{erreur}</div>
        )}

        {commandesAffichees.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
            <div className="text-7xl mb-6 opacity-80">📦</div>
            <p className="text-stone-400 mb-8">Vous n'avez pas encore de commande active.</p>
            <Link href="/articles" className="inline-block bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold px-8 py-4 rounded-2xl hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300">
              Découvrir les articles
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {commandesAffichees.map((commande) => (
              <div key={commande.id} className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 hover:border-orange-500/30 transition-all duration-500">
                {/* En-tête de la commande */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="font-bold text-white text-2xl">Commande #{commande.id}</h2>
                    <p className="text-sm text-stone-500 mt-1">
                      {new Date(commande.date_creation).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                    {Number(commande.montant_total).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <p className="text-sm text-stone-400 mb-6 bg-white/[0.02] px-4 py-2 rounded-xl border border-white/5 inline-block">
                  📍 {commande.adresse_livraison}
                </p>

                {/* Sous-commandes */}
                <div className="space-y-4">
                  {commande.sous_commandes.map((sc: any) => (
                    <div key={sc.id} className="bg-white/[0.02] rounded-2xl p-5 border border-white/5">
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                          <p className="text-base font-semibold text-white">
                            {sc.boutique_nom || `Boutique #${sc.boutique}`}
                          </p>
                          <p className="text-xs text-stone-500 mt-1">
                            {sc.lignes.length} article(s)
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${COULEURS_STATUT[sc.statut] || 'bg-white/5 text-stone-400 border-white/10'}`}>
                            {LABELS_STATUT[sc.statut] || sc.statut}
                          </span>

                          {['en_attente', 'confirmee'].includes(sc.statut) && (
                            <button
                              onClick={() => transitionStatut(sc.id, 'annuler')}
                              disabled={actionEnCours === sc.id}
                              className="text-xs font-semibold px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                            >
                              {actionEnCours === sc.id ? '...' : 'Annuler'}
                            </button>
                          )}

                          {sc.statut === 'livree' && (
                            <button
                              onClick={() => transitionStatut(sc.id, 'terminer')}
                              disabled={actionEnCours === sc.id}
                              className="text-xs font-semibold px-4 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/40 transition disabled:opacity-50"
                            >
                              {actionEnCours === sc.id ? '...' : 'Confirmer la réception'}
                            </button>
                          )}
                        </div>
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