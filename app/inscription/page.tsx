'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function InscriptionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client',
    telephone: '',
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      const res = await fetch(
        `${API_URL}/api/utilisateurs/inscription/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error('Erreur inscription');

      router.push('/connexion');
    } catch {
      setErreur("Erreur lors de l'inscription. Vérifiez vos informations.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-28 pb-16">
      <div className="w-full max-w-md">
        {/* En-tête */}
        <div className="text-center mb-8">
          <span className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white items-center justify-center font-bold text-xl shadow-2xl shadow-orange-500/40 mb-5">
            A
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Créer un compte
          </h1>
          <p className="text-stone-400 text-sm mt-2">
            Rejoignez le marché d'Adjamé en quelques secondes.
          </p>
        </div>

        {/* Carte du formulaire - effet verre dépoli */}
        <div className="relative bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl shadow-black/50 overflow-hidden">
          {/* Halo décoratif */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            {erreur && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">
                {erreur}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="ex: sharo"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">
                  Email <span className="text-stone-500">(optionnel)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="vous@exemple.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="8 caractères minimum"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">
                  Je suis un(e)
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition"
                >
                  <option value="client" className="bg-[#0a0a0a]">
                    Client — je veux acheter
                  </option>
                  <option value="vendeur" className="bg-[#0a0a0a]">
                    Vendeur — je veux vendre
                  </option>
                  <option value="livreur" className="bg-[#0a0a0a]">
                    Livreur — je veux livrer
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1.5">
                  Téléphone <span className="text-stone-500">(optionnel)</span>
                </label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+225 07 00 00 00 00"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition"
                />
              </div>

              <button
                type="submit"
                disabled={chargement}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold py-3.5 rounded-full hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 mt-2"
              >
                {chargement ? 'Création...' : 'Créer mon compte'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-sm text-stone-400 mt-6 text-center">
          Déjà un compte ?{' '}
          <Link
            href="/connexion"
            className="text-orange-400 font-medium hover:text-orange-300 transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}