'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { usePanier } from '../contexts/PanierContext';
import Logo from './Logo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [utilisateur, setUtilisateur] = useState<any>(null);
  const [chargement, setChargement] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [menuMobileOuvert, setMenuMobileOuvert] = useState(false);
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

  useEffect(() => {
    setMenuMobileOuvert(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUtilisateur(null);
    setMenuOuvert(false);
    setMenuMobileOuvert(false);
    window.location.href = '/';
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const actif = pathname === href;
    return (
      <Link
        href={href}
        className={`relative font-medium transition-colors duration-300 py-1 group ${
          actif ? 'text-orange-400' : 'text-stone-300 hover:text-white'
        }`}
      >
        {children}
        <span
          className={`absolute left-0 -bottom-0.5 h-[2px] bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-300 ease-out rounded-full ${
            actif ? 'w-full' : 'w-0 group-hover:w-full'
          }`}
        />
      </Link>
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/70 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(249,115,22,0.15)] py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* ✅ Logo desktop agrandi (w-14 h-14) */}
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="w-14 h-14" />
            <span className="text-2xl font-bold tracking-tight text-white">
              Adjame Market
            </span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex gap-6 lg:gap-8 items-center text-sm">
            <NavLink href="/">Boutiques</NavLink>
            <NavLink href="/articles">Articles</NavLink>

            <Link
              href="/panier"
              className="relative font-medium transition-colors duration-300 text-stone-300 hover:text-white"
            >
              Panier
              {totalArticles > 0 && (
                <span className="absolute -top-2.5 -right-3.5 bg-gradient-to-br from-orange-500 to-amber-600 text-white text-[10px] font-bold rounded-full min-w-[18px] min-h-[18px] flex items-center justify-center shadow-lg shadow-orange-500/70 animate-pulse">
                  {totalArticles}
                </span>
              )}
            </Link>

            {chargement ? (
              <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
            ) : utilisateur ? (
              <div className="relative pl-5 border-l border-white/10">
                <button
                  onClick={() => setMenuOuvert((v) => !v)}
                  className="flex items-center gap-2 group"
                >
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-xs font-bold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/50 group-hover:scale-110">
                    {utilisateur.username.charAt(0).toUpperCase()}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-300 ${
                      menuOuvert ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
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
              <Link
                href="/inscription"
                className="relative px-5 py-2.5 rounded-full font-medium text-black bg-gradient-to-r from-orange-400 to-amber-500 hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
              >
                S'inscrire
              </Link>
            )}
          </div>

          {/* Navigation mobile - Bouton burger */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href="/panier"
              className="relative p-2 text-stone-300 hover:text-white transition-colors"
              aria-label="Panier"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalArticles > 0 && (
                <span className="absolute top-0 right-0 bg-gradient-to-br from-orange-500 to-amber-600 text-white text-[10px] font-bold rounded-full min-w-[18px] min-h-[18px] flex items-center justify-center shadow-lg shadow-orange-500/70">
                  {totalArticles}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuMobileOuvert(true)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile plein écran */}
      {menuMobileOuvert && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            onClick={() => setMenuMobileOuvert(false)}
          />

          <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#0a0a0a] border-l border-white/10 z-[70] md:hidden overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              {/* ✅ Logo mobile agrandi (w-12 h-12) */}
              <Link href="/" className="flex items-center gap-3" onClick={() => setMenuMobileOuvert(false)}>
                <Logo className="w-12 h-12" />
                <span className="text-xl font-bold text-white">Adjame Market</span>
              </Link>
              <button
                onClick={() => setMenuMobileOuvert(false)}
                className="p-2 text-stone-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!chargement && utilisateur && (
              <div className="px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-base font-bold shadow-lg shadow-orange-500/30">
                    {utilisateur.username.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{utilisateur.username}</p>
                    <p className="text-xs text-orange-400 capitalize">{utilisateur.role}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-5 space-y-1">
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">Navigation</p>
              <Link
                href="/"
                onClick={() => setMenuMobileOuvert(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  pathname === '/' ? 'bg-orange-500/10 text-orange-400' : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Boutiques
              </Link>
              <Link
                href="/articles"
                onClick={() => setMenuMobileOuvert(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  pathname === '/articles' ? 'bg-orange-500/10 text-orange-400' : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Articles
              </Link>
              <Link
                href="/panier"
                onClick={() => setMenuMobileOuvert(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                  pathname === '/panier' ? 'bg-orange-500/10 text-orange-400' : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Panier
                </span>
                {totalArticles > 0 && (
                  <span className="bg-gradient-to-br from-orange-500 to-amber-600 text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-2">
                    {totalArticles}
                  </span>
                )}
              </Link>
            </div>

            {!chargement && utilisateur && (
              <div className="p-5 border-t border-white/5 space-y-1">
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">Mon espace</p>

                {utilisateur.role === 'client' && (
                  <Link
                    href="/mes-commandes"
                    onClick={() => setMenuMobileOuvert(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-300 hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Mes commandes
                  </Link>
                )}

                {utilisateur.role === 'vendeur' && (
                  <>
                    <Link href="/vendeur" onClick={() => setMenuMobileOuvert(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-300 hover:bg-white/5 transition-colors">
                      <span className="text-lg">📊</span> Tableau de bord
                    </Link>
                    <Link href="/vendeur/boutique" onClick={() => setMenuMobileOuvert(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-300 hover:bg-white/5 transition-colors">
                      <span className="text-lg">🎨</span> Ma boutique
                    </Link>
                    <Link href="/vendeur/commandes" onClick={() => setMenuMobileOuvert(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-300 hover:bg-white/5 transition-colors">
                      <span className="text-lg">📦</span> Commandes reçues
                    </Link>
                    <Link href="/vendeur/articles" onClick={() => setMenuMobileOuvert(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-300 hover:bg-white/5 transition-colors">
                      <span className="text-lg">🏪</span> Mes articles
                    </Link>
                  </>
                )}

                {utilisateur.role === 'livreur' && (
                  <Link href="/livreur/commandes" onClick={() => setMenuMobileOuvert(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-300 hover:bg-white/5 transition-colors">
                    <span className="text-lg">🚚</span> Mes livraisons
                  </Link>
                )}
              </div>
            )}

            <div className="p-5 border-t border-white/5">
              {!chargement && utilisateur ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Déconnexion
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/inscription"
                    onClick={() => setMenuMobileOuvert(false)}
                    className="block w-full text-center px-4 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-orange-400 to-amber-500 hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                  >
                    S'inscrire
                  </Link>
                  <Link
                    href="/connexion"
                    onClick={() => setMenuMobileOuvert(false)}
                    className="block w-full text-center px-4 py-3 rounded-xl font-medium text-stone-300 border border-white/10 hover:bg-white/5 transition-colors"
                  >
                    Se connecter
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}