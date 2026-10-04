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

const DUREE = 5000; // 5 secondes par image

export default function HeroCarousel() {
  const [imageActive, setImageActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageActive((prev) => (prev + 1) % IMAGES.length);
    }, DUREE);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Images en fond avec transition en fondu */}
      {IMAGES.map((img, index) => (
        <div
          key={img}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('${img}')`,
            opacity: index === imageActive ? 1 : 0,
            transform: 'scale(1.05)',
          }}
        />
      ))}

      {/* Overlay sombre pour la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#0a0a0a]" />

      {/* Points indicateurs en bas */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setImageActive(index)}
            aria-label={`Image ${index + 1}`}
            className={`transition-all duration-500 rounded-full ${
              index === imageActive
                ? 'w-8 h-2 bg-orange-500 shadow-lg shadow-orange-500/50'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}