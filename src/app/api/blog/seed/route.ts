import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const DEFAULT_POSTS = [
  {
    title: 'Comment Choisir son Fond de Teint : Guide Complet',
    slug: 'comment-choisir-fond-de-teint',
    excerpt: 'Découvrez tous nos secrets pour trouver la teinte parfaite de fond de teint qui sublimera votre carnation. Des conseils pro pour un teint zéro défaut.',
    content: `# Comment Choisir son Fond de Teint\n\nTrouver le fond de teint parfait peut sembler difficile, mais avec les bons conseils, c'est un jeu d'enfant !\n\n## 1. Identifiez votre sous-ton de peau\n- **Sous-ton chaud** : teintes dorées, miel\n- **Sous-ton froid** : teintes rosées, porcelaine\n- **Sous-ton neutre** : teintes beige, nude\n\n## 2. Testez sur votre mâchoire\nAppliquez le fond de teint sur la ligne de votre mâchoire pour voir comment il fusionne avec votre cou.\n\n## 3. Notre conseil ChicGlam\nNotre Fond de Teint ALL COVER est disponible en 9 teintes pour toutes les carnations. Sa formule antioxydante et hydratante unifie le teint pour un résultat professionnel.\n\n**Résultat :** Un teint parfait, naturel et longue tenue toute la journée !`,
    category: 'Conseils Beauté',
    author: 'Chic Glam',
    coverImage: '/images/products/makeup/fond-de-teint-allcover.png',
    isPublished: true,
    readTime: '5 min',
  },
  {
    title: 'Les Tendances Maquillage de cette Saison',
    slug: 'tendances-maquillage-saison',
    excerpt: 'Les couleurs et techniques maquillage qui font fureur cette saison. Du glow naturel aux yeux dramatiques, adoptez les bons looks.',
    content: `# Les Tendances Maquillage de la Saison\n\n## Le Glow Naturel\nLe teint "glass skin" continue de dominer. Utilisez notre poudre illuminatrice pour un effet glow subtil et lumineux.\n\n## Les Yeux Graphiques\nL'eye-liner graphique est partout ! Notre Eye-liner 2 en 1 vous permet de créer des lignes précises tout en fixant vos faux cils.\n\n## Les Lèvres Nuances\nDu nude au berry, les lèvres sont l'accent de la saison. Essayez notre Lipstick Chic KISS dans les teintes Rose Gold ou Nude.\n\n## Le Mascara Volume\nDes cils ultra volumineux avec notre Mascara SMUDGE Noir. Tenue 24h garantie !`,
    category: 'Tendances',
    author: 'Chic Glam',
    coverImage: '/images/products/makeup/palette-miss-glam.png',
    isPublished: true,
    readTime: '4 min',
  },
  {
    title: 'Routine Maquillage Longue Tenue : Nos Secrets',
    slug: 'routine-maquillage-longue-tenue',
    excerpt: 'Obtenez un maquillage qui tient toute la journée sans retouche. Notre routine étape par étape pour une tenue impeccable.',
    content: `# Routine Maquillage Longue Tenue\n\nSuivez ces étapes pour un maquillage qui tient de matin au soir :\n\n## Étape 1 : La Base\nAppliquez notre Base Fixatrice Hydratante pour préparer la peau et resserrez les pores.\n\n## Étape 2 : Le Fond de Teint\nLe Fond de Teint ALL COVER offre une couvrance parfaite avec une formule waterproof.\n\n## Étape 3 : La Poudre\nFixez le tout avec notre Poudre Compacte HD pour un effet mat longue tenue.\n\n## Étape 4 : Les Yeux\nPalette MISS GLAM pour des yeux intenses et waterproof.\n\n## Étape 5 : La Fixation\nTerminez avec notre Spray Fixateur FINISH HD à la glycérine, sans alcool, pour nourrir la peau et fixer le maquillage.`,
    category: 'Conseils Beauté',
    author: 'Chic Glam',
    coverImage: '/images/products/makeup/flawless-finish-skin.jpeg',
    isPublished: true,
    readTime: '6 min',
  },
  {
    title: 'Mettez en Valeur vos Lèvres avec nos Rouges à Lèvres',
    slug: 'rouge-a-levres-conseils',
    excerpt: 'Apprenez à choisir et appliquer le rouge à lèvres qui correspond à votre style et votre carnation pour un résultat sublimant.',
    content: `# Mettez en Valeur vos Lèvres\n\nLe rouge à lèvres est l'accessoire beauté indispensable de chaque femme.\n\n## Trouvez votre teinte\n- **Peaux claires** : Rose Gold, Sweety Pink\n- **Peaux médiums** : Nude, Cherry\n- **Peaux foncées** : Red Clara, Chocolate\n\n## Application parfaite\n1. Exfoliez vos lèvres doucement\n2. Appliquez un peu de baume\n3. Dessinez le contour avec notre Crayon 3 en 1\n4. Remplissez avec le Lipstick Chic KISS\n\n## Notre astuce\nAppliquez une couche de Gloss Brillant par-dessus votre rouge à lèvres pour un effet brillant et volumateur instantané.`,
    category: 'Tutoriels',
    author: 'Chic Glam',
    coverImage: '/images/products/makeup/lipstick-chic-kiss.png',
    isPublished: true,
    readTime: '3 min',
  },
  {
    title: 'Secret de Dame : La Lingerie qui Sublime',
    slug: 'secret-de-dame-lingerie',
    excerpt: 'Découvrez notre collection Secret de Dame, une lingerie africaine artisanale qui allie tradition et modernité pour votre plus grande séduction.',
    content: `# Secret de Dame : L'Art de la Séduction\n\nNotre collection Secret de Dame célèbre la beauté féminine africaine avec des créations artisanales uniques.\n\n## Le savoir-faire artisanal\nChaque nuisette est confectionnée à la main par nos artisans sénégalais, garantissant une qualité exceptionnelle et un design unique.\n\n## Nos modèles phares\n- **Kit Nuisette** : Disponible en Noir, Rose, Art et Voilet\n- **Pagnes Courts** : 7 déclinaisons colorées pour toutes les envies\n- **Pagnes Longs** : Élégance traditionnelle et sensualité\n\n## L'apanage des Sénégalaises\nLes pagnes traditionnels sont les éléments clés de l'arsenal de séduction féminine africaine. Portés avec fierté, ils subliment chaque silhouette.`,
    category: 'Collection',
    author: 'Chic Glam',
    coverImage: '/images/products/lingerie/kit-nuisette.png',
    isPublished: true,
    readTime: '4 min',
  },
  {
    title: 'Zoom sur nos Cils Magnétiques : Sans Colle, Sans Effort',
    slug: 'cils-magnetiques-guide',
    excerpt: 'Fini la colle ! Découvrez nos cils magnétiques ultra légers et réutilisables pour un regard glamour en un instant.',
    content: `# Cils Magnétiques : La Révolution du Regard\n\nOubliez les faux cils classiques et leurs colles irritantes. Nos cils magnétiques changent tout !\n\n## Pourquoi les cils magnétiques ?\n- **Ultra légers** : vous les oubliez sur vos yeux\n- **Sans colle** : système magnétique innovant\n- **Réutilisables** : économiques et durables\n- **Hypoallergéniques** : adaptés aux yeux sensibles\n- **Waterproof** : résistent à l'eau\n\n## Nos 4 volumes\n1. **Brichette** : effet naturel subtil\n2. **Chic** : volume élégant au quotidien\n3. **Glamour** : regard intense et séduisant\n4. **Maeva** : effet max volume dramatique\n\n## Comment les appliquer\n1. Appliquez l'eye-liner magnétique sur la ligne des cils\n2. Placez la bande de cils sur l'eye-liner\n3. Les aimants font tout le travail !\n\nLe résultat ? Un regard de biche en quelques secondes !`,
    category: 'Nouveautés',
    author: 'Chic Glam',
    coverImage: '/images/products/accessoires/cils-magnetiques.png',
    isPublished: true,
    readTime: '3 min',
  },
];

export async function POST() {
  try {
    // Check if there are already published blog posts
    const publishedCount = await db.blogPost.count({ where: { isPublished: true } });

    if (publishedCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Published blog posts already exist (${publishedCount} found). Skipping seed.`,
        count: publishedCount,
      });
    }

    // Auto-publish any existing unpublished posts first
    const unpublishedCount = await db.blogPost.count({ where: { isPublished: false } });

    if (unpublishedCount > 0) {
      await db.blogPost.updateMany({
        where: { isPublished: false },
        data: { isPublished: true },
      });
      return NextResponse.json({
        success: true,
        message: `Auto-published ${unpublishedCount} existing draft posts.`,
        count: unpublishedCount,
      });
    }

    // No posts at all — create default ones
    let created = 0;
    for (const post of DEFAULT_POSTS) {
      try {
        await db.blogPost.create({ data: post });
        created++;
      } catch {
        // Skip if slug already exists
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${created} blog posts successfully.`,
      count: created,
    });
  } catch (error) {
    console.error('Blog seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed blog posts' },
      { status: 500 }
    );
  }
}
