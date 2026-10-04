export default function MentionsLegalesPage() {
  const sections = [
    {
      titre: 'Éditeur du site',
      contenu: [
        "Adjamé Market — Projet en cours de développement",
        "Marché d'Adjamé, Abidjan, Côte d'Ivoire",
        'Email : contact@adjamemarket.ci',
        'Téléphone : +225 07 00 00 00 00',
      ],
    },
    {
      titre: 'Hébergement',
      contenu: [
        "Le site est actuellement hébergé dans un environnement de développement.",
        "L'hébergement de production sera assuré par un prestataire situé dans l'Union Européenne ou en Afrique de l'Ouest, conforme au RGPD.",
      ],
    },
    {
      titre: 'Propriété intellectuelle',
      contenu: [
        "L'ensemble des contenus présents sur Adjamé Market (textes, images, logos, code source) est la propriété exclusive d'Adjamé Market, sauf mention contraire.",
        "Toute reproduction, distribution ou utilisation sans autorisation écrite préalable est strictement interdite.",
      ],
    },
    {
      titre: 'Données personnelles',
      contenu: [
        "Adjamé Market collecte et traite des données personnelles dans le respect du RGPD et de la loi ivoirienne n°2013-450 relative à la protection des données à caractère personnel.",
        "Vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données.",
        "Pour exercer ces droits, contactez-nous à : contact@adjamemarket.ci",
      ],
    },
    {
      titre: 'Cookies',
      contenu: [
        "Adjamé Market utilise uniquement des cookies techniques nécessaires au fonctionnement du site (authentification, panier).",
        "Aucun cookie publicitaire ou de tracking n'est utilisé.",
      ],
    },
    {
      titre: 'Conditions générales de vente (CGV)',
      contenu: [
        "L'utilisation d'Adjamé Market implique l'acceptation pleine et entière des présentes CGV.",
        "Les vendeurs s'engagent à fournir des articles conformes à leur description et à traiter les commandes dans les délais annoncés.",
        "Les clients s'engagent à fournir des informations exactes et à procéder au paiement dans les délais impartis.",
        "Adjamé Market agit en tant qu'intermédiaire technique entre vendeurs et clients et ne saurait être tenu responsable de la qualité des articles vendus.",
      ],
    },
    {
      titre: 'Litiges',
      contenu: [
        "En cas de litige, une solution amiable sera recherchée en priorité.",
        "À défaut d'accord, les tribunaux d'Abidjan seront seuls compétents.",
      ],
    },
    {
      titre: 'Modification des mentions légales',
      contenu: [
        "Adjamé Market se réserve le droit de modifier les présentes mentions légales à tout moment.",
        "Les utilisateurs sont invités à les consulter régulièrement.",
      ],
    },
  ];

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-12">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
            Informations légales
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-3 mb-4">
            Mentions légales
          </h1>
          <p className="text-stone-400">
            Dernière mise à jour : Octobre 2026
          </p>
        </div>

        {/* Contenu */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <div
              key={i}
              className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">
                {i + 1}. {section.titre}
              </h2>
              <div className="space-y-2">
                {section.contenu.map((ligne, j) => (
                  <p key={j} className="text-stone-400 text-sm leading-relaxed">
                    {ligne}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bas de page */}
        <div className="mt-12 text-center">
          <p className="text-stone-500 text-sm">
            © {new Date().getFullYear()} Adjamé Market — Tous droits réservés.
          </p>
        </div>
      </div>
    </main>
  );
}