import { Recipe } from '../types/recipe';

export const INITIAL_RECIPES: Recipe[] = [
  // --- PRINTEMPS ---
  {
    id: 'rec-printemps-1',
    title: 'Risotto crémeux aux asperges vertes et parmesan 24 mois',
    season: 'spring',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'Moyen',
    tags: ['Végétarien', 'Italien', 'De saison', 'Gourmand'],
    imageUrl: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Riz Carnaroli ou Arborio', amount: '320', unit: 'g', category: 'Épicerie' },
      { id: '2', name: 'Asperges vertes fraîches', amount: '1', unit: 'botte', category: 'Légumes' },
      { id: '3', name: 'Bouillon de légumes chaud', amount: '1', unit: 'L', category: 'Épicerie' },
      { id: '4', name: 'Parmigiano Reggiano râpé', amount: '80', unit: 'g', category: 'Frais' },
      { id: '5', name: 'Vin blanc sec', amount: '10', unit: 'cl', category: 'Épicerie' },
      { id: '6', name: 'Échalotes', amount: '2', unit: 'pièces', category: 'Légumes' },
      { id: '7', name: 'Beurre demi-sel', amount: '40', unit: 'g', category: 'Frais' }
    ],
    instructions: [
      'Parez les asperges : coupez les queues ligneuses et faites blanchir les pointes 3 minutes dans de l’eau bouillante salée, puis plongez-les dans de l’eau glacée pour préserver leur couleur verte.',
      'Faites suer les échalotes émincées dans une sauteuse avec une noix de beurre.',
      'Ajoutez le riz et faites-le nacrer 2 minutes jusqu’à ce qu’il devienne translucide.',
      'Déglacez avec le vin blanc sec et laissez évaporer complètement à feu moyen.',
      'Incorporez le bouillon louche après louche pendant 18 minutes en remuant délicatement.',
      'Hors du feu, montez au beurre froid et au parmesan râpé (le mantecare), ajoutez les pointes d’asperges et servez aussitôt crémeux.'
    ],
    notes: 'Astuce d’Audrey : Gardez les queues d’asperges cuites et mixez-les avec une louche de bouillon pour apporter une onctuosité verte éclatante au risotto avant de servir.',
    rating: 5,
    createdAt: '2026-03-21T10:00:00.000Z',
    updatedAt: '2026-03-21T10:00:00.000Z'
  },
  {
    id: 'rec-printemps-2',
    title: 'Navarin printanier d’agneau aux primeurs et pois croquants',
    season: 'spring',
    prepTime: 25,
    cookTime: 50,
    servings: 6,
    difficulty: 'Facile',
    tags: ['Familial', 'Plat réconfortant', 'Tradition', 'Viande'],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Épaule d’agneau coupée en morceaux', amount: '1', unit: 'kg', category: 'Boucherie' },
      { id: '2', name: 'Petits pois frais écossés', amount: '250', unit: 'g', category: 'Légumes' },
      { id: '3', name: 'Carottes fanes nouvelles', amount: '8', unit: 'pièces', category: 'Légumes' },
      { id: '4', name: 'Navets nouveaux', amount: '6', unit: 'pièces', category: 'Légumes' },
      { id: '5', name: 'Oignons nouveaux (cébettes)', amount: '1', unit: 'botte', category: 'Légumes' },
      { id: '6', name: 'Farine', amount: '2', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '7', name: 'Bouillon de volaille', amount: '50', unit: 'cl', category: 'Épicerie' },
      { id: '8', name: 'Bouquet garni (thym, laurier)', amount: '1', unit: 'pièce', category: 'Épicerie' }
    ],
    instructions: [
      'Dans une cocotte en fonte, faites dorer les morceaux d’agneau à feu vif avec un filet d’huile d’olive.',
      'Salez, poivrez puis saupoudrez de farine (singer la viande) en remuant 2 minutes pour la torréfier légèrement.',
      'Mouillez avec le bouillon de volaille, ajoutez le bouquet garni, couvrez et laissez mijoter 30 minutes à feu doux.',
      'Pendant ce temps, pelez les carottes nouvelles et navets en gardant un petit bout de fane verte.',
      'Ajoutez les carottes, navets et oignons nouveaux dans la cocotte pour 15 minutes supplémentaires.',
      'Ajoutez enfin les petits pois croquants pour les 8 dernières minutes afin qu’ils restent bien verts et tendres.'
    ],
    notes: 'Accompagnez d’un Côte du Rhône rouge fruité ou d’un Chinon souple. Se réchauffe encore mieux le lendemain !',
    rating: 5,
    createdAt: '2026-03-25T11:00:00.000Z',
    updatedAt: '2026-03-25T11:00:00.000Z'
  },
  {
    id: 'rec-printemps-3',
    title: 'Pavé de saumon croustillant aux fèves, aneth et beurre blanc',
    season: 'spring',
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'Moyen',
    tags: ['Poisson', 'Rapide', 'Raffiné', 'Sans gluten'],
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Pavés de saumon frais Label Rouge', amount: '4', unit: 'pièces', category: 'Poissonnerie' },
      { id: '2', name: 'Fèves fraîches écossées', amount: '300', unit: 'g', category: 'Légumes' },
      { id: '3', name: 'Aneth frais', amount: '1', unit: 'bouquet', category: 'Légumes' },
      { id: '4', name: 'Échalotes ciselées', amount: '2', unit: 'pièces', category: 'Légumes' },
      { id: '5', name: 'Vin blanc sec (Muscadet)', amount: '10', unit: 'cl', category: 'Épicerie' },
      { id: '6', name: 'Beurre doux bien froid coupé en dés', amount: '120', unit: 'g', category: 'Frais' },
      { id: '7', name: 'Citron bio (zeste et jus)', amount: '1', unit: 'pièce', category: 'Légumes' }
    ],
    instructions: [
      'Ébouillantez les fèves 2 minutes puis retirez leur fine peau blanche pour révéler le vert tendre.',
      'Faites réduire le vin blanc avec les échalotes ciselées jusqu’à ce qu’il ne reste qu’une cuillère à soupe.',
      'Incorporez le beurre froid en parcelles au fouet à feu très doux pour créer un beurre blanc soyeux. Ajoutez le jus de citron et l’aneth.',
      'Dans une poêle chaude, saisissez les pavés de saumon côté peau pendant 5 minutes pour qu’elle soit bien croustillante, puis retournez 2 minutes.',
      'Dressez les fèves réchauffées avec le poisson et nappez de sauce émulsionnée.'
    ],
    notes: 'Le secret : le beurre blanc doit être monté à feu très doux sans jamais bouillir.',
    rating: 4,
    createdAt: '2026-04-02T12:00:00.000Z',
    updatedAt: '2026-04-02T12:00:00.000Z'
  },
  {
    id: 'rec-printemps-4',
    title: 'Tarte sablée aux fraises Gariguette et crème diplomate vanille',
    season: 'spring',
    prepTime: 35,
    cookTime: 20,
    servings: 6,
    difficulty: 'Moyen',
    tags: ['Dessert', 'Pâtisserie', 'Gourmand', 'Fruits'],
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Fraises Gariguette parfumées', amount: '500', unit: 'g', category: 'Légumes' },
      { id: '2', name: 'Pâte sablée pur beurre maison', amount: '1', unit: 'rouleau', category: 'Frais' },
      { id: '3', name: 'Lait entier', amount: '35', unit: 'cl', category: 'Frais' },
      { id: '4', name: 'Gousse de vanille de Madagascar', amount: '1', unit: 'gousse', category: 'Épicerie' },
      { id: '5', name: 'Jaunes d’œufs', amount: '3', unit: 'pièces', category: 'Frais' },
      { id: '6', name: 'Sucre en poudre', amount: '60', unit: 'g', category: 'Épicerie' },
      { id: '7', name: 'Fécule de maïs (Maïzena)', amount: '30', unit: 'g', category: 'Épicerie' },
      { id: '8', name: 'Crème liquide entière 30% très froide', amount: '15', unit: 'cl', category: 'Frais' }
    ],
    instructions: [
      'Faites cuire le fond de tarte à blanc pendant 20 minutes à 180°C jusqu’à dorure ambrée.',
      'Préparez la crème pâtissière avec le lait infusé à la vanille, les jaunes battus avec le sucre et la fécule.',
      'Une fois la crème refroidie, montez la crème liquide en chantilly ferme et incorporez-la délicatement à la spatule.',
      'Garnissez le fond de tarte avec la crème diplomate.',
      'Équeutez les fraises, coupez-les en deux dans la longueur et disposez-les harmonieusement en rosace.',
      'Décorez de quelques feuilles de menthe fraîche et d’un voile de sucre glace.'
    ],
    notes: 'Ne lavez jamais les fraises après les avoir équeutées pour ne pas les gorger d’eau !',
    rating: 5,
    createdAt: '2026-04-10T14:30:00.000Z',
    updatedAt: '2026-04-10T14:30:00.000Z'
  },
  {
    id: 'rec-printemps-5',
    title: 'Filet de cabillaud en croûte d’herbes et écrasé de petits pois à la menthe',
    season: 'spring',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Poisson', 'Rapide', 'Léger', 'De saison', 'Bistrot'],
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Dos ou filets épais de cabillaud', amount: '600', unit: 'g', category: 'Poissonnerie' },
      { id: '2', name: 'Petits pois primeurs frais ou surgelés', amount: '450', unit: 'g', category: 'Légumes' },
      { id: '3', name: 'Chapelure fine de pain doré', amount: '40', unit: 'g', category: 'Épicerie' },
      { id: '4', name: 'Herbes fraîches (persil plat, cerfeuil, ciboulette)', amount: '1', unit: 'botte', category: 'Légumes' },
      { id: '5', name: 'Feuilles de menthe fraîche', amount: '10', unit: 'feuilles', category: 'Légumes' },
      { id: '6', name: 'Beurre demi-sel pommade', amount: '35', unit: 'g', category: 'Frais' },
      { id: '7', name: 'Citron jaune bio', amount: '1', unit: 'pièce', category: 'Légumes' }
    ],
    instructions: [
      'Mixez la chapelure avec le beurre mou, les herbes fraîches hachées, du sel et un trait de jus de citron pour obtenir une pâte d’herbes.',
      'Faites cuire les petits pois 6 minutes dans l’eau bouillante salée avec la menthe, puis écrasez-les à la fourchette avec une noisette de beurre et un filet d’huile d’olive.',
      'Déposez les dos de cabillaud sur une plaque chemisée de papier cuisson et étalez la croûte d’herbes sur le dessus.',
      'Enfournez à 190°C pendant 12 à 14 minutes jusqu’à ce que la croûte soit dorée et croustillante et le poisson nacré à cœur.',
      'Dressez l’écrasé vert vif au centre des assiettes et déposez le cabillaud dessus.'
    ],
    notes: 'La croûte d’herbes emprisonne le jus du poisson et garantit une chair ultra moelleuse et parfumée.',
    rating: 5,
    createdAt: '2026-04-12T11:00:00.000Z',
    updatedAt: '2026-04-12T11:00:00.000Z'
  },
  {
    id: 'rec-printemps-6',
    title: 'Tarte fine printanière aux fèves fraîches, ricotta crémeuse et estragon',
    season: 'spring',
    prepTime: 20,
    cookTime: 30,
    servings: 6,
    difficulty: 'Facile',
    tags: ['Végétarien', 'Tarte', 'Convivial', 'Bistrot'],
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Pâte feuilletée pur beurre', amount: '1', unit: 'rouleau', category: 'Frais' },
      { id: '2', name: 'Fèves fraîches écossées et dérobées', amount: '300', unit: 'g', category: 'Légumes' },
      { id: '3', name: 'Ricotta fraîche de brebis ou vache', amount: '250', unit: 'g', category: 'Frais' },
      { id: '4', name: 'Zeste râpé d’un citron non traité', amount: '1', unit: 'pièce', category: 'Légumes' },
      { id: '5', name: 'Estragon et cerfeuil frais ciselés', amount: '3', unit: 'c. à soupe', category: 'Légumes' },
      { id: '6', name: 'Pignons de pin torréfiés', amount: '30', unit: 'g', category: 'Épicerie' },
      { id: '7', name: 'Huile d’olive fruitée', amount: '2', unit: 'c. à soupe', category: 'Épicerie' }
    ],
    instructions: [
      'Déroulez la pâte feuilletée sur une plaque de four et piquez le centre à la fourchette en laissant une bordure de 1 cm.',
      'Dans un bol, détendez la ricotta avec l’huile d’olive, le zeste de citron, l’estragon, du sel fin et du poivre du moulin.',
      'Étalez la préparation à la ricotta sur la pâte.',
      'Plongez les fèves 2 minutes dans l’eau bouillante, rafraîchissez-les et retirez leur petite peau blanche (dérobage).',
      'Répartissez les fèves sur la tarte, parsemez de pignons et enfournez à 200°C pendant 25 à 30 minutes jusqu’à dorure complète.',
      'Servez tiède avec une belle salade de roquette sauvage.'
    ],
    notes: 'Prenez le temps de dérober les fèves : leur goût devient infiniment plus doux et leur vert printanier éclatant.',
    rating: 4,
    createdAt: '2026-04-18T10:00:00.000Z',
    updatedAt: '2026-04-18T10:00:00.000Z'
  },
  {
    id: 'rec-printemps-7',
    title: 'Suprêmes de poulet fermier aux morilles fraîches et crème au Savagnin',
    season: 'spring',
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: 'Moyen',
    tags: ['Volaille', 'Gastronomique', 'Familial', 'Tradition'],
    imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Suprêmes ou blancs de volaille fermière', amount: '4', unit: 'pièces', category: 'Boucherie' },
      { id: '2', name: 'Morilles fraîches nettoyées (ou réhydratées)', amount: '150', unit: 'g', category: 'Légumes' },
      { id: '3', name: 'Vin blanc sec du Jura (Savagnin ou Côtes du Jura)', amount: '15', unit: 'cl', category: 'Épicerie' },
      { id: '4', name: 'Crème fraîche épaisse de Normandie', amount: '25', unit: 'cl', category: 'Frais' },
      { id: '5', name: 'Échalotes ciselées', amount: '2', unit: 'pièces', category: 'Légumes' },
      { id: '6', name: 'Beurre doux fermier', amount: '30', unit: 'g', category: 'Frais' }
    ],
    instructions: [
      'Brossez et lavez soigneusement les morilles à grande eau tiède, égouttez-les bien.',
      'Dans une poêle, faites dorer les suprêmes de poulet au beurre 5 minutes par face, salez, poivrez et réservez-les au chaud.',
      'Faites revenir les échalotes et les morilles dans la même poêle pendant 6 minutes.',
      'Déglacez avec le vin blanc du Jura et laissez réduire des deux tiers.',
      'Ajoutez la crème fraîche, remettez les morceaux de poulet et laissez frémir doucement 10 minutes pour napper la viande.',
      'Servez avec des tagliatelles fraîches au beurre.'
    ],
    notes: 'Le plat d’exception des dimanches de printemps. Si vous utilisez des morilles déshydratées, filtrez leur eau de trempage pour corser la sauce.',
    rating: 5,
    createdAt: '2026-04-26T12:00:00.000Z',
    updatedAt: '2026-04-26T12:00:00.000Z'
  },
  {
    id: 'rec-printemps-8',
    title: 'Clafoutis fondant aux cerises Burlat de Provence et amandes effilées',
    season: 'spring',
    prepTime: 15,
    cookTime: 35,
    servings: 6,
    difficulty: 'Facile',
    tags: ['Dessert', 'Gourmand', 'Tradition', 'Fruits', 'Rapide'],
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Cerises Burlat charnues et mûres', amount: '500', unit: 'g', category: 'Légumes' },
      { id: '2', name: 'Œufs frais bio', amount: '4', unit: 'pièces', category: 'Frais' },
      { id: '3', name: 'Lait entier de ferme', amount: '25', unit: 'cl', category: 'Frais' },
      { id: '4', name: 'Crème liquide entière', amount: '10', unit: 'cl', category: 'Frais' },
      { id: '5', name: 'Sucre de canne blond', amount: '90', unit: 'g', category: 'Épicerie' },
      { id: '6', name: 'Farine de blé T55', amount: '70', unit: 'g', category: 'Épicerie' },
      { id: '7', name: 'Amandes effilées torréfiées', amount: '30', unit: 'g', category: 'Épicerie' },
      { id: '8', name: 'Beurre pour le moule', amount: '20', unit: 'g', category: 'Frais' }
    ],
    instructions: [
      'Beurrez et sucrez généreusement un plat à gratin en céramique.',
      'Lavez et équeutez les cerises (gardez les noyaux comme dans la tradition limousine pour donner un subtil goût d’amande amère).',
      'Disposez les cerises dans le fond du plat.',
      'Battez les œufs avec le sucre, ajoutez la farine, puis versez le lait et la crème pour obtenir un appareil lisse façon pâte à crêpes.',
      'Versez la pâte sur les cerises, parsemez d’amandes effilées et enfournez à 180°C pendant 35 minutes.',
      'Laissez tiédir avant de saupoudrer d’un léger voile de sucre glace.'
    ],
    notes: 'Les puristes laissent les noyaux : non seulement le jus ne détrempe pas la pâte, mais la cuisson diffuse un parfum d’amandon inimitable.',
    rating: 5,
    createdAt: '2026-05-15T15:00:00.000Z',
    updatedAt: '2026-05-15T15:00:00.000Z'
  },
  {
    id: 'rec-printemps-9',
    title: 'Salade tiède de rattes de Noirmoutier au saumon mariné et aneth frais',
    season: 'spring',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Salade', 'Poisson', 'Rapide', 'Sans gluten', 'Léger'],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Pommes de terre primeurs de Noirmoutier', amount: '600', unit: 'g', category: 'Légumes' },
      { id: '2', name: 'Pavés de saumon frais taillés en lamelles ou saumon fumé artisanal', amount: '200', unit: 'g', category: 'Poissonnerie' },
      { id: '3', name: 'Oignons cébettes émincés', amount: '3', unit: 'tiges', category: 'Légumes' },
      { id: '4', name: 'Botte d’aneth frais ciselé', amount: '1', unit: 'botte', category: 'Légumes' },
      { id: '5', name: 'Moutarde à l’ancienne', amount: '1', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '6', name: 'Vinaigre de cidre normand', amount: '2', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '7', name: 'Huile de colza ou d’olive', amount: '4', unit: 'c. à soupe', category: 'Épicerie' }
    ],
    instructions: [
      'Brossez les petites pommes de terre sous l’eau sans les éplucher et faites-les cuire à la vapeur ou à l’eau salée pendant 15 minutes.',
      'Dans un saladier, fouettez la moutarde avec le vinaigre, du sel, du poivre et l’huile pour lier la vinaigrette.',
      'Coupez les pommes de terre encore tièdes en deux ou en rondelles et arrosez-les immédiatement de vinaigrette pour qu’elles s’imprègnent des arômes.',
      'Ajoutez les cébettes ciselées, l’aneth frais et les lanières de saumon.',
      'Mélangez délicatement et servez à température ambiante.'
    ],
    notes: 'L’astuce d’Audrey : arroser les pommes de terre chaudes d’un filet de vin blanc sec ou de vinaigre avant l’huile permet d’absorber parfaitement l’assaisonnement.',
    rating: 4,
    createdAt: '2026-05-20T12:00:00.000Z',
    updatedAt: '2026-05-20T12:00:00.000Z'
  },

  // --- ÉTÉ ---
  {
    id: 'rec-ete-1',
    title: 'Ratatouille confite à la provençale et herbes du potager',
    season: 'summer',
    prepTime: 25,
    cookTime: 60,
    servings: 6,
    difficulty: 'Facile',
    tags: ['Végétarien', 'Tradition', 'Méditerranée', 'Sain', 'Léger'],
    imageUrl: 'https://images.unsplash.com/photo-1572441713132-c542fc4fe282?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Aubergines fermes', amount: '2', unit: 'grosses', category: 'Légumes' },
      { id: '2', name: 'Courgettes vertes et jaunes', amount: '3', unit: 'pièces', category: 'Légumes' },
      { id: '3', name: 'Poivrons rouges et jaunes', amount: '2', unit: 'pièces', category: 'Légumes' },
      { id: '4', name: 'Tomates mûres de plein champ', amount: '5', unit: 'pièces', category: 'Légumes' },
      { id: '5', name: 'Gousses d’ail écrasées', amount: '4', unit: 'gousses', category: 'Légumes' },
      { id: '6', name: 'Huile d’olive vierge extra', amount: '6', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '7', name: 'Thym frais et romarin', amount: '3', unit: 'brins', category: 'Légumes' }
    ],
    instructions: [
      'Taillez chaque légume en dés réguliers d’environ 2 cm.',
      'Règle d’or : faites revenir chaque légume séparément dans l’huile d’olive pour préserver sa texture et sa caramélisation.',
      'Faites suer l’ail et les oignons, puis ajoutez les tomates concassées avec le thym et le romarin.',
      'Réunissez tous les légumes dans une grande cocotte, salez à la fleur de sel, poivrez.',
      'Laissez confire à feu très doux à couvert pendant 45 minutes en remuant délicatement.'
    ],
    notes: 'Excellente chaude avec une dorade grillée, ou froide sur du pain de campagne frotté à l’ail.',
    rating: 5,
    createdAt: '2026-06-25T11:00:00.000Z',
    updatedAt: '2026-06-25T11:00:00.000Z'
  },
  {
    id: 'rec-ete-2',
    title: 'Gaspacho andalou aux tomates anciennes et basilic pourpre',
    season: 'summer',
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Rapide', 'Sans cuisson', 'Végétarien', 'Fraîcheur', 'Entrée'],
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Tomates cœur de bœuf mûres à point', amount: '800', unit: 'g', category: 'Légumes' },
      { id: '2', name: 'Concombre Noa pelé', amount: '1/2', unit: 'pièce', category: 'Légumes' },
      { id: '3', name: 'Poivron rouge épépiné', amount: '1', unit: 'pièce', category: 'Légumes' },
      { id: '4', name: 'Pain rassis au levain sans croûte', amount: '50', unit: 'g', category: 'Épicerie' },
      { id: '5', name: 'Huile d’olive fruité mûr', amount: '4', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '6', name: 'Vinaigre de Xérès', amount: '2', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '7', name: 'Gousse d’ail dégermée', amount: '1', unit: 'pièce', category: 'Légumes' }
    ],
    instructions: [
      'Coupez grossièrement tous les légumes lavés et placez-les dans le bol du blender.',
      'Ajoutez le pain trempé dans le vinaigre de Xérès, l’ail et l’huile d’olive.',
      'Mixez longuement à haute vitesse jusqu’à obtenir une émulsion veloutée et homogène.',
      'Passez au chinois fin pour une texture digne d’un grand restaurant.',
      'Placez au réfrigérateur pendant au moins 3 heures avant de servir glacé dans des bols avec des dés de concombre croquants.'
    ],
    notes: 'Servez avec quelques gouttes d’huile de basilic et des croûtons dorés à la poêle.',
    rating: 5,
    createdAt: '2026-07-02T13:00:00.000Z',
    updatedAt: '2026-07-02T13:00:00.000Z'
  },
  {
    id: 'rec-ete-3',
    title: 'Salade de pêches rôties au miel, burrata crémeuse et pignons',
    season: 'summer',
    prepTime: 12,
    cookTime: 6,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Rapide', 'Sucré-salé', 'Végétarien', 'Estival', 'Entrée'],
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a88?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Burrata di Bufala artisanale', amount: '2', unit: 'pièces', category: 'Frais' },
      { id: '2', name: 'Pêches jaunes ou nectarines mûres', amount: '4', unit: 'pièces', category: 'Légumes' },
      { id: '3', name: 'Roquette sauvage', amount: '100', unit: 'g', category: 'Légumes' },
      { id: '4', name: 'Pignons de pin torréfiés', amount: '30', unit: 'g', category: 'Épicerie' },
      { id: '5', name: 'Miel de lavande de Provence', amount: '2', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '6', name: 'Vinaigre balsamique de Modène vieilli', amount: '1', unit: 'filet', category: 'Épicerie' },
      { id: '7', name: 'Feuilles de basilic frais', amount: '1', unit: 'poignée', category: 'Légumes' }
    ],
    instructions: [
      'Coupez les pêches en quartiers épais.',
      'Faites chauffer une poêle grill avec une cuillère d’huile d’olive et le miel, puis faites caraméliser les quartiers de pêches 2 minutes par face.',
      'Dressez un lit de roquette fraîche sur un grand plat de partage.',
      'Déposez les burratas au centre et déchirez-les légèrement pour faire couler le cœur crémeux.',
      'Disposez les quartiers de pêches chaudes autour, parsemez de pignons torréfiés, de basilic et arrosez de vinaigre balsamique.'
    ],
    notes: 'Le contraste entre la pêche tiède caramélisée et la burrata fraîche est un pur délice !',
    rating: 5,
    createdAt: '2026-07-15T18:00:00.000Z',
    updatedAt: '2026-07-15T18:00:00.000Z'
  },
  {
    id: 'rec-ete-4',
    title: 'Brochettes de poulet fermier mariné au citron et origan sauvage',
    season: 'summer',
    prepTime: 20,
    cookTime: 12,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Barbecue', 'Viande', 'Convivial', 'Familial', 'Rapide'],
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Blancs de poulet fermier', amount: '600', unit: 'g', category: 'Boucherie' },
      { id: '2', name: 'Citrons non traités (zeste et jus)', amount: '2', unit: 'pièces', category: 'Légumes' },
      { id: '3', name: 'Huile d’olive vierge extra', amount: '5', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '4', name: 'Origan séché de Méditerranée', amount: '2', unit: 'c. à café', category: 'Épicerie' },
      { id: '5', name: 'Gousses d’ail râpées', amount: '2', unit: 'gousses', category: 'Légumes' },
      { id: '6', name: 'Courgettes coupées en rondelles', amount: '2', unit: 'pièces', category: 'Légumes' },
      { id: '7', name: 'Tomates cerises grappe', amount: '16', unit: 'pièces', category: 'Légumes' }
    ],
    instructions: [
      'Taillez les filets de poulet en cubes réguliers.',
      'Dans un saladier, préparez la marinade avec le jus et zestes de citron, l’ail, l’origan, l’huile d’olive, sel et poivre.',
      'Enrobez la viande et laissez mariner au frais pendant 30 minutes minimum.',
      'Montez les brochettes en alternant cube de poulet, rondelle de courgette et tomate cerise.',
      'Faites griller à la plancha ou au barbecue 10 à 12 minutes en retournant régulièrement pour une belle coloration.'
    ],
    notes: 'Servez avec du tzatziki maison à la menthe et du pain pita tiédi.',
    rating: 4,
    createdAt: '2026-07-20T12:00:00.000Z',
    updatedAt: '2026-07-20T12:00:00.000Z'
  },
  {
    id: 'rec-ete-5',
    title: 'Tomates anciennes farcies au veau fermier, thym frais et riz de Camargue',
    season: 'summer',
    prepTime: 25,
    cookTime: 50,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Familial', 'Plat mijoté', 'Tradition', 'Viande'],
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a56?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Grosses tomates anciennes fermes (Cœur de bœuf, Marmande)', amount: '6', unit: 'pièces', category: 'Légumes' },
      { id: '2', name: 'Viande hachée de veau et porc', amount: '450', unit: 'g', category: 'Boucherie' },
      { id: '3', name: 'Riz rond de Camargue cru', amount: '50', unit: 'g', category: 'Épicerie' },
      { id: '4', name: 'Oignon jaune et gousse d’ail', amount: '2', unit: 'pièces', category: 'Légumes' },
      { id: '5', name: 'Persil plat et thym frais émietté', amount: '2', unit: 'c. à soupe', category: 'Légumes' },
      { id: '6', name: 'Œuf frais', amount: '1', unit: 'pièce', category: 'Frais' },
      { id: '7', name: 'Huile d’olive de Provence', amount: '3', unit: 'c. à soupe', category: 'Épicerie' }
    ],
    instructions: [
      'Coupez le chapeau des tomates et évidez délicatement la pulpe à l’aide d’une cuillère en conservant le jus.',
      'Salez légèrement l’intérieur des tomates et retournez-les sur du papier absorbant pendant 15 minutes pour les dégorger.',
      'Dans un saladier, malaxez la viande hachée avec l’oignon émincé, l’ail écrasé, les herbes, l’œuf, le riz cru et un peu de pulpe de tomate.',
      'Remplissez généreusement les tomates de farce et déposez-les dans un plat à four avec leur chapeau.',
      'Versez le reste de jus de tomate au fond du plat avec un filet d’huile d’olive.',
      'Enfournez à 180°C pendant 50 minutes : le riz absorbe le jus au fond et la viande reste ultra moelleuse.'
    ],
    notes: 'Le riz cru déposé au fond de chaque tomate absorbe l’eau de végétation pendant la cuisson et garantit une farce jamais sèche.',
    rating: 5,
    createdAt: '2026-07-28T11:00:00.000Z',
    updatedAt: '2026-07-28T11:00:00.000Z'
  },
  {
    id: 'rec-ete-6',
    title: 'Carpaccio de courgettes jaunes et vertes, copeaux de pecorino et pignons dorés',
    season: 'summer',
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Entrée', 'Végétarien', 'Ultra rapide', 'Sans cuisson', 'Léger'],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Petites courgettes très fraîches (vertes et jaunes)', amount: '3', unit: 'pièces', category: 'Légumes' },
      { id: '2', name: 'Pecorino romano ou copeaux de parmesan', amount: '50', unit: 'g', category: 'Frais' },
      { id: '3', name: 'Pignons de pin torréfiés', amount: '25', unit: 'g', category: 'Épicerie' },
      { id: '4', name: 'Jus et zeste d’un citron jaune frais', amount: '1', unit: 'pièce', category: 'Légumes' },
      { id: '5', name: 'Feuilles de basilic frais pourpre ou vert', amount: '1', unit: 'poignée', category: 'Légumes' },
      { id: '6', name: 'Huile d’olive extra vierge première pression', amount: '4', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '7', name: 'Fleur de sel de Guérande et poivre concassé', amount: '1', unit: 'pincée', category: 'Épicerie' }
    ],
    instructions: [
      'À l’aide d’un économe ou d’une mandoline, taillez les courgettes lavées en très fines lanières dans la longueur.',
      'Dressez les rubans de courgettes en rosace harmonieuse sur un grand plat de présentation en alternant le jaune et le vert.',
      'Arrosez de jus de citron et d’huile d’olive, assaisonnez de fleur de sel et de poivre du moulin.',
      'Laissez mariner 10 minutes à température ambiante pour que le citron attendrisse la chair croquante.',
      'Au moment de servir, parsemez des copeaux de pecorino, des pignons tièdes et de feuilles de basilic frais.'
    ],
    notes: 'Idéal en pleine canicule : zéro cuisson, ultra rafraîchissant et prêt en 10 minutes montre en main.',
    rating: 4,
    createdAt: '2026-08-02T12:30:00.000Z',
    updatedAt: '2026-08-02T12:30:00.000Z'
  },
  {
    id: 'rec-ete-7',
    title: 'Linguine aux palourdes de l’Atlantique, persil plat et piment d’Espelette',
    season: 'summer',
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Pâtes', 'Poissonnerie', 'Rapide', 'Italien', 'De saison'],
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Linguine de blé dur de qualité', amount: '400', unit: 'g', category: 'Épicerie' },
      { id: '2', name: 'Palourdes ou coques fraîches bien dégorgées', amount: '800', unit: 'g', category: 'Poissonnerie' },
      { id: '3', name: 'Gousses d’ail émincées', amount: '3', unit: 'gousses', category: 'Légumes' },
      { id: '4', name: 'Vin blanc sec (Muscadet ou Sauvignon)', amount: '15', unit: 'cl', category: 'Épicerie' },
      { id: '5', name: 'Persil plat frais haché', amount: '1', unit: 'botte', category: 'Légumes' },
      { id: '6', name: 'Huile d’olive vierge extra', amount: '5', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '7', name: 'Piment d’Espelette AOP', amount: '1', unit: 'c. à café', category: 'Épicerie' }
    ],
    instructions: [
      'Rincez abondamment les coquillages sous l’eau courante pour éliminer tout résidu de sable.',
      'Faites cuire les linguine dans un grand volume d’eau bouillante salée en arrêtant 2 minutes avant le temps al dente.',
      'Dans une grande poêle profonde, faites revenir l’ail émincé et le piment d’Espelette dans l’huile d’olive sans colorer.',
      'Ajoutez les palourdes et le vin blanc sec, couvrez hermétiquement et laissez ouvrir à feu vif 3 à 4 minutes.',
      'Égouttez les pâtes en gardant un verre d’eau de cuisson et jetez-les directement dans les coquillages.',
      'Mélangez vigoureusement pour que le jus émulsionne avec l’amidon des pâtes, ajoutez le persil plat et servez brûlant.'
    ],
    notes: 'N’ajoutez pas de sel supplémentaire au plat : l’eau de mer libérée par les coquillages suffit amplement à saler les pâtes.',
    rating: 5,
    createdAt: '2026-08-08T19:30:00.000Z',
    updatedAt: '2026-08-08T19:30:00.000Z'
  },
  {
    id: 'rec-ete-8',
    title: 'Brochettes d’agneau mariné au romarin frais, origan et caviar d’aubergines',
    season: 'summer',
    prepTime: 20,
    cookTime: 12,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Barbecue', 'Viande', 'Méditerranéen', 'Convivial'],
    imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Gigot ou épaule d’agneau coupée en cubes', amount: '650', unit: 'g', category: 'Boucherie' },
      { id: '2', name: 'Aubergines violettes', amount: '2', unit: 'pièces', category: 'Légumes' },
      { id: '3', name: 'Brins de romarin frais et origan séché', amount: '2', unit: 'branches', category: 'Légumes' },
      { id: '4', name: 'Gousses d’ail écrasées', amount: '2', unit: 'gousses', category: 'Légumes' },
      { id: '5', name: 'Huile d’olive', amount: '4', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '6', name: 'Citron bio (jus et quartiers)', amount: '1', unit: 'pièce', category: 'Légumes' }
    ],
    instructions: [
      'Piquez les aubergines à la fourchette et faites-les rôtir entières 35 minutes au four ou sur la braise jusqu’à ce qu’elles soient fripées et fondantes.',
      'Récupérez la pulpe des aubergines à la cuillère, écrasez-la avec l’ail, l’huile d’olive, du sel, du poivre et du jus de citron pour le caviar.',
      'Enrobez les cubes d’agneau avec le romarin effeuillé, l’origan, l’huile d’olive et un peu d’ail.',
      'Montez sur des piques à brochettes et grillez à feu vif 8 à 10 minutes en gardant un cœur bien rosé.',
      'Servez les brochettes fumantes sur un lit de caviar d’aubergine tiède.'
    ],
    notes: 'Le parfum fumé de l’aubergine rôtie sur la braise s’associe à merveille avec la texture juteuse de l’agneau grillé.',
    rating: 5,
    createdAt: '2026-08-14T12:00:00.000Z',
    updatedAt: '2026-08-14T12:00:00.000Z'
  },
  {
    id: 'rec-ete-9',
    title: 'Soupe glacée de pêches blanches de vigne à la verveine et framboises fraîches',
    season: 'summer',
    prepTime: 15,
    cookTime: 5,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Dessert', 'Léger', 'Sans gluten', 'Fruits', 'Rapide'],
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Pêches blanches ou de vigne très parfumées', amount: '6', unit: 'pièces', category: 'Légumes' },
      { id: '2', name: 'Framboises fraîches', amount: '125', unit: 'g', category: 'Légumes' },
      { id: '3', name: 'Feuilles de verveine citronnelle fraîche', amount: '15', unit: 'feuilles', category: 'Légumes' },
      { id: '4', name: 'Miel de lavande ou sirop d’agave', amount: '2', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '5', name: 'Eau minérale', amount: '20', unit: 'cl', category: 'Épicerie' },
      { id: '6', name: 'Jus d’un demi-citron vert', amount: '1', unit: 'pièce', category: 'Légumes' }
    ],
    instructions: [
      'Faites frémir l’eau avec le miel de lavande, éteignez le feu, jetez-y les feuilles de verveine et laissez infuser à couvert 10 minutes.',
      'Pelez 5 pêches, coupez-les en morceaux et mixez-les finement avec le sirop de verveine filtré et le jus de citron vert.',
      'Placez la soupe au réfrigérateur pendant au moins 2 heures pour qu’elle soit bien frappée.',
      'Taillez la dernière pêche en fines lamelles avec sa peau pour le décor.',
      'Servez la soupe glacée dans des coupelles, garnissez de lamelles de pêche, de framboises fraîches et de petites feuilles de verveine.'
    ],
    notes: 'Un dessert d’été d’une fraîcheur absolue, parfait pour conclure un repas en terrasse sans alourdir.',
    rating: 4,
    createdAt: '2026-08-20T16:00:00.000Z',
    updatedAt: '2026-08-20T16:00:00.000Z'
  },

  // --- AUTOMNE (CURRENT SEASON) ---
  {
    id: 'rec-automne-1',
    title: 'Velouté soyeux de potimarron, châtaignes et noisettes torréfiées',
    season: 'autumn',
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Soupe', 'Végétarien', 'Réconfortant', 'De saison', 'Sans gluten'],
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Potimarron bio (avec sa peau lavée)', amount: '1', unit: 'pièce (approx 1kg)', category: 'Légumes' },
      { id: '2', name: 'Châtaignes cuites au naturel sous vide', amount: '200', unit: 'g', category: 'Épicerie' },
      { id: '3', name: 'Oignon jaune émincé', amount: '1', unit: 'pièce', category: 'Légumes' },
      { id: '4', name: 'Crème fraîche d’Isigny AOP', amount: '15', unit: 'cl', category: 'Frais' },
      { id: '5', name: 'Noisettes entières concassées', amount: '40', unit: 'g', category: 'Épicerie' },
      { id: '6', name: 'Bouillon de légumes chaud', amount: '80', unit: 'cl', category: 'Épicerie' },
      { id: '7', name: 'Muscade râpée', amount: '1', unit: 'pincée', category: 'Épicerie' }
    ],
    instructions: [
      'Lavez le potimarron, coupez-le en deux, retirez les graines puis détaillez la chair en cubes (pas besoin d’éplucher la peau bio, elle fond et donne du goût !).',
      'Dans une cocotte, faites suer l’oignon émincé dans un peu de beurre.',
      'Ajoutez les cubes de potimarron et la moitié des châtaignes émiettées.',
      'Mouillez avec le bouillon de légumes chaud, portez à ébullition puis laissez mijoter 25 minutes à couvert.',
      'Pendant ce temps, faites torréfier les noisettes concassées à sec dans une poêle chaude.',
      'Mixez finement le velouté en ajoutant la crème fraîche et la muscade jusqu’à texture soyeuse.',
      'Servez dans des bols creux garni du reste de châtaignes tièdes et de noisettes croquantes.'
    ],
    notes: 'La touche d’Audrey : un filet d’huile de noisette de première pression à froid au moment du service.',
    rating: 5,
    createdAt: '2026-10-05T09:00:00.000Z',
    updatedAt: '2026-10-05T09:00:00.000Z'
  },
  {
    id: 'rec-automne-2',
    title: 'Risotto aux cèpes bouchons, parmesan affiné et thym frais',
    season: 'autumn',
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: 'Moyen',
    tags: ['Champignons', 'Végétarien', 'Raffiné', 'Automnal'],
    imageUrl: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Riz Carnaroli', amount: '300', unit: 'g', category: 'Épicerie' },
      { id: '2', name: 'Cèpes frais (ou surgelés de belle qualité)', amount: '400', unit: 'g', category: 'Légumes' },
      { id: '3', name: 'Échalotes françaises', amount: '2', unit: 'pièces', category: 'Légumes' },
      { id: '4', name: 'Gousses d’ail hachées', amount: '2', unit: 'gousses', category: 'Légumes' },
      { id: '5', name: 'Vin blanc sec', amount: '12', unit: 'cl', category: 'Épicerie' },
      { id: '6', name: 'Bouillon de volaille ou champignons', amount: '1', unit: 'L', category: 'Épicerie' },
      { id: '7', name: 'Parmesan râpé', amount: '70', unit: 'g', category: 'Frais' },
      { id: '8', name: 'Beurre doux', amount: '40', unit: 'g', category: 'Frais' }
    ],
    instructions: [
      'Nettoyez délicatement les cèpes au pinceau humide et émincez-les en tranches généreuses.',
      'Dans une poêle très chaude, faites sauter les cèpes avec un filet d’huile d’olive, l’ail et le persil pendant 6 minutes. Réservez au chaud.',
      'Faites revenir les échalotes émincées dans le beurre, ajoutez le riz pour le nacrer 2 minutes.',
      'Mouillez avec le vin blanc, puis versez le bouillon bouillant louche par louche pendant 18 minutes.',
      'À 2 minutes de la fin, incorporez les 3/4 des cèpes sautés.',
      'Mantecare : coupez le feu, ajoutez le beurre froid et le parmesan, couvrez 2 minutes puis mélangez vivement. Décorez avec les plus beaux morceaux de cèpes.'
    ],
    notes: 'Si vous avez de la poudre de cèpes séchés, ajoutez-en 1/2 cuillère à café dans le bouillon pour décupler le parfum forestier.',
    rating: 5,
    createdAt: '2026-10-12T11:00:00.000Z',
    updatedAt: '2026-10-12T11:00:00.000Z'
  },
  {
    id: 'rec-automne-3',
    title: 'Blanquette de veau à l’ancienne aux champignons des bois',
    season: 'autumn',
    prepTime: 30,
    cookTime: 90,
    servings: 6,
    difficulty: 'Moyen',
    tags: ['Mijoté', 'Familial', 'Tradition', 'Viande', 'Réconfortant'],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Épaule et tendron de veau fermier', amount: '1.2', unit: 'kg', category: 'Boucherie' },
      { id: '2', name: 'Carottes des sables', amount: '4', unit: 'pièces', category: 'Légumes' },
      { id: '3', name: 'Poireaux émincés (blancs)', amount: '2', unit: 'pièces', category: 'Légumes' },
      { id: '4', name: 'Champignons de Paris ou chanterelles', amount: '300', unit: 'g', category: 'Légumes' },
      { id: '5', name: 'Petits oignons grelots', amount: '150', unit: 'g', category: 'Légumes' },
      { id: '6', name: 'Jaunes d’œufs', amount: '2', unit: 'pièces', category: 'Frais' },
      { id: '7', name: 'Crème fraîche épaisse de Normandie', amount: '20', unit: 'cl', category: 'Frais' },
      { id: '8', name: 'Jus d’un demi-citron', amount: '1', unit: 'filet', category: 'Légumes' }
    ],
    instructions: [
      'Plongez les morceaux de veau dans une grande marmite d’eau froide, portez à frémissement et écumez soigneusement.',
      'Ajoutez les carottes coupées en rondelles, les blancs de poireaux, un oignon piqué de clous de girofle et le bouquet garni. Laissez mijoter 1h15 à feu très doux.',
      'Faites revenir les champignons et petits oignons grelots au beurre dans une poêle séparée.',
      'Préparez un roux blanc avec 40g de beurre et 40g de farine, puis mouillez avec le bouillon de cuisson filtré pour obtenir une sauce onctueuse.',
      'Liaison finale hors du feu : fouettez la crème et les jaunes d’œufs avec le jus de citron, puis versez dans la sauce sans faire rebouillir.',
      'Rassemblez la viande, les légumes et les champignons dans la sauce nappante.'
    ],
    notes: 'Servez avec du riz basmati blanc ou des tagliatelles fraîches au beurre.',
    rating: 5,
    createdAt: '2026-10-18T10:00:00.000Z',
    updatedAt: '2026-10-18T10:00:00.000Z'
  },
  {
    id: 'rec-automne-4',
    title: 'Tarte Tatin caramélisée aux pommes Reinettes et crème crue',
    season: 'autumn',
    prepTime: 25,
    cookTime: 40,
    servings: 6,
    difficulty: 'Facile',
    tags: ['Dessert', 'Gourmand', 'Automnal', 'Tradition'],
    imageUrl: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Pommes Reinettes ou Chantecler', amount: '2', unit: 'kg', category: 'Légumes' },
      { id: '2', name: 'Beurre demi-sel', amount: '100', unit: 'g', category: 'Frais' },
      { id: '3', name: 'Sucre de canne blond', amount: '120', unit: 'g', category: 'Épicerie' },
      { id: '4', name: 'Pâte feuilletée pur beurre', amount: '1', unit: 'rouleau', category: 'Frais' },
      { id: '5', name: 'Crème fraîche crue fermière', amount: '1', unit: 'pot', category: 'Frais' }
    ],
    instructions: [
      'Pelez les pommes, retirez le cœur et coupez-les en gros quartiers.',
      'Dans un moule à tatin (ou poêle allant au four), faites fondre le beurre avec le sucre pour obtenir un caramel ambré.',
      'Disposez les quartiers de pommes bien serrés verticalement dans le caramel chaud.',
      'Faites précuire les pommes sur le feu moyen pendant 15 minutes pour qu’elles s’imbibent du caramel.',
      'Recouvrez avec le disque de pâte feuilletée en rentrant les bords vers l’intérieur.',
      'Enfournez à 180°C pendant 35 minutes jusqu’à ce que la pâte soit bien croustillante.',
      'Démoulez immédiatement sur un plat de service avant que le caramel ne fige.'
    ],
    notes: 'À déguster tiède avec une belle cuillère de crème crue fraîche et une bolée de cidre brut normand.',
    rating: 5,
    createdAt: '2026-10-25T15:00:00.000Z',
    updatedAt: '2026-10-25T15:00:00.000Z'
  },
  {
    id: 'rec-automne-5',
    title: 'Magret de canard du Sud-Ouest rôti au miel de châtaignier et figues violettes',
    season: 'autumn',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Viande', 'Bistrot', 'Gourmand', 'Sucré-salé', 'Rapide'],
    imageUrl: 'https://images.unsplash.com/photo-1514944298352-78d11e5dc422?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Beaux magrets de canard fermier du Sud-Ouest', amount: '2', unit: 'pièces', category: 'Boucherie' },
      { id: '2', name: 'Figues violettes fraîches de Solliès', amount: '8', unit: 'pièces', category: 'Légumes' },
      { id: '3', name: 'Miel de châtaignier corsé', amount: '2', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '4', name: 'Vinaigre balsamique de Modène', amount: '3', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '5', name: 'Fond de volaille déshydraté', amount: '1', unit: 'c. à café', category: 'Épicerie' },
      { id: '6', name: 'Fleur de sel et poivre 5 baies', amount: '1', unit: 'pincée', category: 'Épicerie' }
    ],
    instructions: [
      'Quadrillez la peau des magrets avec la pointe d’un couteau sans entamer la chair.',
      'Posez les magrets côté peau dans une poêle froide, allumez à feu moyen et laissez fondre la graisse 8 à 10 minutes en vidant l’excès.',
      'Retournez les magrets côté chair et faites cuire 4 minutes pour une cuisson rosée. Réservez-les sous une feuille d’aluminium.',
      'Lavez les figues, fendez-les en 4 sans aller jusqu’au bout et faites-les caraméliser 2 minutes dans la même poêle avec le miel.',
      'Déglacez avec le vinaigre balsamique et 5 cl d’eau pour créer un jus sirupeux.',
      'Tranchez les magrets en biseaux, dressez avec les figues tièdes et nappez de sauce brillante.'
    ],
    notes: 'Démarrer la cuisson du magret dans une poêle froide permet à la graisse de fondre progressivement et rend la peau délicieusement croustillante.',
    rating: 5,
    createdAt: '2026-10-02T12:00:00.000Z',
    updatedAt: '2026-10-02T12:00:00.000Z'
  },
  {
    id: 'rec-automne-6',
    title: 'Poêlée forestière de cèpes et girolles persillées avec œuf parfait coulant',
    season: 'autumn',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'Moyen',
    tags: ['Végétarien', 'Bistrot', 'De saison', 'Gourmand'],
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Mélange de champignons des bois (cèpes, girolles, chanterelles)', amount: '600', unit: 'g', category: 'Légumes' },
      { id: '2', name: 'Œufs extra-frais plein air', amount: '4', unit: 'pièces', category: 'Frais' },
      { id: '3', name: 'Gousses d’ail finement hachées', amount: '2', unit: 'gousses', category: 'Légumes' },
      { id: '4', name: 'Persil plat frais haché', amount: '4', unit: 'c. à soupe', category: 'Légumes' },
      { id: '5', name: 'Beurre demi-sel fermier', amount: '35', unit: 'g', category: 'Frais' },
      { id: '6', name: 'Tranches de pain de campagne au levain', amount: '4', unit: 'tranches', category: 'Épicerie' }
    ],
    instructions: [
      'Nettoyez soigneusement les champignons au pinceau humide sans les tremper dans l’eau, coupez les plus gros.',
      'Faites pocher ou cuire les œufs mollets 6 minutes dans l’eau frémissante vinaigrée, puis plongez-les dans l’eau froide pour stopper la cuisson et écalez-les délicatement.',
      'Faites sauter les champignons dans une grande poêle très chaude avec le beurre mousseux pendant 7 à 8 minutes jusqu’à évaporation de leur eau.',
      'Ajoutez l’ail et le persil plat dans la dernière minute de cuisson, salez et poivrez.',
      'Faites dorer les tranches de pain au grille-pain.',
      'Dressez les champignons chauds sur les tartines, déposez un œuf au sommet et fendez-le délicatement pour libérer le jaune crémeux.'
    ],
    notes: 'Ne lavez jamais les cèpes à grande eau sous peine de les transformer en éponges ; un brossage soigné garantit leur texture ferme.',
    rating: 5,
    createdAt: '2026-10-10T19:00:00.000Z',
    updatedAt: '2026-10-10T19:00:00.000Z'
  },
  {
    id: 'rec-automne-7',
    title: 'Gnocchis dorés au potimarron rôti, beurre noisette à la sauge et éclats de noisettes',
    season: 'autumn',
    prepTime: 20,
    cookTime: 20,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Pâtes', 'Végétarien', 'Réconfortant', 'Gourmand'],
    imageUrl: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Gnocchis de pomme de terre frais', amount: '500', unit: 'g', category: 'Frais' },
      { id: '2', name: 'Potimarron coupé en petits dés', amount: '400', unit: 'g', category: 'Légumes' },
      { id: '3', name: 'Beurre doux', amount: '50', unit: 'g', category: 'Frais' },
      { id: '4', name: 'Feuilles de sauge fraîche', amount: '12', unit: 'feuilles', category: 'Légumes' },
      { id: '5', name: 'Noisettes entières concassées', amount: '40', unit: 'g', category: 'Épicerie' },
      { id: '6', name: 'Parmesan en copeaux', amount: '40', unit: 'g', category: 'Frais' }
    ],
    instructions: [
      'Faites rôtir les dés de potimarron 15 minutes au four à 200°C avec un filet d’huile d’olive jusqu’à ce qu’ils soient tendres et caramélisés.',
      'Plongez les gnocchis dans l’eau bouillante salée, égouttez-les dès qu’ils remontent à la surface.',
      'Dans une grande poêle, faites mousser le beurre avec les feuilles de sauge jusqu’à obtenir une couleur ambrée et une odeur de noisette grillée.',
      'Ajoutez les gnocchis et les dés de potimarron dans le beurre de sauge pour les poêler 3 minutes et les rendre croustillants à l’extérieur.',
      'Servez parsemé de noisettes torréfiées concassées et de copeaux de parmesan.'
    ],
    notes: 'Le potimarron n’a pas besoin d’être épluché : sa peau fine s’attendrit totalement à la cuisson et renforce sa saveur de châtaigne.',
    rating: 5,
    createdAt: '2026-10-18T12:00:00.000Z',
    updatedAt: '2026-10-18T12:00:00.000Z'
  },
  {
    id: 'rec-automne-8',
    title: 'Pavé de saumon croustillant sur lit de lentilles vertes du Puy mijotées au lard',
    season: 'autumn',
    prepTime: 15,
    cookTime: 35,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Poisson', 'Familial', 'Tradition', 'Équilibré'],
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Pavés de saumon frais avec la peau', amount: '4', unit: 'pièces', category: 'Poissonnerie' },
      { id: '2', name: 'Lentilles vertes du Puy AOP', amount: '250', unit: 'g', category: 'Épicerie' },
      { id: '3', name: 'Lardons fumés fermiers ou poitrine fumée', amount: '120', unit: 'g', category: 'Boucherie' },
      { id: '4', name: 'Carotte et échalote coupées en petits dés', amount: '2', unit: 'pièces', category: 'Légumes' },
      { id: '5', name: 'Bouquet garni (thym, laurier)', amount: '1', unit: 'pièce', category: 'Épicerie' },
      { id: '6', name: 'Vinaigre de xérès', amount: '1', unit: 'c. à soupe', category: 'Épicerie' }
    ],
    instructions: [
      'Faites suer les lardons, les dés de carotte et l’échalote 4 minutes dans une casserole.',
      'Ajoutez les lentilles rincées et le bouquet garni, couvrez de trois fois leur volume d’eau froide sans saler (le sel durcit la peau des lentilles).',
      'Laissez mijoter à feu doux pendant 25 minutes, salez seulement en fin de cuisson et ajoutez un trait de vinaigre de xérès.',
      'Dans une poêle bien chaude, faites dorer les pavés de saumon côté peau pendant 6 minutes pour une peau ultra croustillante, retournez 2 minutes côté chair.',
      'Déposez les lentilles crémeuses au fond des assiettes creuses et surmontez du pavé de saumon chaud.'
    ],
    notes: 'Le vinaigre de xérès ajouté aux lentilles chaudes apporte une vivacité qui rééquilibre parfaitement le gras du saumon.',
    rating: 4,
    createdAt: '2026-10-24T19:30:00.000Z',
    updatedAt: '2026-10-24T19:30:00.000Z'
  },
  {
    id: 'rec-automne-9',
    title: 'Crumble croustillant aux poires Conférence, mûres sauvages et éclats de chocolat noir',
    season: 'autumn',
    prepTime: 15,
    cookTime: 30,
    servings: 6,
    difficulty: 'Facile',
    tags: ['Dessert', 'Gourmand', 'Automnal', 'Fruits'],
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Poires Conférence fermes et parfumées', amount: '4', unit: 'pièces', category: 'Légumes' },
      { id: '2', name: 'Mûres sauvages fraîches ou myrtilles', amount: '150', unit: 'g', category: 'Légumes' },
      { id: '3', name: 'Chocolat noir pâtissier 70% concassé', amount: '70', unit: 'g', category: 'Épicerie' },
      { id: '4', name: 'Farine de blé', amount: '120', unit: 'g', category: 'Épicerie' },
      { id: '5', name: 'Beurre demi-sel froid en morceaux', amount: '100', unit: 'g', category: 'Frais' },
      { id: '6', name: 'Poudre d’amandes', amount: '50', unit: 'g', category: 'Épicerie' },
      { id: '7', name: 'Cassonade ou sucre de canne roux', amount: '80', unit: 'g', category: 'Épicerie' }
    ],
    instructions: [
      'Pelez et évidez les poires, coupez-les en cubes réguliers et disposez-les dans un plat beurré avec les mûres sauvages.',
      'Parsemez les fruits d’éclats de chocolat noir.',
      'Dans un saladier, sablez du bout des doigts la farine, la poudre d’amandes, le sucre roux et le beurre froid pour former de gros grumeaux gourmands.',
      'Répartissez le crumble sur les fruits sans tasser.',
      'Enfournez à 180°C pendant 30 minutes jusqu’à ce que le dessus soit bien doré et que le jus de poire bouillonne sur les bords.',
      'Servez tiède avec une boule de glace à la vanille bourbon.'
    ],
    notes: 'Le petit goût salé du beurre demi-sel dans la pâte à crumble sublime les notes boisées du chocolat et la douceur de la poire.',
    rating: 5,
    createdAt: '2026-10-30T16:00:00.000Z',
    updatedAt: '2026-10-30T16:00:00.000Z'
  },

  // --- HIVER ---
  {
    id: 'rec-hiver-1',
    title: 'Bœuf bourguignon mijoté au vin rouge, carottes et lardons fumés',
    season: 'winter',
    prepTime: 30,
    cookTime: 180,
    servings: 6,
    difficulty: 'Facile',
    tags: ['Mijoté', 'Plat réconfortant', 'Familial', 'Tradition', 'Viande'],
    imageUrl: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Paleron ou macreuse de bœuf', amount: '1.2', unit: 'kg', category: 'Boucherie' },
      { id: '2', name: 'Vin rouge corsé de Bourgogne (Pinot Noir)', amount: '75', unit: 'cl', category: 'Épicerie' },
      { id: '3', name: 'Lardons fumés fermiers', amount: '150', unit: 'g', category: 'Boucherie' },
      { id: '4', name: 'Carottes fondantes', amount: '4', unit: 'pièces', category: 'Légumes' },
      { id: '5', name: 'Champignons de Paris', amount: '250', unit: 'g', category: 'Légumes' },
      { id: '6', name: 'Petits oignons grelots', amount: '12', unit: 'pièces', category: 'Légumes' },
      { id: '7', name: 'Farine', amount: '2', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '8', name: 'Bouquet garni et gousse d’ail', amount: '1', unit: 'pièce', category: 'Épicerie' }
    ],
    instructions: [
      'Faites revenir les lardons dans une grande cocotte en fonte, réservez-les.',
      'Faites colorer les cubes de bœuf sur toutes les faces à feu vif dans la graisse des lardons.',
      'Salez, poivrez, ajoutez la farine et mélangez bien pour enrober la viande.',
      'Versez la bouteille de vin rouge, ajoutez les carottes taillées en biseaux, l’ail écrasé et le bouquet garni.',
      'Portez à frémissement, couvrez hermétiquement et enfournez ou laissez mijoter à feu très doux pendant 3 heures.',
      'Une demi-heure avant la fin, ajoutez les champignons dorés et les oignons grelots confits.'
    ],
    notes: 'Le plat phare de l’hiver. Cuisinez-le la veille : réchauffé le lendemain, la sauce est encore plus sirupeuse et la viande se coupe à la cuillère.',
    rating: 5,
    createdAt: '2026-12-22T10:00:00.000Z',
    updatedAt: '2026-12-22T10:00:00.000Z'
  },
  {
    id: 'rec-hiver-2',
    title: 'Gratin dauphinois fondant à la crème fermière et muscade',
    season: 'winter',
    prepTime: 20,
    cookTime: 65,
    servings: 6,
    difficulty: 'Facile',
    tags: ['Végétarien', 'Accompagnement', 'Réconfortant', 'Familial'],
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Pommes de terre à chair ferme (Mona Lisa ou Charlotte)', amount: '1.2', unit: 'kg', category: 'Légumes' },
      { id: '2', name: 'Crème liquide entière 35%', amount: '40', unit: 'cl', category: 'Frais' },
      { id: '3', name: 'Lait entier', amount: '30', unit: 'cl', category: 'Frais' },
      { id: '4', name: 'Gousse d’ail pour frotter le plat', amount: '2', unit: 'gousses', category: 'Légumes' },
      { id: '5', name: 'Beurre pour le plat', amount: '25', unit: 'g', category: 'Frais' },
      { id: '6', name: 'Noix de muscade fraîchement râpée', amount: '1', unit: 'c. à café', category: 'Épicerie' }
    ],
    instructions: [
      'Frottez généreusement un plat à gratin en grès avec la gousse d’ail coupée en deux, puis beurrez-le.',
      'Épluchez les pommes de terre et taillez-les à la mandoline en fines rondelles de 3 mm. Ne les rincez surtout pas pour conserver leur amidon naturel liant.',
      'Faites tiédir le lait et la crème avec la muscade, le sel et le poivre.',
      'Disposez les rondelles de pommes de terre en couches superposées dans le plat.',
      'Versez le mélange crème-lait chaud par-dessus pour recouvrir les pommes de terre.',
      'Enfournez à 160°C pendant 1h10 jusqu’à ce que le dessus soit gratiné d’un beau doré sans aucun fromage (la vraie tradition dauphinoise !).'
    ],
    notes: 'La cuisson lente à 160°C est la clé pour que les pommes de terre absorbent la crème et deviennent fondantes comme du beurre.',
    rating: 5,
    createdAt: '2026-12-28T16:00:00.000Z',
    updatedAt: '2026-12-28T16:00:00.000Z'
  },
  {
    id: 'rec-hiver-3',
    title: 'Soupe à l’oignon gratinée au gruyère de garde et pain de campagne',
    season: 'winter',
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Soupe', 'Réconfortant', 'Fromage', 'Tradition', 'Gourmand'],
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Oignons jaunes émincés finement', amount: '800', unit: 'g', category: 'Légumes' },
      { id: '2', name: 'Beurre doux', amount: '40', unit: 'g', category: 'Frais' },
      { id: '3', name: 'Farine', amount: '1', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '4', name: 'Bouillon de bœuf ou volaille maison', amount: '1.2', unit: 'L', category: 'Épicerie' },
      { id: '5', name: 'Vin blanc sec', amount: '15', unit: 'cl', category: 'Épicerie' },
      { id: '6', name: 'Tranches épaisses de pain de campagne au levain', amount: '4', unit: 'tranches', category: 'Épicerie' },
      { id: '7', name: 'Gruyère suisse ou Comté râpé', amount: '150', unit: 'g', category: 'Frais' }
    ],
    instructions: [
      'Dans une grande cocotte, faites fondre les oignons au beurre à feu doux pendant 25 minutes jusqu’à ce qu’ils soient profondément caramélisés.',
      'Saupoudrez de farine, remuez 1 minute, puis déglacez avec le vin blanc.',
      'Ajoutez le bouillon chaud, couvrez et laissez frémir 20 minutes.',
      'Faites griller les tranches de pain au four.',
      'Versez la soupe brûlante dans des bols en grès allant au four, posez une tranche de pain grillée et recouvrez généreusement de fromage râpé.',
      'Passez sous le gril du four 5 à 7 minutes pour obtenir une croûte bouillonnante et croustillante.'
    ],
    notes: 'Parfait pour les soirées d’hiver glaciales. Un petit filet de cognac dans le bouillon apporte une profondeur incomparable.',
    rating: 5,
    createdAt: '2027-01-05T12:00:00.000Z',
    updatedAt: '2027-01-05T12:00:00.000Z'
  },
  {
    id: 'rec-hiver-4',
    title: 'Velouté de panais rôti et poires comice au poivre de Sichuan',
    season: 'winter',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Rapide', 'Végétarien', 'Original', 'Léger', 'Sans gluten'],
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Panais fermes pelés et coupés en dés', amount: '600', unit: 'g', category: 'Légumes' },
      { id: '2', name: 'Poires Comice bien mûres', amount: '2', unit: 'pièces', category: 'Légumes' },
      { id: '3', name: 'Bouillon de légumes', amount: '75', unit: 'cl', category: 'Épicerie' },
      { id: '4', name: 'Crème d’avoine ou crème fraîche', amount: '15', unit: 'cl', category: 'Frais' },
      { id: '5', name: 'Huile d’olive', amount: '2', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '6', name: 'Graines de courge torréfiées', amount: '25', unit: 'g', category: 'Épicerie' }
    ],
    instructions: [
      'Pelez les panais et les poires, coupez-les en morceaux.',
      'Faites-les revenir 5 minutes dans l’huile d’olive dans une casserole.',
      'Ajoutez le bouillon de légumes, salez et faites cuire 20 minutes à feu doux jusqu’à ce que le panais soit très tendre.',
      'Mixez longuement au mixeur plongeant avec la crème pour obtenir une émulsion blanche aérienne.',
      'Servez bien chaud parsemé de graines de courge et d’un tour de moulin à poivre.'
    ],
    notes: 'La douceur de la poire contrebalance à merveille les notes boisées du panais.',
    rating: 4,
    createdAt: '2027-01-14T11:00:00.000Z',
    updatedAt: '2027-01-14T11:00:00.000Z'
  },
  {
    id: 'rec-hiver-5',
    title: 'Tartiflette savoyarde authentique au Reblochon fermier AOP et oignons confits',
    season: 'winter',
    prepTime: 20,
    cookTime: 35,
    servings: 6,
    difficulty: 'Facile',
    tags: ['Fromage', 'Montagne', 'Familial', 'Réconfortant'],
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d62817d2?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Reblochon fermier de Savoie AOP au lait cru', amount: '1', unit: 'pièce', category: 'Frais' },
      { id: '2', name: 'Pommes de terre à chair ferme (Charlotte ou Amandine)', amount: '1.2', unit: 'kg', category: 'Légumes' },
      { id: '3', name: 'Lardons fumés fermiers au bois de hêtre', amount: '200', unit: 'g', category: 'Boucherie' },
      { id: '4', name: 'Oignons jaunes émincés', amount: '2', unit: 'pièces', category: 'Légumes' },
      { id: '5', name: 'Vin blanc sec de Savoie (Apremont ou Roussette)', amount: '10', unit: 'cl', category: 'Épicerie' },
      { id: '6', name: 'Crème fraîche épaisse de ferme', amount: '2', unit: 'c. à soupe', category: 'Frais' }
    ],
    instructions: [
      'Faites cuire les pommes de terre en robe des champs dans de l’eau salée 20 minutes, épluchez-les encore chaudes et coupez-les en rondelles épaisses.',
      'Dans une poêle, faites suer les oignons et les lardons jusqu’à caramélisation, puis déglacez avec le vin blanc de Savoie.',
      'Dans un grand plat à gratin frotté à l’ail, disposez une couche de pommes de terre, le mélange oignons-lardons, la crème, puis le reste de pommes de terre.',
      'Coupez le Reblochon en deux dans l’épaisseur et déposez les deux moitiés croûte vers le haut sur les pommes de terre.',
      'Enfournez à 200°C pendant 25 minutes : le fromage doit fondre généreusement et dorer jusqu’à former de délicieuses cloques croustillantes.'
    ],
    notes: 'Poser la croûte du reblochon vers le haut permet à la pâte coulante de traverser toutes les couches de pommes de terre en créant une croûte croustillante irrésistible.',
    rating: 5,
    createdAt: '2027-01-20T19:30:00.000Z',
    updatedAt: '2027-01-20T19:30:00.000Z'
  },
  {
    id: 'rec-hiver-6',
    title: 'Blanquette de veau à l’ancienne, petits oignons grelots et champignons de Paris',
    season: 'winter',
    prepTime: 25,
    cookTime: 80,
    servings: 6,
    difficulty: 'Moyen',
    tags: ['Mijoté', 'Tradition', 'Familial', 'Viande'],
    imageUrl: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Épaule ou tendron de veau coupé en gros morceaux', amount: '1.2', unit: 'kg', category: 'Boucherie' },
      { id: '2', name: 'Carottes coupées en rondelles', amount: '3', unit: 'pièces', category: 'Légumes' },
      { id: '3', name: 'Champignons de Paris frais', amount: '250', unit: 'g', category: 'Légumes' },
      { id: '4', name: 'Petits oignons grelots confits', amount: '12', unit: 'pièces', category: 'Légumes' },
      { id: '5', name: 'Crème fraîche épaisse entière', amount: '20', unit: 'cl', category: 'Frais' },
      { id: '6', name: 'Jaunes d’œufs frais', amount: '2', unit: 'pièces', category: 'Frais' },
      { id: '7', name: 'Farine et beurre pour le roux', amount: '30', unit: 'g', category: 'Frais' },
      { id: '8', name: 'Jus d’un demi-citron jaune', amount: '1', unit: 'pièce', category: 'Légumes' }
    ],
    instructions: [
      'Plongez les morceaux de veau dans une grande marmite d’eau froide, portez à ébullition et écumez soigneusement les impuretés.',
      'Ajoutez les carottes, un bouquet garni, un oignon piqué d’un clou de girofle, du sel et du poivre. Laissez frémir 1h15 à feu très doux.',
      'Dans une casserole, faites cuire les champignons avec une noisette de beurre et un filet de citron.',
      'Préparez un roux blanc avec le beurre et la farine, puis mouillez avec 60 cl de bouillon de cuisson chaud en fouettant.',
      'Hors du feu, liez la sauce avec le mélange crème, jaunes d’œufs et jus de citron.',
      'Versez la sauce veloutée sur le veau égoutté, les carottes, les champignons et les oignons grelots, et servez avec un riz blanc parfumé.'
    ],
    notes: 'Ne jamais faire bouillir la sauce une fois les jaunes d’œufs et la crème incorporés, sous peine de voir la sauce trancher.',
    rating: 5,
    createdAt: '2027-01-25T12:00:00.000Z',
    updatedAt: '2027-01-25T12:00:00.000Z'
  },
  {
    id: 'rec-hiver-7',
    title: 'Curry doux de patates douces, pois chiches fondants et lait de coco crémeux',
    season: 'winter',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'Facile',
    tags: ['Végétarien', 'Exotique', 'Rapide', 'Réconfortant', 'Sans gluten'],
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Patates douces pelées et coupées en cubes', amount: '600', unit: 'g', category: 'Légumes' },
      { id: '2', name: 'Pois chiches cuits égouttés', amount: '250', unit: 'g', category: 'Épicerie' },
      { id: '3', name: 'Lait de coco entier', amount: '40', unit: 'cl', category: 'Épicerie' },
      { id: '4', name: 'Pousse d’épinards frais', amount: '100', unit: 'g', category: 'Légumes' },
      { id: '5', name: 'Pâte de curry doux ou poudre de curry madras', amount: '2', unit: 'c. à soupe', category: 'Épicerie' },
      { id: '6', name: 'Gousse d’ail et gingembre frais râpé', amount: '1', unit: 'c. à soupe', category: 'Légumes' },
      { id: '7', name: 'Coriandre fraîche et quartiers de citron vert', amount: '1', unit: 'botte', category: 'Légumes' }
    ],
    instructions: [
      'Dans une sauteuse, faites revenir l’ail, le gingembre râpé et le curry dans une cuillère d’huile de coco ou d’olive pendant 1 minute.',
      'Ajoutez les cubes de patate douce et les pois chiches, remuez pour bien les imprégner d’épices.',
      'Versez le lait de coco et 10 cl d’eau, salez, couvrez et laissez mijoter 20 minutes jusqu’à ce que la patate douce soit ultra fondante.',
      'Ajoutez les pousses d’épinards dans la dernière minute pour qu’elles tombent dans la sauce chaude.',
      'Servez bien chaud parsemé de coriandre fraîche et d’un filet de jus de citron vert avec du riz basmati.'
    ],
    notes: 'Un plat réconfortant et coloré qui réchauffe les corps lors des journées d’hiver grises.',
    rating: 4,
    createdAt: '2027-02-02T19:00:00.000Z',
    updatedAt: '2027-02-02T19:00:00.000Z'
  },
  {
    id: 'rec-hiver-8',
    title: 'Noix de Saint-Jacques dorées au beurre demi-sel et tombée d’endives caramélisées',
    season: 'winter',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'Moyen',
    tags: ['Poissonnerie', 'Fêtes', 'Rapide', 'Gastronomique', 'Bistrot'],
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Belles noix de Saint-Jacques fraîches sans corail', amount: '16', unit: 'pièces', category: 'Poissonnerie' },
      { id: '2', name: 'Endives fraîches du Nord', amount: '4', unit: 'pièces', category: 'Légumes' },
      { id: '3', name: 'Beurre demi-sel fermier', amount: '45', unit: 'g', category: 'Frais' },
      { id: '4', name: 'Sucre de canne ou miel', amount: '1', unit: 'c. à café', category: 'Épicerie' },
      { id: '5', name: 'Jus d’une clémentine ou d’une orange douce', amount: '1', unit: 'pièce', category: 'Légumes' },
      { id: '6', name: 'Fleur de sel et poivre blanc de Penja', amount: '1', unit: 'pincée', category: 'Épicerie' }
    ],
    instructions: [
      'Émincez les endives en fines lanières après avoir ôté le petit cône amer à la base.',
      'Faites-les fondre dans une sauteuse avec 20 g de beurre demi-sel, le sucre et le jus de clémentine pendant 12 minutes jusqu’à ce qu’elles soient douces et caramélisées.',
      'Épongez parfaitement les noix de Saint-Jacques avec du papier absorbant.',
      'Faites chauffer le reste de beurre dans une poêle très chaude jusqu’à ce qu’il devienne noisette.',
      'Saisissez les Saint-Jacques 1 minute 30 par face pour une belle coloration dorée sans surcuire le cœur qui doit rester tiède et nacré.',
      'Dressez un nid d’endives confites dans chaque assiette et déposez 4 Saint-Jacques croustillantes parsemées d’un grain de fleur de sel.'
    ],
    notes: 'Le jus d’agrume contrebalance totalement la légère amertume naturelle de l’endive et relève la douceur iodée de la Saint-Jacques.',
    rating: 5,
    createdAt: '2027-02-10T20:00:00.000Z',
    updatedAt: '2027-02-10T20:00:00.000Z'
  },
  {
    id: 'rec-hiver-9',
    title: 'Pain d’épices traditionnel moelleux d’Alsace au miel de forêt et écorces d’orange',
    season: 'winter',
    prepTime: 15,
    cookTime: 45,
    servings: 8,
    difficulty: 'Facile',
    tags: ['Dessert', 'Goûter', 'Tradition', 'Épices', 'Hivernal'],
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      { id: '1', name: 'Miel de forêt ou toutes fleurs de caractère', amount: '250', unit: 'g', category: 'Épicerie' },
      { id: '2', name: 'Farine de seigle ou de blé T65', amount: '250', unit: 'g', category: 'Épicerie' },
      { id: '3', name: 'Lait entier tiède', amount: '10', unit: 'cl', category: 'Frais' },
      { id: '4', name: 'Mélange 4 épices (cannelle, gingembre, girofle, muscade)', amount: '2', unit: 'c. à café', category: 'Épicerie' },
      { id: '5', name: 'Bicarbonate de soude alimentaire', amount: '1', unit: 'c. à café', category: 'Épicerie' },
      { id: '6', name: 'Écorces d’oranges confites coupées en petits dés', amount: '50', unit: 'g', category: 'Épicerie' },
      { id: '7', name: 'Beurre pour le moule à cake', amount: '15', unit: 'g', category: 'Frais' }
    ],
    instructions: [
      'Faites tiédir le miel dans une casserole avec le lait pour le liquéfier.',
      'Dans un saladier, mélangez la farine, les épices, le bicarbonate et les dés d’oranges confites.',
      'Versez le mélange miel-lait tiède en remuant à la cuillère en bois pour obtenir une pâte homogène et parfumée sans matière grasse ajoutée.',
      'Versez la pâte dans un moule à cake beurré.',
      'Enfournez à 160°C pendant 45 minutes : la pointe d’un couteau doit ressortir sèche.',
      'Laissez refroidir complètement et emballez dans un film alimentaire avant de déguster.'
    ],
    notes: 'Le pain d’épices est encore meilleur après 24 à 48 heures de repos : ses épices s’harmonisent et son cœur devient ultra fondant.',
    rating: 5,
    createdAt: '2027-02-14T15:30:00.000Z',
    updatedAt: '2027-02-14T15:30:00.000Z'
  }
];

export const INITIAL_MEAL_PLANS = [
  {
    id: 'week-1',
    weekIndex: 1,
    title: 'Semaine prochaine (+1)',
    days: {
      monday: { lunchRecipeId: 'rec-automne-1', dinnerRecipeId: 'rec-automne-2' },
      tuesday: { lunchRecipeId: 'rec-automne-2', dinnerRecipeId: 'rec-hiver-2' },
      wednesday: { lunchRecipeId: 'rec-automne-1', dinnerRecipeId: 'rec-ete-1' },
      thursday: { lunchRecipeId: 'rec-ete-4', dinnerRecipeId: 'rec-automne-3' },
      friday: { lunchRecipeId: 'rec-printemps-3', dinnerRecipeId: 'rec-automne-4' },
      saturday: { lunchRecipeId: 'rec-ete-3', dinnerRecipeId: 'rec-hiver-1' },
      sunday: { lunchRecipeId: 'rec-automne-3', dinnerRecipeId: 'rec-hiver-3' }
    },
    notes: 'Semaine prochaine (+1) : Menus planifiés à l’avance.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'week-2',
    weekIndex: 2,
    title: 'Semaine suivante (+2)',
    days: {
      monday: { lunchRecipeId: 'rec-ete-2', dinnerRecipeId: 'rec-hiver-4' },
      tuesday: { lunchRecipeId: 'rec-printemps-1', dinnerRecipeId: 'rec-ete-4' },
      wednesday: { lunchRecipeId: 'rec-ete-3', dinnerRecipeId: 'rec-printemps-2' },
      thursday: { lunchRecipeId: 'rec-hiver-3', dinnerRecipeId: 'rec-printemps-3' },
      friday: { lunchRecipeId: 'rec-hiver-2', dinnerRecipeId: 'rec-ete-1' },
      saturday: { lunchRecipeId: 'rec-printemps-1', dinnerRecipeId: 'rec-printemps-4' },
      sunday: { lunchRecipeId: 'rec-hiver-1', dinnerRecipeId: 'rec-automne-4' }
    },
    notes: 'Semaine suivante (+2) : Deuxième semaine anticipée.',
    updatedAt: new Date().toISOString()
  }
];
