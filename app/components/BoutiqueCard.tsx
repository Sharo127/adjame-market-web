'use client';

import Link from 'next/link';
import { useRef } from 'react';

interface Boutique {
  id: number;
  nom: string;
  description: string;
  articles?: any[];
}

// Base de données d'images par mots-clés (recherche dans le nom + description)
const IMAGES_PAR_MOT_CLE: Record<string, string[]> = {
  wax: [
    'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=1200',
    'https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1200',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200',
  ],
  tissu: [
    'https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1200',
    'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=1200',
  ],
  pagne: [
    'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=1200',
    'https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1200',
  ],
  mode: [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200',
  ],
  vetement: [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200',
  ],
  beaute: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200',
  ],
  cosmetique: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200',
  ],
  seduction: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200',
  ],
  bijou: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200',
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1200',
  ],
  chaussure: [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200',
  ],
  electronique: [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200',
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=1200',
  ],
  alimentation: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200',
    'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1200',
  ],
  nourriture: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200',
    'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1200',
  ],
  art: [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200',
    'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?q=80&w=1200',
  ],
  deco: [
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=1200',
  ],
};

// Images par défaut (si aucun mot-clé n'est trouvé)
const IMAGES_DEFAUT = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200',
];

// Fonction pour trouver la bonne image selon le nom/description
function trouverImage(boutique: Boutique): string {
  const texte = `${boutique.nom} ${boutique.description}`.toLowerCase();

  // Chercher un mot-clé correspondant
  for (const [motCle, images] of Object.entries(IMAGES_PAR_MOT_CLE)) {
    if (texte.includes(motCle)) {
      // Utiliser l'index de la boutique pour varier l'image
      return images[boutique.id % images.length];
    }
  }

  // Sinon, image par défaut
  return IMAGES_DEFAUT[boutique.id % IMAGES_DEFAUT.length];
}

export default function BoutiqueCard({ boutique }: { boutique: Boutique }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const imageUrl = trouverImage(boutique);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  };

  return (
    <Link
      ref={ref}
      href={`/boutiques/${boutique.id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative block rounded-3xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Image de fond principale */}
      <div className="relative h-72 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-110 transition-transform duration-1000"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />

        {/* Overlay dégradé sombre en bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Overlay léger sur toute l'image pour lisibilité */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />

        {/* Badge "Nouveau" ou "Vedette" en haut à droite */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-orange-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-orange-500/50">
          Vedette
        </div>

        {/* Contenu en bas de l'image */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Avatar du vendeur */}
          <div className="flex items-end gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-2xl shadow-orange-500/50 border-2 border-white/20 shrink-0">
              {boutique.nom.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Nom de la boutique */}
          <h3 className="text-2xl font-bold text-white tracking-tight mb-1 drop-shadow-lg">
            {boutique.nom}
          </h3>

          {/* Description */}
          <p className="text-white/70 text-sm line-clamp-2 mb-3 drop-shadow">
            {boutique.description || 'Découvrez cette boutique du marché d\'Adjamé.'}
          </p>

          {/* Footer de la carte */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
              <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>{boutique.articles?.length || 0} article(s)</span>
            </div>

            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
              Visiter
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}