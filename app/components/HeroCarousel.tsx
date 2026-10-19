'use client';

import { useEffect, useState } from 'react';

const IMAGES = [
  '/images/hero-1.jpg',
  '/images/hero-2.jpg',
  '/images/hero-3.jpg',
  '/images/hero-4.jpg',
  '/images/hero-5.jpg',
  '/images/hero-6.jpg',
];

const DUREE = 6000; // 6 secondes pour laisser le temps de voir le zoom

export default function HeroCarousel() {
  const [imageActive, setImageActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageActive((prev) => (prev + 1) % IMAGES.length);
    }, DUREE);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* Images en fond avec transition en fondu et effet Ken Burns */}
      {IMAGES.map((img, index) => {
        const estActive = index === imageActive;
        
        return (
          <div
            key={img}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-out ${
              estActive ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
            }`}
            style={{
              backgroundImage: `url('${img}')`,
              // On ajoute une transition spécifique pour le zoom
              transitionProperty: 'opacity, transform',
              transitionDuration: estActive ? '6000ms, 6000ms' : '1500ms, 1500ms',
              // Si l'image est active, on zoome doucement
              transform: estActive ? 'scale(1.15)' : 'scale(1)',
            }}
          />
        );
      })}

      {/* Overlay sombre avec un léger dégradé radial pour concentrer la lumière au centre */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80" />

      {/* Points indicateurs en bas (améliorés) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setImageActive(index)}
            aria-label={`Image ${index + 1}`}
            className={`group relative transition-all duration-500 rounded-full overflow-hidden ${
              index === imageActive ? 'w-10 h-2' : 'w-2 h-2 hover:w-4'
            }`}
          >
            {/* Fond de base */}
            <span className={`absolute inset-0 rounded-full ${
              index === imageActive ? 'bg-orange-500' : 'bg-white/30 group-hover:bg-white/60'
            }`} />
            
            {/* Barre de progression (uniquement sur l'image active) */}
            {index === imageActive && (
              <span className="absolute inset-0 bg-white/30 rounded-full overflow-hidden">
                <span 
                  className="block h-full bg-orange-300 w-full origin-left animate-[progress_6s_linear_forwards]"
                  style={{ animation: `progress ${DUREE}ms linear forwards` }}
                />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Injection de l'animation CSS pour la barre de progression */}
      <style jsx>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}