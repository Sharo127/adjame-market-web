'use client';

import { useState } from 'react';
import Link from 'next/link';

const FAQS = [
  {
    categorie: 'Général',
    questions: [
      {
        q: "Qu'est-ce qu'Adjamé Market ?",
        r: "Adjamé Market est une marketplace en ligne qui connecte les commerçants du marché d'Adjamé aux clients de toute la Côte d'Ivoire. Vous pouvez y découvrir des boutiques, comparer les prix et commander en toute simplicité.",
      },
      {
        q: 'Adjamé Market est-il gratuit ?',
        r: "L'inscription et la navigation sur le site sont totalement gratuites pour les clients. Pour les vendeurs, l'inscription est gratuite et une commission sera prélevée uniquement sur les ventes réalisées.",
      },
      {
        q: 'Dans quelles villes livrez-vous ?',
        r: "Pour le moment, nous livrons dans tout Abidjan. Nous prévoyons d'étendre nos livraisons à d'autres villes de Côte d'Ivoire très prochainement.",
      },
    ],
  },
  {
    categorie: 'Commande & Livraison',
    questions: [
      {
        q: 'Comment passer une commande ?',
        r: "Créez un compte client, parcourez les articles, ajoutez-les à votre panier, puis validez votre commande depuis la page Panier. Vous recevrez un email de confirmation et pourrez suivre l'avancement dans Mes commandes.",
      },
      {
        q: 'Quels sont les délais de livraison ?',
        r: "Le délai dépend du vendeur et de votre localisation. En moyenne, comptez 24 à 48h pour une livraison dans Abidjan. Le vendeur peut aussi proposer le retrait sur place au marché.",
      },
      {
        q: 'Puis-je annuler ma commande ?',
        r: "Oui, tant que la commande n'est pas encore expédiée (statuts : en attente, confirmée ou en préparation). Rendez-vous sur Mes commandes et cliquez sur Annuler.",
      },
      {
        q: 'Que faire si je ne reçois pas ma commande ?',
        r: "Contactez-nous via la page Contact ou directement le vendeur. Nous ferons le nécessaire pour résoudre le problème dans les plus brefs délais.",
      },
    ],
  },
  {
    categorie: 'Vendeurs',
    questions: [
      {
        q: 'Comment devenir vendeur ?',
        r: "Inscrivez-vous en choisissant le rôle Vendeur, puis créez votre boutique et ajoutez vos articles depuis votre espace vendeur. Un administrateur validera votre boutique avant sa mise en ligne.",
      },
      {
        q: 'Combien coûte la commission ?',
        r: "La commission est de 5% sur chaque vente réalisée. Elle est automatiquement déduite et vous recevez le reste sur votre compte Mobile Money.",
      },
      {
        q: 'Comment gérer mes articles ?',
        r: "Dans votre espace vendeur, cliquez sur Mes articles pour ajouter, modifier ou supprimer un article. Vous pouvez aussi consulter les commandes reçues et les traiter depuis Commandes reçues.",
      },
    ],
  },
  {
    categorie: 'Paiement & Sécurité',
    questions: [
      {
        q: 'Quels moyens de paiement acceptez-vous ?',
        r: "Nous acceptons pour l'instant : Orange Money, MTN Money, Moov Money et Wave. Le paiement par carte bancaire arrivera très prochainement.",
      },
      {
        q: 'Mes paiements sont-ils sécurisés ?',
        r: "Oui. Toutes les transactions passent par des agrégateurs de paiement Mobile Money agréés. Vos données bancaires ne sont jamais stockées sur nos serveurs.",
      },
      {
        q: 'Que se passe-t-il si je ne reçois pas ma commande après paiement ?',
        r: "Le paiement est conservé en séquestre jusqu'à ce que vous confirmiez la réception de votre commande. En cas de litige, nous remboursons intégralement.",
      },
    ],
  },
];

export default function FAQPage() {
  const [ouverte, setOuverte] = useState<string | null>(null);

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
            Aide
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-3 mb-4">
            Questions fréquentes
          </h1>
          <p className="text-stone-400 text-lg">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        {/* Sections FAQ */}
        <div className="space-y-10">
          {FAQS.map((section) => (
            <div key={section.categorie}>
              <h2 className="text-sm font-bold tracking-widest text-orange-400 uppercase mb-4">
                {section.categorie}
              </h2>
              <div className="space-y-3">
                {section.questions.map((faq, i) => {
                  const id = `${section.categorie}-${i}`;
                  const estOuverte = ouverte === id;
                  return (
                    <div
                      key={id}
                      className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-orange-500/20 transition-all duration-300"
                    >
                      <button
                        onClick={() => setOuverte(estOuverte ? null : id)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="font-medium text-white pr-4">{faq.q}</span>
                        <svg
                          className={`w-5 h-5 text-orange-400 shrink-0 transition-transform duration-300 ${
                            estOuverte ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {estOuverte && (
                        <div className="px-5 pb-5 pt-0">
                          <p className="text-stone-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                            {faq.r}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Contact */}
        <div className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20">
          <p className="text-white font-semibold mb-2">
            Vous n'avez pas trouvé votre réponse ?
          </p>
          <p className="text-stone-400 text-sm mb-6">
            Notre équipe est là pour vous aider.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 transition-all duration-300"
          >
            Nous contacter
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}