'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const LABELS_STATUT: Record<string, string> = {
  prete: 'Prête à livrer',
  en_livraison: 'En cours de livraison',
  livree: 'Livrée',
  terminee: 'Terminée',
};

const COULEURS_STATUT: Record<string, string> = {
  prete: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  en_livraison: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  livree: 'bg-green-500/10 text-green-400 border-green-500/20',
  terminee: 'bg-green-500/10 text-green-400 border-green-500/20',
};

export default function LivreurCommandesPage() {
  const router = useRouter();
  const [commandes, setCommandes] = useState<any[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [actionEnCours, setActionEnCours] = useState<number | null>(null);
  const [filtre, setFiltre] = useState<'disponibles' | 'en_cours'>('disponibles');

  const chargerCommandes = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/connexion');
      return;
    }

    fetch(`${API_URL}/api/commandes/sous-commandes/`, {
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

  // Filtre les commandes selon l'onglet actif
  const commandesFiltrees = commandes.filter((sc) => {
    if (filtre === 'disponibles') return sc.statut === 'prete';
    return ['en_livraison', 'livree'].includes(sc.statut);
  });

  if (chargement) {
    return (
      <main className="min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 w-64 bg-white/5 rounded animate-pulse mb-8"></div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
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
        {/* En-tête */}
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
            Espace livreur
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white mt-2 mb-2">
            Mes livraisons
          </h1>
          <p className="text-stone-400">
            Gérez vos courses et livrez les commandes du marché d'Adjamé.
          </p>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 mb-6 p-1.5 bg-white/5 rounded-full border border-white/10 w-fit">
          <button
            onClick={() => setFiltre('disponibles')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              filtre === 'disponibles'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/40'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Disponibles (
            {commandes.filter((sc) => sc.statut === 'prete').length})
          </button>
          <button
            onClick={() => setFiltre('en_cours')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              filtre === 'en_cours'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/40'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Mes courses (
            {
              commandes.filter((sc) => ['en_livraison', 'livree'].includes(sc.statut))
                .length
            }
            )
          </button>
        </div>

        {erreur && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">
            {erreur}
          </div>
        )}

        {commandesFiltrees.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10">
            <div className="text-7xl mb-4 opacity-80">🚚</div>
            <p className="text-stone-400 mb-2">
              {filtre === 'disponibles'
                ? 'Aucune commande prête à livrer pour le moment.'
                : 'Vous n\'avez pas de course en cours.'}
            </p>
            <p className="text-stone-500 text-sm">
              {filtre === 'disponibles'
                ? 'Les commandes prêtes apparaîtront ici automatiquement.'
                : 'Acceptez une course dans l\'onglet "Disponibles".'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {commandesFiltrees.map((sc) => (
              <div
                key={sc.id}
                className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-orange-500/20 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-semibold text-white text-lg">
                      Commande #{sc.commande}
                    </h2>
                    <p className="text-sm text-stone-400 mt-0.5">
                      {sc.boutique_nom || `Boutique #${sc.boutique}`}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      COULEURS_STATUT[sc.statut] || 'bg-white/5 text-stone-400 border-white/10'
                    }`}
                  >
                    {LABELS_STATUT[sc.statut] || sc.statut}
                  </span>
                </div>

                {/* Adresse de livraison */}
                {sc.adresse_livraison && (
                  <div className="flex items-start gap-2 mb-4 p-3 bg-white/[0.03] rounded-xl border border-white/5">
                    <svg className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wider">Adresse de livraison</p>
                      <p className="text-sm text-stone-200 mt-0.5">{sc.adresse_livraison}</p>
                    </div>
                  </div>
                )}

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
                          Quantité: {ligne.quantite}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-orange-400">
                        {Number(ligne.sous_total).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bouton d'action */}
                <div className="flex justify-end pt-4 border-t border-white/5">
                  {sc.statut === 'prete' && (
                    <button
                      onClick={() => transition(sc.id, 'commencer-livraison')}
                      disabled={actionEnCours === sc.id}
                      className="text-sm font-semibold px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50"
                    >
                      {actionEnCours === sc.id ? '...' : '🚚 Accepter la course'}
                    </button>
                  )}

                  {sc.statut === 'en_livraison' && (
                    <button
                      onClick={() => transition(sc.id, 'marquer-livree')}
                      disabled={actionEnCours === sc.id}
                      className="text-sm font-semibold px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50"
                    >
                      {actionEnCours === sc.id ? '...' : '✓ Marquer comme livrée'}
                    </button>
                  )}

                  {sc.statut === 'livree' && (
                    <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                      ✓ Livrée avec succès
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}