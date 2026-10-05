'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { usePanier } from '../contexts/PanierContext';
import { API_URL } from '../lib/api';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [utilisateur, setUtilisateur] = useState<any>(null);
  const [chargement, setChargement] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { totalArticles } = usePanier();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setChargement(false);
      return;
    }
    fetch(`${API_URL}/api/utilisateurs/profil/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Non authentifie');
        return res.json();
      })
      .then((data) => setUtilisateur(data))
      .catch(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      })
      .finally(() => setChargement(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUtilisateur(null);
    setMenuOuvert(false);
    window.location.href = '/';
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const actif = pathname === href;
    return (
      <Link href={href} className={`relative font-medium transition-colors duration-300 py-1 group ${actif ? 'text-orange-400' : 'text-stone-300 hover:text-white'}`}>
        {children}
        <span className={`absolute left-0 -bottom-0.5 h-[2px] bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-300 ease-out rounded-full ${actif ? 'w-full' : 'w-0 group-hover:w-full'}`} />
      </Link>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/70 backdrop-blur-2xl border-b border-orange-500/10 shadow-[0_4px_40px_rgba(249,115,22,0.08)] py-3' : 'bg-black/40 backdrop-blur-lg border-b border-white/5 py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/50 transition-all duration-500 ease-out group-hover:rotate-12 group-hover:scale-110">
            A
            <span className="absolute inset-0 rounded-xl bg-orange-500/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">Adjame Market</span>
        </Link>

        <div className="flex gap-8 items-center text-sm">
          <NavLink href="/">Boutiques</NavLink>
          <NavLink href="/articles">Articles</NavLink>
          <Link href="/panier" className="relative font-medium transition-colors duration-300 text-stone-300 hover:text-white">
            Panier
            {totalArticles > 0 && (
              <span className="absolute -top-2.5 -right-3.5 bg-gradient-to-br from-orange-500 to-amber-600 text-white text-[10px] font-bold rounded-full min-w-[18px] min-h-[18px] flex items-center justify-center shadow-lg shadow-orange-500/70 animate-pulse">{totalArticles}</span>
            )}
          </Link>

          {chargement ? (
            <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
          ) : utilisateur ? (
            <div className="relative pl-5 border-l border-white/10">
              <button onClick={() => setMenuOuvert((v) => !v)} className="flex items-center gap-2 group">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-xs font-bold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/50 group-hover:scale-110">
                  {utilisateur.username.charAt(0).toUpperCase()}
                </span>
                <svg className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-300 ${menuOuvert ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOuvert && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOuvert(false)} />
                  <div className="absolute right-0 top-full mt-3 z-50 origin-top-right animate-menu-in">
                    <div className="w-56 bg-black/90 backdrop-blur-2xl rounded-2xl border border-orange-500/20 shadow-2xl shadow-orange-500/20 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-sm font-semibold text-white">{utilisateur.username}</p>
                        <p className="text-xs text-orange-400 capitalize">{utilisateur.role}</p>
                      </div>
                      <div className="p-1.5">
                        {utilisateur.role === 'client' && (
                          <Link href="/mes-commandes" onClick={() => setMenuOuvert(false)} className="block px-3 py-2 text-sm text-stone-300 rounded-lg hover:bg-orange-500/10 hover:text-orange-400 transition-colors duration-200">Mes commandes</Link>
                        )}
                        {utilisateur.role === 'vendeur' && (
                          <>
                            <Link href="/vendeur" onClick={() => setMenuOuvert(false)} className="block px-3 py-2 text-sm text-stone-300 rounded-lg hover:bg-orange-500/10 hover:text-orange-400 transition-colors duration-200">📊 Tableau de bord</Link>
                            <Link href="/vendeur/boutique" onClick={() => setMenuOuvert(false)} className="block px-3 py-2 text-sm text-stone-300 rounded-lg hover:bg-orange-500/10 hover:text-orange-400 transition-colors duration-200">🎨 Ma boutique</Link>
                            <Link href="/vendeur/commandes" onClick={() => setMenuOuvert(false)} className="block px-3 py-2 text-sm text-stone-300 rounded-lg hover:bg-orange-500/10 hover:text-orange-400 transition-colors duration-200">📦 Commandes reçues</Link>
                            <Link href="/vendeur/articles" onClick={() => setMenuOuvert(false)} className="block px-3 py-2 text-sm text-stone-300 rounded-lg hover:bg-orange-500/10 hover:text-orange-400 transition-colors duration-200">🏪 Mes articles</Link>
                          </>
                        )}
                        {utilisateur.role === 'livreur' && (
                          <Link href="/livreur/commandes" onClick={() => setMenuOuvert(false)} className="block px-3 py-2 text-sm text-stone-300 rounded-lg hover:bg-orange-500/10 hover:text-orange-400 transition-colors duration-200">🚚 Mes livraisons</Link>
                        )}
                        <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/10 transition-colors duration-200">Déconnexion</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/inscription" className="relative px-5 py-2.5 rounded-full font-medium text-black bg-gradient-to-r from-orange-400 to-amber-500 hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300">S'inscrire</Link>
          )}
        </div>
      </div>
    </nav>
  );
}