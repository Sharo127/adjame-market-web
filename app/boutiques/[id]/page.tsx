import Link from 'next/link';

interface Article {
  id: number;
  nom: string;
  description: string | null;
  prix: number;
  stock: number;
}

interface Boutique {
  id: number;
  nom: string;
  description: string | null;
  articles: Article[];
}

const IMAGES_FALLBACK = [
  'https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1200',
  'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=1200',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200',
];

async function getBoutique(id: string): Promise<Boutique> {
  const res = await fetch(`http://127.0.0.1:8000/api/catalogue/boutiques/${id}/`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Boutique introuvable');
  }
  return res.json();
}

export default async function BoutiquePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const boutique = await getBoutique(id);

  return (
    <main className="min-h-screen pt-28 pb-20">
      {/* En-tête boutique */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-orange-400 transition-colors duration-300"
          >
            <span>←</span>
            <span>Retour aux boutiques</span>
          </Link>

          <div className="flex items-center gap-5 mt-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold text-3xl shadow-2xl shadow-orange-500/40">
              {boutique.nom.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                {boutique.nom}
              </h1>
              <p className="text-stone-400 text-sm mt-1">
                {boutique.description || 'Pas de description'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des articles */}
      <section className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-6">
            {boutique.articles.length} article(s) disponible(s)
          </h2>

          {boutique.articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-stone-500">Aucun article dans cette boutique.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {boutique.articles.map((article) => (
                <div
                  key={article.id}
                  className="group relative bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-500 flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-110 transition-transform duration-700"
                      style={{
                        backgroundImage: `url('${IMAGES_FALLBACK[article.id % IMAGES_FALLBACK.length]}')`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-stone-300">
                      Stock {article.stock}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1">
                      {article.nom}
                    </h3>
                    <p className="text-stone-400 text-sm leading-relaxed line-clamp-2 mb-4">
                      {article.description || 'Pas de description'}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                        {article.prix.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}