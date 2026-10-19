'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';

type LogoProps = {
  className?: string;
  variant?: 'dark' | 'light';
  title?: string;
  animated?: boolean;
};

export default function Logo({
  className = 'w-12 h-12', // Plus grand par défaut
  variant = 'dark',
  title = 'Adjame Market',
  animated = true,
}: LogoProps) {
  const id = useId();
  const bgFill = variant === 'dark' ? '#0A0A0A' : '#FFFFFF';
  const bgStroke = variant === 'dark' ? 'none' : '#E5E7EB';
  const textFill = variant === 'dark' ? '#FFFFFF' : '#0A0A0A';
  const iconFill = '#F97316'; // Orange vif

  const cx = 50;
  const cy = 50;
  const rx = 36; // Légèrement réduit pour que les icônes restent dans le cadre
  const ry = 16;
  const rotation = -25;
  const duration = 8; // Rotation plus rapide (8 secondes)

  const items = [0, 1, 2];

  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
      whileHover={animated ? { scale: 1.1, rotate: -3 } : {}}
      whileTap={animated ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      // Ajout d'un halo lumineux (glow) orange autour du logo
      style={{ filter: variant === 'dark' ? 'drop-shadow(0px 0px 10px rgba(249, 115, 22, 0.3))' : 'none' }}
    >
      <title>{title}</title>

      {/* 1. Fond du badge */}
      <rect
        width="100"
        height="100"
        rx="26"
        fill={bgFill}
        stroke={bgStroke}
        strokeWidth="2"
      />

      {/* 2. Le "A" au centre */}
      <text
        x="50"
        y="52"
        dominantBaseline="central"
        textAnchor="middle"
        fill={textFill}
        fontSize="56"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-3"
      >
        A
      </text>

      {/* 3. Les éléments orbitaux */}
      {items.map((index) => {
        const angle = (index / 3) * 2 * Math.PI;
        const x = cx + rx * Math.cos(angle);
        const y = cy + ry * Math.sin(angle);

        return (
          <motion.g
            key={index}
            style={{ originX: '50px', originY: '50px' }}
            animate={animated ? { rotate: [0, 360] } : {}}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: 'linear',
              delay: -(index / 3) * duration,
            }}
          >
            {/* On applique un facteur d'échelle (scale) de 1.4 pour agrandir les icônes */}
            <g transform={`translate(${x - 50}, ${y - 50}) rotate(${-rotation})`}>
              
              {/* Icône 1 : Panier / Chariot (Agrandie + Trait plus épais) */}
              {index === 0 && (
                <g transform="translate(50, 50) scale(1.3)">
                  <path
                    d="M-6,-4 L-4,-4 L-2,4 L6,4 L8,-2 L-5,-2 M-2,4 A1.5,1.5 0 1,0 -2,7 A1.5,1.5 0 1,0 -2,4 M6,4 A1.5,1.5 0 1,0 6,7 A1.5,1.5 0 1,0 6,4"
                    stroke={iconFill}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>
              )}

              {/* Icône 2 : T-shirt (Agrandie + Trait plus épais) */}
              {index === 1 && (
                <g transform="translate(50, 50) scale(1.3)">
                  <path
                    d="M-5,-4 L-7,-2 L-4,1 L-3,-1 L-3,4 L3,4 L3,-1 L4,1 L7,-2 L5,-4 L2,-4 C1,-2 -1,-2 -2,-4 Z"
                    stroke={iconFill}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>
              )}

              {/* Icône 3 : Colis (Agrandie + Trait plus épais) */}
              {index === 2 && (
                <g transform="translate(50, 50) scale(1.3)">
                  <path
                    d="M-6,-3 L0,-6 L6,-3 L6,4 L0,7 L-6,4 Z M-6,-3 L0,0 L6,-3 M0,0 L0,7"
                    stroke={iconFill}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>
              )}
            </g>
          </motion.g>
        );
      })}
    </motion.svg>
  );
}