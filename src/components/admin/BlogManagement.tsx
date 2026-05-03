'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ImageIcon,
  Search,
  X,
  Save,
  Newspaper,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ============================================================
// Types
// ============================================================

interface BlogPost {
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

// ============================================================
// Constants
// ============================================================

const BLOG_CATEGORIES = [
  'Conseils Beauté',
  'Tendances',
  'Tutoriels',
  'Inspiration',
  'Soins Peau',
];

const productImages = [
  { label: 'Fond de teint', url: '/images/products/makeup/fond-de-teint-allcover.png' },
  { label: 'Poudre compacte', url: '/images/products/makeup/poudre-compacte.png' },
  { label: 'Highlighter', url: '/images/products/makeup/highlighter.png' },
  { label: 'Poudre libre', url: '/images/products/makeup/poudre-libre-translucide.png' },
  { label: 'Concealer', url: '/images/products/makeup/flawless-finish-concealer.jpeg' },
  { label: 'Skin finish', url: '/images/products/makeup/flawless-finish-skin.jpeg' },
  { label: 'Rouge à lèvres', url: '/images/products/makeup/rouge-a-levres-matte.png' },
  { label: 'Palette yeux', url: '/images/products/makeup/palette-yeux-9-couleurs.png' },
  { label: 'Nuisette', url: '/images/products/lingerie/kit-nuisette.png' },
  { label: 'Body scrub', url: '/images/products/makeup/body-scrub.png' },
];

const EMPTY_FORM: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'Conseils Beauté',
  author: 'Chic Glam',
  coverImage: '',
  isPublished: true,
  readTime: '5 min',
};

// ============================================================
// Helpers
// ============================================================

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

// ============================================================
// BlogManagement Component
// ============================================================

export default function BlogManagement() {
  // ----------------------------------------------------------
  // Data state
  // ----------------------------------------------------------
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ----------------------------------------------------------
  // Dialog / form state
  // ----------------------------------------------------------
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [slugEdited, setSlugEdited] = useState(false);

  // ----------------------------------------------------------
  // Delete confirmation state
  // ----------------------------------------------------------
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ============================================================
  // Data Fetching
  // ============================================================

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts ?? []);
      }
    } catch (err) {
      console.error('Fetch posts error:', err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      await fetchPosts();
      if (!cancelled) setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [fetchPosts]);

  // ============================================================
  // Filtering
  // ============================================================

  const filteredPosts = posts.filter((post) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(term) ||
      post.category.toLowerCase().includes(term) ||
      post.author.toLowerCase().includes(term)
    );
  });

  // ============================================================
  // Form helpers
  // ============================================================

  const openCreateDialog = () => {
    setEditingPost(null);
    setForm({ ...EMPTY_FORM });
    setSlugEdited(false);
    setDialogOpen(true);
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      coverImage: post.coverImage,
      isPublished: post.isPublished,
      readTime: post.readTime,
    });
    setSlugEdited(true); // editing existing, don't auto-overwrite
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingPost(null);
    setForm({ ...EMPTY_FORM });
    setSlugEdited(false);
    setSaving(false);
  };

  // ============================================================
  // Auto-slug
  // ============================================================

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({ ...prev, title: value }));
    if (!slugEdited) {
      setForm((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleSlugChange = (value: string) => {
    setForm((prev) => ({ ...prev, slug: value.toLowerCase().replace(/[^a-z0-9-]/g, '') }));
    setSlugEdited(true);
  };

  // ============================================================
  // Save (create or update)
  // ============================================================

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }
    if (!form.content.trim()) {
      toast.error('Le contenu est requis');
      return;
    }

    setSaving(true);
    try {
      const isUpdate = !!editingPost;
      const url = isUpdate ? `/api/blog/${editingPost.id}` : '/api/blog';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          isUpdate
            ? `Article « ${form.title} » mis à jour`
            : `Article « ${form.title} » créé`,
        );
        closeDialog();
        await fetchPosts();
      } else {
        toast.error(data.error || 'Erreur lors de la sauvegarde');
      }
    } catch {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // Delete
  // ============================================================

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/blog/${deleteTarget.id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        toast.success(`Article « ${deleteTarget.title} » supprimé`);
        setDeleteTarget(null);
        await fetchPosts();
      } else {
        toast.error(data.error || 'Erreur lors de la suppression');
      }
    } catch {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================
  // Toggle published (quick action)
  // ============================================================

  const togglePublished = async (post: BlogPost) => {
    try {
      const res = await fetch(`/api/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !post.isPublished }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          post.isPublished
            ? `Article « ${post.title} » dépublié`
            : `Article « ${post.title} » publié`,
        );
        await fetchPosts();
      } else {
        toast.error(data.error || 'Erreur lors du changement de statut');
      }
    } catch {
      toast.error('Erreur de connexion au serveur');
    }
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-rose-100 text-rose-600">
            <Newspaper className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Gestion du Blog</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Créez, modifiez et publiez vos articles
            </p>
          </div>
        </div>

        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvel Article
        </Button>
      </div>

      {/* ── Search bar ─────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par titre, catégorie, auteur…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Stats row ──────────────────────────────────────── */}
      {!loading && posts.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="text-xs font-normal">
            {posts.length} article{posts.length > 1 ? 's' : ''} au total
          </Badge>
          <Badge variant="outline" className="text-xs font-normal text-emerald-700 border-emerald-200 bg-emerald-50">
            <Eye className="h-3 w-3 mr-1" />
            {posts.filter((p) => p.isPublished).length} publié{posts.filter((p) => p.isPublished).length > 1 ? 's' : ''}
          </Badge>
          <Badge variant="outline" className="text-xs font-normal text-amber-700 border-amber-200 bg-amber-50">
            <EyeOff className="h-3 w-3 mr-1" />
            {posts.filter((p) => !p.isPublished).length} brouillon{posts.filter((p) => !p.isPublished).length > 1 ? 's' : ''}
          </Badge>
        </div>
      )}

      {/* ── Loading state ──────────────────────────────────── */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3">
              <Skeleton className="h-12 w-16 rounded-md flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ────────────────────────────────────── */}
      {!loading && posts.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Newspaper className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Aucun article</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Commencez par rédiger votre premier article de blog.
          </p>
          <Button onClick={openCreateDialog} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Rédiger un article
          </Button>
        </div>
      )}

      {/* ── Posts table ────────────────────────────────────── */}
      {!loading && filteredPosts.length > 0 && (
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
                <TableRow>
                  <TableHead className="w-16">Couverture</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead className="w-36">Catégorie</TableHead>
                  <TableHead className="w-28">Statut</TableHead>
                  <TableHead className="w-36">Date</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    {/* Cover thumbnail */}
                    <TableCell>
                      <div className="h-10 w-14 rounded-md bg-muted overflow-hidden flex-shrink-0">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Title + slug */}
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium text-sm truncate">{post.title}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          /{post.slug}
                        </p>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        {post.category}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => togglePublished(post)}
                        className="inline-flex items-center gap-1.5"
                        title={post.isPublished ? 'Dépublier' : 'Publier'}
                      >
                        {post.isPublished ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 text-xs cursor-pointer">
                            <Eye className="h-3 w-3 mr-1" />
                            Publié
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50 text-xs cursor-pointer">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Brouillon
                          </Badge>
                        )}
                      </button>
                    </TableCell>

                    {/* Date */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(post.updatedAt || post.createdAt)}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(post)}
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setDeleteTarget(post)}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ── No search results ──────────────────────────────── */}
      {!loading && posts.length > 0 && filteredPosts.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Search className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Aucun article ne correspond à « {searchTerm} »
          </p>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────
          CREATE / EDIT DIALOG
      ───────────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'Modifier l\'article' : 'Nouvel article'}
            </DialogTitle>
            <DialogDescription>
              {editingPost
                ? 'Modifiez les informations de votre article.'
                : 'Rédigez un nouvel article pour votre blog.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* ── Title ─────────────────────────────────────── */}
            <div className="grid gap-2">
              <Label htmlFor="blog-title">
                Titre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="blog-title"
                placeholder="Ex: 10 Conseils pour un Maquillage Parfait"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                disabled={saving}
              />
            </div>

            {/* ── Slug ──────────────────────────────────────── */}
            <div className="grid gap-2">
              <Label htmlFor="blog-slug">Slug</Label>
              <Input
                id="blog-slug"
                placeholder="10-conseils-pour-un-maquillage-parfait"
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground">
                Auto-généré à partir du titre. Utilisé dans les URLs.
              </p>
            </div>

            {/* ── Excerpt ───────────────────────────────────── */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="blog-excerpt">Extrait</Label>
                <span className={`text-xs ${form.excerpt.length > 200 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {form.excerpt.length}/200
                </span>
              </div>
              <Textarea
                id="blog-excerpt"
                placeholder="Un court résumé de votre article (max 200 caractères)…"
                value={form.excerpt}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    excerpt: e.target.value.slice(0, 200),
                  }))
                }
                disabled={saving}
                rows={3}
              />
            </div>

            {/* ── Content ───────────────────────────────────── */}
            <div className="grid gap-2">
              <Label htmlFor="blog-content">
                Contenu <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="blog-content"
                placeholder="Rédigez le contenu de votre article ici…"
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                disabled={saving}
                rows={10}
                className="min-h-[200px]"
              />
            </div>

            {/* ── Category & Author row ────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="grid gap-2">
                <Label>Catégorie</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, category: v }))}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Author */}
              <div className="grid gap-2">
                <Label htmlFor="blog-author">Auteur</Label>
                <Input
                  id="blog-author"
                  placeholder="Chic Glam"
                  value={form.author}
                  onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                  disabled={saving}
                />
              </div>
            </div>

            {/* ── Cover Image ───────────────────────────────── */}
            <div className="grid gap-2">
              <Label htmlFor="blog-cover">Image de couverture</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="blog-cover"
                  placeholder="URL de l'image de couverture"
                  value={form.coverImage}
                  onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
                  disabled={saving}
                  className="flex-1"
                />
                {form.coverImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 flex-shrink-0"
                    onClick={() => setForm((prev) => ({ ...prev, coverImage: '' }))}
                    title="Supprimer l'image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Cover preview */}
              {form.coverImage && (
                <div className="relative rounded-lg overflow-hidden border bg-muted h-32 w-full">
                  <img
                    src={form.coverImage}
                    alt="Aperçu de la couverture"
                    className="h-full w-full object-contain"
                  />
                </div>
              )}

              {/* Product image suggestions */}
              <div className="mt-1">
                <p className="text-xs text-muted-foreground mb-2">
                  Suggestions d&apos;images produit :
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {productImages.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, coverImage: img.url }))}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-colors ${
                        form.coverImage === img.url
                          ? 'border-foreground bg-foreground/5 font-medium'
                          : 'border-border hover:border-foreground/30 hover:bg-muted/50'
                      }`}
                    >
                      <ImageIcon className="h-3 w-3 flex-shrink-0" />
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Read Time & Published row ─────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Read Time */}
              <div className="grid gap-2">
                <Label htmlFor="blog-readtime">Temps de lecture</Label>
                <Input
                  id="blog-readtime"
                  placeholder="5 min"
                  value={form.readTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, readTime: e.target.value }))}
                  disabled={saving}
                />
              </div>

              {/* Is Published */}
              <div className="flex items-end gap-3 pb-1">
                <Switch
                  id="blog-published"
                  checked={form.isPublished}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, isPublished: checked }))
                  }
                  disabled={saving}
                />
                <div>
                  <Label htmlFor="blog-published" className="cursor-pointer">
                    Publié
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {form.isPublished
                      ? 'L\'article sera visible publiquement'
                      : 'L\'article restera en brouillon'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Dialog Footer ──────────────────────────────── */}
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={saving}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving || !form.title.trim() || !form.content.trim()} className="gap-2">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {editingPost ? 'Mettre à jour' : 'Publier l\'article'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─────────────────────────────────────────────────────
          DELETE CONFIRMATION ALERT DIALOG
      ───────────────────────────────────────────────────── */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet article ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;article{' '}
              <span className="font-semibold text-foreground">
                « {deleteTarget?.title} »
              </span>{' '}
              ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleting ? 'Suppression…' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
