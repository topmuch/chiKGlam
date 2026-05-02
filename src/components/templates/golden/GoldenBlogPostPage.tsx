'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import { useStore } from '@/store/use-store';

// ─── Golden Design Tokens ─────────────────────────────────
const PRIMARY = '#bc8752';
const PRIMARY_HOVER = '#a67747';
const TERTIARY = '#FAF7F2';
const BORDER = '#E8E2DA';
const SECTION_BG = '#F9F6F2';
const TEXT_LIGHT = '#555555';
const TEXT_MUTED = '#999999';
const TEXT_DARK = '#1a1a1a';
const WHITE = '#FFFFFF';

// ─── Types ────────────────────────────────────────────────
interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  coverImage: string;
  isPublished: boolean;
  readTime: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Simple Markdown Renderer ─────────────────────────────
function MarkdownContent({ content }: { content: string }) {
  // Split content into blocks by double newlines
  const blocks = content.split(/\n\n+/);

  const renderBlock = (block: string, index: number) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Headings
    if (trimmed.startsWith('### ')) {
      return (
        <h3
          key={index}
          className="text-lg sm:text-xl font-bold mt-8 mb-3 leading-snug"
          style={{ color: PRIMARY }}
        >
          {trimmed.slice(4)}
        </h3>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2
          key={index}
          className="text-xl sm:text-2xl font-bold mt-10 mb-4 leading-snug"
          style={{ color: TEXT_DARK }}
        >
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith('# ')) {
      return (
        <h1
          key={index}
          className="text-2xl sm:text-3xl font-bold mt-10 mb-4 leading-snug"
          style={{ color: TEXT_DARK }}
        >
          {trimmed.slice(2)}
        </h1>
      );
    }

    // Unordered list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n').filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));
      return (
        <ul key={index} className="my-4 ml-6 space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="text-sm sm:text-base leading-relaxed flex gap-2"
              style={{ color: TEXT_LIGHT }}
            >
              <span className="mt-2 flex-shrink-0 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: PRIMARY }} />
              <span>{renderInline(item.trim().slice(2))}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').filter((l) => /^\d+\.\s/.test(l.trim()));
      return (
        <ol key={index} className="my-4 ml-6 space-y-2 list-decimal list-outside">
          {items.map((item, i) => (
            <li
              key={i}
              className="text-sm sm:text-base leading-relaxed pl-1"
              style={{ color: TEXT_LIGHT }}
            >
              {renderInline(item.trim().replace(/^\d+\.\s/, ''))}
            </li>
          ))}
        </ol>
      );
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote
          key={index}
          className="my-6 pl-5 py-4 text-sm sm:text-base italic leading-relaxed"
          style={{ borderLeft: `3px solid ${PRIMARY}`, backgroundColor: TERTIARY, color: TEXT_LIGHT }}
        >
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***') {
      return (
        <hr
          key={index}
          className="my-8"
          style={{ borderColor: BORDER, borderWidth: 0, borderTopWidth: '1px' }}
        />
      );
    }

    // Paragraph
    return (
      <p
        key={index}
        className="text-sm sm:text-base leading-[1.85] my-4"
        style={{ color: TEXT_LIGHT }}
      >
        {renderInline(trimmed)}
      </p>
    );
  };

  const renderInline = (text: string): React.ReactNode => {
    // Split by inline patterns: **bold**, *italic*, `code`
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
    let lastIndex = 0;
    let match;
    let keyIdx = 0;

    while ((match = regex.exec(text)) !== null) {
      // Text before match
      if (match.index > lastIndex) {
        parts.push(<span key={keyIdx++}>{text.slice(lastIndex, match.index)}</span>);
      }

      if (match[2]) {
        // **bold**
        parts.push(
          <strong key={keyIdx++} className="font-semibold" style={{ color: TEXT_DARK }}>
            {match[2]}
          </strong>
        );
      } else if (match[3]) {
        // *italic*
        parts.push(
          <em key={keyIdx++} className="italic" style={{ color: TEXT_DARK }}>
            {match[3]}
          </em>
        );
      } else if (match[4]) {
        // `code`
        parts.push(
          <code
            key={keyIdx++}
            className="text-xs font-mono px-1.5 py-0.5 rounded"
            style={{ backgroundColor: SECTION_BG, color: PRIMARY }}
          >
            {match[4]}
          </code>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={keyIdx++}>{text.slice(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="my-6">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: WHITE }}>
      {/* Cover Image Skeleton */}
      <div className="relative w-full aspect-[16/9] animate-pulse" style={{ backgroundColor: BORDER }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${WHITE} 0%, transparent 50%)` }} />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Category Badge Skeleton */}
        <div className="h-6 w-28 rounded-full mb-6 animate-pulse" style={{ backgroundColor: BORDER }} />

        {/* Title Skeleton */}
        <div className="space-y-3 mb-6">
          <div className="h-8 w-full rounded animate-pulse" style={{ backgroundColor: BORDER }} />
          <div className="h-8 w-3/4 rounded animate-pulse" style={{ backgroundColor: BORDER }} />
        </div>

        {/* Author Info Skeleton */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-4 w-24 rounded animate-pulse" style={{ backgroundColor: BORDER }} />
          <div className="h-4 w-28 rounded animate-pulse" style={{ backgroundColor: BORDER }} />
          <div className="h-4 w-16 rounded animate-pulse" style={{ backgroundColor: BORDER }} />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded animate-pulse"
              style={{ backgroundColor: BORDER, width: `${i === 7 ? '60%' : '100%'}` }}
            />
          ))}
        </div>
        <div className="space-y-3 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded animate-pulse"
              style={{ backgroundColor: BORDER, width: `${i === 5 ? '80%' : '100%'}` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Not Found State ──────────────────────────────────────
function NotFoundState({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4" style={{ backgroundColor: WHITE }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p
          className="text-6xl sm:text-7xl font-bold mb-4"
          style={{ color: BORDER }}
        >
          404
        </p>
        <h2
          className="text-xl sm:text-2xl font-semibold mb-3"
          style={{ color: TEXT_DARK }}
        >
          Article non trouvé
        </h2>
        <p className="text-sm sm:text-base mb-8 max-w-md mx-auto" style={{ color: TEXT_LIGHT }}>
          L&apos;article que vous recherchez n&apos;existe pas ou a été supprimé.
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider px-6 py-3 transition-colors duration-300"
          style={{ backgroundColor: PRIMARY, color: '#000000' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
        >
          <ArrowLeft className="size-4" />
          Retour au blog
        </button>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function GoldenBlogPostPage({ slug: propSlug }: { slug?: string }) {
  const selectedBlogSlug = useStore((s) => s.selectedBlogSlug);
  const navigateTo = useStore((s) => s.navigateTo);

  const slug = propSlug || selectedBlogSlug || '';

  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    let cancelled = false;

    async function fetchPost() {
      try {
        const res = await fetch(`/api/blog?slug=${encodeURIComponent(slug)}&published=true`);
        if (!res.ok) {
          if (res.status === 404) {
            if (!cancelled) setNotFound(true);
          } else {
            throw new Error('Failed to fetch');
          }
          return;
        }
        const data = await res.json();

        if (cancelled) return;

        if (data.success && data.post) {
          setPost(data.post);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('[GoldenBlogPostPage] Fetch error:', err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    setLoading(true);
    setNotFound(false);
    setPost(null);
    fetchPost();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleBack = () => navigateTo('blog');

  // ── Loading ──
  if (loading) return <LoadingSkeleton />;

  // ── Not Found ──
  if (notFound || !post) return <NotFoundState onBack={handleBack} />;

  // ── Format Date ──
  const formattedDate = new Date(post.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const coverSrc = post.coverImage || '/images/placeholder.jpg';

  return (
    <div className="min-h-screen" style={{ backgroundColor: WHITE }}>
      {/* ── Cover Image ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden"
        style={{ backgroundColor: SECTION_BG }}
      >
        <Image
          src={coverSrc}
          alt={post.title}
          fill
          unoptimized
          className="object-cover"
          priority
        />
        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${WHITE} 0%, ${WHITE}88 15%, ${WHITE}44 40%, ${WHITE}00 70%)`,
          }}
        />

        {/* Back button — top left */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-sm transition-all duration-300 backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              color: TEXT_DARK,
              border: `1px solid ${BORDER}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.color = PRIMARY;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
              e.currentTarget.style.color = TEXT_DARK;
            }}
          >
            <ArrowLeft className="size-3.5" />
            Retour
          </button>
        </div>

        {/* Category Badge — bottom left on image */}
        <div className="absolute bottom-16 left-4 sm:bottom-20 sm:left-6 z-10">
          <span
            className="inline-flex items-center px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] rounded-full"
            style={{
              backgroundColor: 'rgba(188, 135, 82, 0.92)',
              color: '#ffffff',
              backdropFilter: 'blur(4px)',
            }}
          >
            {post.category}
          </span>
        </div>
      </motion.div>

      {/* ── Article Content ── */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 pb-16">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight tracking-tight mb-5"
          style={{ color: PRIMARY }}
        >
          {post.title}
        </motion.h1>

        {/* Author / Date / ReadTime Info Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center gap-4 sm:gap-5 mb-10 pb-8"
          style={{ borderBottom: `1px solid ${BORDER}` }}
        >
          {/* Author */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center size-8 rounded-full"
              style={{ backgroundColor: TERTIARY }}
            >
              <User className="size-3.5" style={{ color: PRIMARY }} />
            </div>
            <span className="text-sm font-medium" style={{ color: TEXT_DARK }}>
              {post.author}
            </span>
          </div>

          {/* Separator */}
          <div className="h-4 w-px hidden sm:block" style={{ backgroundColor: BORDER }} />

          {/* Date */}
          <div className="flex items-center gap-1.5 text-sm" style={{ color: TEXT_MUTED }}>
            <Calendar className="size-3.5" />
            <span>{formattedDate}</span>
          </div>

          {/* Separator */}
          <div className="h-4 w-px hidden sm:block" style={{ backgroundColor: BORDER }} />

          {/* Read Time */}
          <div className="flex items-center gap-1.5 text-sm" style={{ color: TEXT_MUTED }}>
            <Clock className="size-3.5" />
            <span>{post.readTime} de lecture</span>
          </div>
        </motion.div>

        {/* Article Body */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <MarkdownContent content={post.content} />
        </motion.div>

        {/* ── Bottom Separator + Back Button ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-12 pt-8"
          style={{ borderTop: `1px solid ${BORDER}` }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider px-6 py-3 transition-colors duration-300 w-full sm:w-auto justify-center"
              style={{ backgroundColor: PRIMARY, color: '#000000' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
            >
              <ArrowLeft className="size-4" />
              Retour au blog
            </button>

            {/* Share hint */}
            <p className="text-xs" style={{ color: TEXT_MUTED }}>
              Merci d&apos;avoir lu cet article
            </p>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
