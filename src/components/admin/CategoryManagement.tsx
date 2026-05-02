'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FolderOpen,
  Package,
  Image as ImageIcon,
  Plus,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// ============================================================
// Types
// ============================================================

interface Category {
  id?: string;
  name: string;
  count: number;
  image: string;
  slug?: string;
  description?: string;
  subcategories?: string;
  source?: string;
}

// ============================================================
// Slug generation helper
// ============================================================

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ============================================================
// Category Management Component
// ============================================================

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formSubcategories, setFormSubcategories] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // ============================================================
  // Data Fetching — cancelled flag pattern (no setState in useEffect)
  // ============================================================

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (e) {
      console.error('Fetch categories error:', e);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      await fetchCategories();
      if (!cancelled) setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [fetchCategories]);

  // ============================================================
  // Auto-generate slug from name
  // ============================================================

  const handleNameChange = (value: string) => {
    setFormName(value);
    if (!slugManuallyEdited) {
      setFormSlug(generateSlug(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setFormSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
    setSlugManuallyEdited(true);
  };

  // ============================================================
  // Reset form
  // ============================================================

  const resetForm = () => {
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormImage('');
    setFormSubcategories('');
    setSlugManuallyEdited(false);
    setCreating(false);
  };

  // ============================================================
  // Create category
  // ============================================================

  const handleCreate = async () => {
    if (!formName.trim()) {
      toast.error('Le nom de la catégorie est requis');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          slug: formSlug.trim(),
          description: formDescription.trim(),
          image: formImage.trim(),
          subcategories: formSubcategories.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Catégorie "${data.category.name}" créée avec succès`);
        setDialogOpen(false);
        resetForm();
        await fetchCategories();
      } else {
        toast.error(data.error || 'Erreur lors de la création');
      }
    } catch {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setCreating(false);
    }
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Catégories</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Vue d&apos;ensemble de toutes les catégories de produits
          </p>
        </div>

        {/* Create Category Button */}
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          if (!open) resetForm();
          setDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer une catégorie
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvelle catégorie</DialogTitle>
              <DialogDescription>
                Créez une nouvelle catégorie pour organiser vos produits.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="cat-name">
                  Nom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cat-name"
                  placeholder="Ex: Maquillage"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  disabled={creating}
                />
              </div>

              {/* Slug */}
              <div className="grid gap-2">
                <Label htmlFor="cat-slug">Slug</Label>
                <Input
                  id="cat-slug"
                  placeholder="maquillage"
                  value={formSlug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  disabled={creating}
                />
                <p className="text-xs text-muted-foreground">
                  Auto-généré à partir du nom. Utilisé dans les URLs.
                </p>
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="cat-desc">Description</Label>
                <Textarea
                  id="cat-desc"
                  placeholder="Décrivez cette catégorie..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  disabled={creating}
                  rows={3}
                />
              </div>

              {/* Image URL */}
              <div className="grid gap-2">
                <Label htmlFor="cat-image">URL de l&apos;image</Label>
                <Input
                  id="cat-image"
                  placeholder="https://example.com/image.jpg"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  disabled={creating}
                />
              </div>

              {/* Subcategories */}
              <div className="grid gap-2">
                <Label htmlFor="cat-subs">Sous-catégories</Label>
                <Input
                  id="cat-subs"
                  placeholder="Teint, Yeux, Lèvres"
                  value={formSubcategories}
                  onChange={(e) => setFormSubcategories(e.target.value)}
                  disabled={creating}
                />
                <p className="text-xs text-muted-foreground">
                  Séparées par des virgules
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
                disabled={creating}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreate}
                disabled={creating || !formName.trim()}
              >
                {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Aucune catégorie</h3>
            <p className="text-sm text-muted-foreground">
              Les catégories apparaîtront automatiquement dès que des produits seront ajoutés,
              ou vous pouvez en créer une manuellement.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Category Grid */}
      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id || category.name}
              className="overflow-hidden group hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                )}

                {/* Product Count Badge */}
                <Badge className="absolute top-2 right-2 bg-background/90 text-foreground backdrop-blur-sm text-xs">
                  <Package className="h-3 w-3 mr-1" />
                  {category.count} produit{category.count > 1 ? 's' : ''}
                </Badge>

                {/* Source Badge (for custom categories) */}
                {category.source === 'custom' && (
                  <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
                    Personnalisée
                  </Badge>
                )}
              </div>

              {/* Category Name */}
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <h3 className="font-semibold text-sm truncate">{category.name}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
