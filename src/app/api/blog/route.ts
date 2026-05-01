import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Default blog posts to seed
const DEFAULT_POSTS = [
  {
    title: 'Comment Choisir son Fond de Teint : Guide Complet',
    slug: 'comment-choisir-fond-de-teint',
    excerpt: 'Découvrez tous nos secrets pour trouver la teinte parfaite de fond de teint qui sublimera votre carnation. Des conseils pro pour un teint zéro défaut.',
    content: `# Comment Choisir son Fond de Teint

Trouver le fond de teint parfait peut sembler difficile, mais avec les bons conseils, c'est un jeu d'enfant !

## 1. Identifiez votre sous-ton de peau
- **Sous-ton chaud** : teintes dorées, miel
- **Sous-ton froid** : teintes rosées, porcelaine  
- **Sous-ton neutre** : teintes beige, nude

## 2. Testez sur votre mâchoire
Appliquez le fond de teint sur la ligne de votre mâchoire pour voir comment il fusionne avec votre cou.

## 3. Notre conseil ChicGlam
Notre Fond de Teint ALL COVER est disponible en 9 teintes pour toutes les carnations. Sa formule antioxydante et hydratante unifie le teint pour un résultat professionnel.

**Résultat :** Un teint parfait, naturel et longue tenue toute la journée !`,
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
    content: `# Les Tendances Maquillage de la Saison

## Le Glow Naturel
Le teint "glass skin" continue de dominer. Utilisez notre poudre illuminatrice pour un effet glow subtil et lumineux.

## Les Yeux Graphiques
L'eye-liner graphique est partout ! Notre Eye-liner 2 en 1 vous permet de créer des lignes précises tout en fixant vos faux cils.

## Les Lèvres Nuances
Du nude au berry, les lèvres sont l'accent de la saison. Essayez notre Lipstick Chic KISS dans les teintes Rose Gold ou Nude.

## Le Mascara Volume
Des cils ultra volumineux avec notre Mascara SMUDGE Noir. Tenue 24h garantie !`,
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
    content: `# Routine Maquillage Longue Tenue

Suivez ces étapes pour un maquillage qui tient de matin au soir :

## Étape 1 : La Base
Appliquez notre Base Fixatrice Hydratante pour préparer la peau et resserrez les pores.

## Étape 2 : Le Fond de Teint
Le Fond de Teint ALL COVER offre une couvrance parfaite avec une formule waterproof.

## Étape 3 : La Poudre
Fixez le tout avec notre Poudre Compacte HD pour un effet mat longue tenue.

## Étape 4 : Les Yeux
Palette MISS GLAM pour des yeux intenses et waterproof.

## Étape 5 : La Fixation
Terminez avec notre Spray Fixateur FINISH HD à la glycérine, sans alcool, pour nourrir la peau et fixer le maquillage.`,
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
    content: `# Mettez en Valeur vos Lèvres

Le rouge à lèvres est l'accessoire beauté indispensable de chaque femme.

## Trouvez votre teinte
- **Peaux claires** : Rose Gold, Sweety Pink
- **Peaux médiums** : Nude, Cherry
- **Peaux foncées** : Red Clara, Chocolate

## Application parfaite
1. Exfoliez vos lèvres doucement
2. Appliquez un peu de baume
3. Dessinez le contour avec notre Crayon 3 en 1
4. Remplissez avec le Lipstick Chic KISS

## Notre astuce
Appliquez une couche de Gloss Brillant par-dessus votre rouge à lèvres pour un effet brillant et volumateur instantané.`,
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
    content: `# Secret de Dame : L'Art de la Séduction

Notre collection Secret de Dame célèbre la beauté féminine africaine avec des créations artisanales uniques.

## Le savoir-faire artisanal
Chaque nuisette est confectionnée à la main par nos artisans sénégalais, garantissant une qualité exceptionnelle et un design unique.

## Nos modèles phares
- **Kit Nuisette** : Disponible en Noir, Rose, Art et Voilet
- **Pagnes Courts** : 7 déclinaisons colorées pour toutes les envies
- **Pagnes Longs** : Élégance traditionnelle et sensualité

## L'apanage des Sénégalaises
Les pagnes traditionnels sont les éléments clés de l'arsenal de séduction féminine africaine. Portés avec fierté, ils subliment chaque silhouette.`,
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
    content: `# Cils Magnétiques : La Révolution du Regard

Oubliez les faux cils classiques et leurs colles irritantes. Nos cils magnétiques changent tout !

## Pourquoi les cils magnétiques ?
- ✅ **Ultra légers** : vous les oubliez sur vos yeux
- ✅ **Sans colle** : système magnétique innovant
- ✅ **Réutilisables** : économiques et durables
- ✅ **Hypoallergéniques** : adaptés aux yeux sensibles
- ✅ **Waterproof** : résistent à l'eau

## Nos 4 volumes
1. **Brichette** : effet naturel subtil
2. **Chic** : volume élégant au quotidien
3. **Glamour** : regard intense et séduisant
4. **Maeva** : effet max volume dramatique

## Comment les appliquer
1. Appliquez l'eye-liner magnétique sur la ligne des cils
2. Placez la bande de cils sur l'eye-liner
3. Les aimants font tout le travail !

Le résultat ? Un regard de biche en quelques secondes !`,
    category: 'Nouveautés',
    author: 'Chic Glam',
    coverImage: '/images/products/accessoires/cils-magnetiques.png',
    isPublished: true,
    readTime: '3 min',
  },
];

// Auto-seed blog posts if none exist
async function seedDefaultPosts() {
  try {
    const count = await db.blogPost.count();
    if (count > 0) return;

    console.log('[Blog] No posts found, seeding default articles...');

    for (const post of DEFAULT_POSTS) {
      try {
        await db.blogPost.create({ data: post });
      } catch (err) {
        // Skip if slug already exists
        if (err && typeof err === 'object' && 'code' in err && (err as any).code === 'P2002') continue;
        throw err;
      }
    }

    console.log(`[Blog] Seeded ${DEFAULT_POSTS.length} default articles`);
  } catch (error) {
    console.error('[Blog] Seed error:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Auto-seed if no posts exist
    await seedDefaultPosts();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');

    const where: Record<string, unknown> = {};
    if (published === 'true') where.isPublished = true;
    if (category) where.category = category;

    const posts = await db.blogPost.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, category, author, coverImage, isPublished, readTime } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: 'Title and slug are required' }, { status: 400 });
    }

    const existing = await db.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 });
    }

    const post = await db.blogPost.create({
      data: { title, slug, excerpt: excerpt || '', content: content || '', category: category || 'Conseils Beauté', author: author || 'Chic Glam', coverImage: coverImage || '', isPublished: isPublished ?? false, readTime: readTime || '5 min' },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Blog POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create post' }, { status: 500 });
  }
}
