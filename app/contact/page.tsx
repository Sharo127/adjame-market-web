'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: '',
  });
  const [envoye, setEnvoye] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, on simule l'envoi. Plus tard, on branchera un vrai backend.
    console.log('Message envoyé:', formData);
    setEnvoye(true);
    setFormData({ nom: '', email: '', sujet: '', message: '' });
    setTimeout(() => setEnvoye(false), 5000);
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
            Contact
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-3 mb-4">
            Parlons-nous
          </h1>
          <p className="text-stone-400 text-lg max-w-xl mx-auto">
            Une question, une suggestion, un partenariat ? Notre équipe vous répond
            sous 24h.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Informations de contact */}
          <div className="md:col-span-2 space-y-4">
            {[
              {
                emoji: '📍',
                title: 'Adresse',
                value: "Marché d'Adjamé, Abidjan, Côte d'Ivoire",
              },
              {
                emoji: '📞',
                title: 'Téléphone',
                value: '+225 07 00 00 00 00',
              },
              {
                emoji: '✉️',
                title: 'Email',
                value: 'contact@adjamemarket.ci',
              },
              {
                emoji: '🕐',
                title: 'Horaires',
                value: 'Lun - Sam : 8h - 18h',
              },
            ].map((info, i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:border-orange-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{info.emoji}</span>
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                      {info.title}
                    </p>
                    <p className="text-sm text-stone-200 mt-1">{info.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Formulaire */}
          <div className="md:col-span-3">
            <div className="relative bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl shadow-black/50 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                {envoye && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-xl mb-4">
                    ✓ Message envoyé ! Nous vous répondrons dans les plus brefs délais.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-300 mb-1.5">
                      Votre nom
                    </label>
                    <input
                      type="text"
                      name="nom"
                      required
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Fatou Diallo"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-300 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="vous@exemple.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-300 mb-1.5">
                      Sujet
                    </label>
                    <select
                      name="sujet"
                      required
                      value={formData.sujet}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition"
                    >
                      <option value="" className="bg-[#0a0a0a]">Choisir un sujet...</option>
                      <option value="question" className="bg-[#0a0a0a]">Question générale</option>
                      <option value="vendeur" className="bg-[#0a0a0a]">Devenir vendeur</option>
                      <option value="probleme" className="bg-[#0a0a0a]">Signaler un problème</option>
                      <option value="partenariat" className="bg-[#0a0a0a]">Partenariat</option>
                      <option value="autre" className="bg-[#0a0a0a]">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-300 mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre demande..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold py-3.5 rounded-full hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-[1.02] transition-all duration-300"
                  >
                    Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}