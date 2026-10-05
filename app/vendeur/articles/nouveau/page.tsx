'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '../../../lib/api';

interface Boutique {
  id: number;
  nom: string;
}

export default function NouvelArticlePage() {
  const router = useRouter();
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    stock: '',
    boutique: '',
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/connexion');
      return;
    }

    fetch(`${API_URL}/api/catalogue/boutiques/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const boutiquesArray = Array.isArray(data) ? data : data.results || [];
        setBoutiques(boutiquesArray);
        if (boutiquesArray.length > 0) {
          setFormData((prev) => ({ ...prev, boutique: String(boutiquesArray[0].id) }));
        }
      })
      .catch((err) => {
        console.error(err);
        setErreur('Impossible de charger vos boutiques.');
      })
      .finally(() => setChargement(false));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);

    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const data = new FormData();
      data.append('nom', formData.nom);
      data.append('description', formData.description);
      data.append('prix', formData.prix);
      data.append('stock', formData.stock);
      data.append('boutique', formData.boutique);
      if (image) data.append('image', image);

      const res = await fetch(`${API_URL}/api/catalogue/articles/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Erreur lors de la création");
      }

      router.push('/vendeur/articles');
    } catch (err: any) {
      setErreur(err.message || 'Une erreur est survenue.');
    } finally {
      setEnvoi(false);
    }
  };

  if (chargement) {
    return (
      <main className="min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="h-10 w-64 bg-white/5 rounded animate-pulse mb-8" />
          <div className="bg-white/5 rounded-3xl border border-white/10 p-8 h-96 animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/vendeur/articles" className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-orange-400 transition-colors duration-300 mb-6">
          <span>←</span><span>Retour à mes articles</span>
        </Link>

        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">Espace vendeur</span>
          <h1 className="text-4xl font-bold tracking-tight text-white mt-2 mb-2">Nouvel article</h1>
          <p className="text-stone-400">Ajoutez un article à votre boutique avec une photo.</p>
        </div>

        <div className="relative bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl shadow-black/50 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            {erreur && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">{erreur}</div>
            )}

            {boutiques.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-stone-400 mb-4">Vous n'avez pas encore de boutique.</p>
                <p className="text-stone-500 text-sm">Contactez un administrateur pour qu'il vous attribue une boutique.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-1.5">Photo de l'article</label>
                  <div className="relative">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {previewImage ? (
                      <div className="relative rounded-xl overflow-hidden border border-white/10">
                        <img src={previewImage} alt="Aperçu" className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white text-sm font-medium">Changer la photo</span>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-orange-500/50 transition-colors cursor-pointer">
                        <svg className="w-10 h-10 text-stone-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-stone-400">Cliquez pour choisir une photo</p>
                        <p className="text-xs text-stone-500 mt-1">JPG, PNG — max 5 MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-1.5">Boutique</label>
                  <select name="boutique" required value={formData.boutique} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition">
                    {boutiques.map((b) => (
                      <option key={b.id} value={b.id} className="bg-[#0a0a0a]">{b.nom}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-1.5">Nom de l'article</label>
                  <input type="text" name="nom" required value={formData.nom} onChange={handleChange} placeholder="ex: Pagne wax 6 yards" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-1.5">Description</label>
                  <textarea name="description" rows={4} value={formData.description} onChange={handleChange} placeholder="Décrivez votre article..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-300 mb-1.5">Prix (FCFA)</label>
                    <input type="number" name="prix" required min="0" step="1" value={formData.prix} onChange={handleChange} placeholder="5000" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-300 mb-1.5">Stock disponible</label>
                    <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange} placeholder="10" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Link href="/vendeur/articles" className="flex-1 text-center py-3.5 rounded-full border border-white/10 text-stone-300 font-medium hover:bg-white/5 transition-all duration-300">Annuler</Link>
                  <button type="submit" disabled={envoi} className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold py-3.5 rounded-full hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50">
                    {envoi ? 'Création...' : "Créer l'article"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}