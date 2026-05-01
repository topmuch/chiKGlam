'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  User,
  ChevronRight,
  BookOpen,
  Sparkles,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/store/use-store';

// ─── Golden Design Tokens ─────────────────────────────────
const C = {
  primary: '#bc8752',
  primaryHover: '#a07040',
  tertiaryBg: '#FAF7F2',
  quaternaryBg: '#F5EDE3',
  sectionBg: '#F9F6F2',
  border: '#E8E2DA',
  textLight: '#555555',
  textMuted: '#999999',
  white: '#FFFFFF',
  textDark: '#1a1a1a',
};

// ─── Blog Post Data ──────────────────────────────────────
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Comment obtenir un teint parfait en 5 étapes',
    excerpt:
      'Découvrez notre routine quotidienne pour un teint lumineux et sans défaut. Du nettoyage à la finition, chaque étape compte pour un résultat professionnel.',
    category: 'Conseils Beauté',
    author: 'Marie Laurent',
    date: '15 Janvier 2025',
    readTime: '5 min',
    image: '/images/products/makeup/fond-de-teint-allcover.png',
  },
  {
    id: '2',
    title: 'Les tendances maquillage de cette saison',
    excerpt:
      'Le nude lumineux, les yeux ambrés et les lèvres givrées dominent cette saison. Voici comment adapter ces tendances à votre style personnel.',
    category: 'Tendances',
    author: 'Sophie Martin',
    date: '8 Janvier 2025',
    readTime: '4 min',
    image: '/images/products/makeup/poudre-compacte.png',
  },
  {
    id: '3',
    title: 'Guide complet des pinceaux de maquillage',
    excerpt:
      'Quel pinceau utiliser pour chaque étape de votre maquillage ? Notre guide détaillé vous aide à constituer la trousse idéale.',
    category: 'Tutoriels',
    author: 'Camille Dubois',
    date: '2 Janvier 2025',
    readTime: '7 min',
    image: '/images/products/makeup/highlighter.png',
  },
  {
    id: '4',
    title: 'Soirée glamour : notre routine beauté',
    excerpt:
      'Préparez votre peau et sublimez votre maquillage pour une soirée inoubliable. Des produits indispensables aux techniques de pro.',
    category: 'Inspiration',
    author: 'Léa Petit',
    date: '20 Décembre 2024',
    readTime: '6 min',
    image: '/images/products/makeup/poudre-libre-translucide.png',
  },
  {
    id: '5',
    title: 'Prendre soin de sa peau en hiver',
    excerpt:
      "Le froid, le vent et le chauffage assèchent votre peau. Adoptez nos conseils pour maintenir une hydratation optimale tout au long de l'hiver.",
    category: 'Conseils Beauté',
    author: 'Marie Laurent',
    date: '15 Décembre 2024',
    readTime: '5 min',
    image: '/images/products/makeup/flawless-finish-skin.jpeg',
  },
  {
    id: '6',
    title: 'Les must-have de votre trousse à maquillage',
    excerpt:
      'Les 10 produits essentiels que chaque femme devrait posséder. Des bases indispensables aux touches de couleur qui font la différence.',
    category: 'Tutoriels',
    author: 'Sophie Martin',
    date: '8 Décembre 2024',
    readTime: '4 min',
    image: '/images/products/makeup/flawless-finish-concealer.jpeg',
  },
];

const categories = [
  { name: 'Conseils Beauté', count: 12 },
  { name: 'Tutoriels', count: 8 },
  { name: 'Tendances', count: 6 },
  { name: 'Inspiration', count: 5 },
  { name: 'Soins Peau', count: 9 },
  { name: 'Bien-être', count: 4 },
];

const popularPosts = blogPosts.slice(0, 3);

const categoryIcons: Record<string, React.ElementType> = {
  'Conseils Beauté': Sparkles,
  Tendances: TrendingUp,
  Tutoriels: BookOpen,
  Inspiration: Lightbulb,
};

// ─── Component ───────────────────────────────────────────
export function GoldenBlogPage() {
  const navigateTo = useStore((s) => s.navigateTo);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.white }}>
      {/* ── Page Header ── */}
      <section style={{ backgroundColor: C.sectionBg }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
              style={{ color: C.primary }}
            >
              NOTRE BLOG
            </h1>
            <p
              className="text-base sm:text-lg leading-relaxed max-w-lg mx-auto"
              style={{ color: C.textLight }}
            >
              Découvrez nos derniers articles beauté, conseils et tendances
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Breadcrumb ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-8">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-sm"
          style={{ color: C.textMuted }}
        >
          <button
            onClick={() => navigateTo('home')}
            className="hover:opacity-70 transition-opacity duration-300"
            style={{ color: C.textLight }}
          >
            Accueil
          </button>
          <ChevronRight className="size-3" style={{ color: C.border }} />
          <span className="font-medium" style={{ color: C.textDark }}>
            Blog
          </span>
        </motion.nav>
      </div>

      {/* ── Blog Content ── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14">
          {/* ── Main: Blog Grid ── */}
          <div>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-heading text-lg font-medium mb-2" style={{ color: C.textDark }}>
                  Aucun article trouvé
                </p>
                <p style={{ color: C.textMuted }}>
                  Essayez avec d&apos;autres mots-clés ou catégories.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {filteredPosts.map((post, index) => {
                  return (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.08 + index * 0.08 }}
                      className="group cursor-pointer overflow-hidden"
                      style={{ border: `1px solid ${C.border}`, borderRadius: '2px' }}
                    >
                      {/* Blog Post Image — 16/10 aspect ratio with hover zoom */}
                      <div
                        className="relative overflow-hidden"
                        style={{ aspectRatio: '16/10', backgroundColor: C.tertiaryBg }}
                      >
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Category Tag Overlay */}
                        <div className="absolute top-3 left-3">
                          <span
                            className="inline-flex items-center px-3 py-1 text-[10px] font-medium tracking-widest uppercase rounded-sm"
                            style={{ backgroundColor: C.tertiaryBg, color: C.primary }}
                          >
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        {/* Title (20px bold, hover underline) */}
                        <h3
                          className="font-heading text-[20px] font-bold leading-snug mb-2 group-hover:underline decoration-1 underline-offset-4 transition-all duration-300 line-clamp-2"
                          style={{ color: C.textDark }}
                        >
                          {post.title}
                        </h3>

                        {/* Excerpt (2 lines) */}
                        <p
                          className="text-sm leading-relaxed line-clamp-2 mb-4"
                          style={{ color: C.textLight }}
                        >
                          {post.excerpt}
                        </p>

                        {/* Author + Date */}
                        <div className="flex items-center gap-3 text-xs" style={{ color: C.textMuted }}>
                          <div className="flex items-center gap-1">
                            <User className="size-3" />
                            <span>{post.author}</span>
                          </div>
                          <span
                            className="w-1 h-1 rounded-full inline-block"
                            style={{ backgroundColor: C.border }}
                          />
                          <div className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Sidebar (desktop only) ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-8">
              {/* Search */}
              <div>
                <h4
                  className="font-heading text-sm font-semibold uppercase tracking-widest mb-4"
                  style={{ color: C.primary }}
                >
                  Recherche
                </h4>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 size-4"
                    style={{ color: C.textMuted }}
                  />
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 focus-visible:ring-offset-0 focus-visible:ring-1"
                    style={{
                      borderRadius: '2px',
                      border: `1px solid ${C.border}`,
                      color: C.textDark,
                    }}
                  />
                </div>
              </div>

              <Separator style={{ backgroundColor: C.border }} />

              {/* Categories */}
              <div>
                <h4
                  className="font-heading text-sm font-semibold uppercase tracking-widest mb-4"
                  style={{ color: C.primary }}
                >
                  Catégories
                </h4>
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const Icon = categoryIcons[cat.name];
                    return (
                      <button
                        key={cat.name}
                        onClick={() =>
                          setSelectedCategory(selectedCategory === cat.name ? null : cat.name)
                        }
                        className="w-full flex items-center justify-between py-2 px-3 text-sm transition-colors duration-200 hover:opacity-80"
                        style={{
                          backgroundColor:
                            selectedCategory === cat.name ? C.tertiaryBg : 'transparent',
                          color: selectedCategory === cat.name ? C.primary : C.textLight,
                          borderRadius: '2px',
                        }}
                      >
                        <span className="font-medium flex items-center gap-2">
                          {Icon && <Icon className="size-3.5" />}
                          {cat.name}
                        </span>
                        <span
                          className="text-xs"
                          style={{
                            backgroundColor: C.tertiaryBg,
                            color: C.textMuted,
                            padding: '2px 8px',
                            borderRadius: '2px',
                          }}
                        >
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator style={{ backgroundColor: C.border }} />

              {/* Popular Articles */}
              <div>
                <h4
                  className="font-heading text-sm font-semibold uppercase tracking-widest mb-4"
                  style={{ color: C.primary }}
                >
                  Articles populaires
                </h4>
                <div className="space-y-4">
                  {popularPosts.map((post, index) => {
                    return (
                      <div key={post.id} className="flex gap-3 group cursor-pointer">
                        {/* Thumbnail */}
                        <div
                          className="w-16 h-16 flex-shrink-0 overflow-hidden relative"
                          style={{
                            backgroundColor: C.tertiaryBg,
                            borderRadius: '2px',
                          }}
                        >
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium leading-snug line-clamp-2 group-hover:underline decoration-1 underline-offset-2 transition-all"
                            style={{ color: C.textDark }}
                          >
                            {post.title}
                          </p>
                          <p className="text-xs mt-1" style={{ color: C.textMuted }}>
                            {post.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default GoldenBlogPage;
