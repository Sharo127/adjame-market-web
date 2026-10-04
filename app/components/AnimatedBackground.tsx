'use client';

import { useEffect, useState } from 'react';

export default function AnimatedBackground() {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Barre de progression du scroll
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Curseur personnalisé
  useEffect(() => {
    // Ne pas activer sur mobile/tablette
    if (window.matchMedia('(hover: none)').matches) return;

    const cursor = document.getElementById('custom-cursor');
    const halo = document.getElementById('custom-cursor-halo');
    if (!cursor || !halo) return;

    let mouseX = 0;
    let mouseY = 0;
    let haloX = 0;
    let haloY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        halo.classList.add('hover');
      }
    };

    const onMouseOut = () => {
      halo.classList.remove('hover');
    };

    // Animation fluide du halo (effet retard)
    const animateHalo = () => {
      haloX += (mouseX - haloX) * 0.15;
      haloY += (mouseY - haloY) * 0.15;
      halo.style.left = haloX + 'px';
      halo.style.top = haloY + 'px';
      requestAnimationFrame(animateHalo);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    animateHalo();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  // Animation des sections au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-up');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Barre de progression en haut */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Curseur personnalisé (uniquement sur desktop) */}
      <div id="custom-cursor" className="custom-cursor hidden md:block" />
      <div id="custom-cursor-halo" className="custom-cursor-halo hidden md:block" />
    </>
  );
}