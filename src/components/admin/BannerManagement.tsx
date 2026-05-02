'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Upload,
  Loader2,
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  MoveUp,
  MoveDown,
  Camera,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface Banner {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
  promoProductIds: string;
  promoStartDate: string | null;
  promoEndDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProductOption {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
}

const CATEGORY_LINKS = [
  { value: 'makeup', label: 'Makeup' },
  { value: 'lingerie', label: 'Lingerie' },
  { value: 'accessoires', label: 'Accessoires' },
  { value: 'boutique', label: 'Boutique (tous les produits)' },
];

const TYPE_CONFIG = {
  hero: {
    label: 'Carrousel Hero',
    labelPlural: 'Carrousel Hero',
    description: 'Grandes bannières du diaporama en haut de la page d\'accueil',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    recommendedSize: '1920 × 800 px',
  },
  offer: {
    label: 'Bannière Offre',
    labelPlural: 'Bannières Offres',
    description: 'Bannières promotionnelles au milieu de la page',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    recommendedSize: '1440 × 500 px',
  },
  promo: {
    label: 'Bannière Promo Duo',
    labelPlural: 'Bannière Promo Duo',
    description: 'Grande bannière avec zone image et produits promotionnels',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    recommendedSize: '800 × 600 px',
  },
};

const DEFAULT_FORM = {
  type: 'hero',
  title: '',
  subtitle: '',
  cta: '',
  image: '',
  link: 'makeup',
  sortOrder: 0,
  isActive: true,
  promoProductIds: '',
  promoStartDate: '',
  promoEndDate: '',
};

// ============================================================
// Banner Management Component
// ============================================================

export function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hero' | 'offer' | 'promo'>('hero');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Product selector state
  const [productSearch, setProductSearch] = useState('');
  const [allProducts, setAllProducts] = useState<ProductOption[]>([]);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const productSearchRef = useRef<HTMLInputElement>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // Data Fetching
  // ============================================================

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/banners?type=${activeTab}`);
      const data = await res.json();
      if (data.success) {
        setBanners(data.banners);
      }
    } catch (e) {
      console.error('Fetch banners error:', e);
    }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/banners?type=${activeTab}`);
        const data = await res.json();
        if (data.success && !cancelled) {
          setBanners(data.banners);
        }
      } catch (e) {
        console.error('Fetch banners error:', e);
      }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [activeTab]);

  // Fetch products for the product selector
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await fetch('/api/products?limit=100&admin=true');
      const data = await res.json();
      if (data.products) {
        setAllProducts(data.products);
      }
    } catch (e) {
      console.error('Fetch products error:', e);
    }
    setProductsLoading(false);
  }, []);

  // Close product dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(e.target as Node) &&
        productSearchRef.current &&
        !productSearchRef.current.contains(e.target as Node)
      ) {
        setProductDropdownOpen(false);
      }
    };
    if (productDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [productDropdownOpen]);

  // Parse selected product IDs from form
  const getSelectedProductIds = useCallback((): string[] => {
    try {
      const parsed = JSON.parse(form.promoProductIds);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
    return [];
  }, [form.promoProductIds]);

  const getSelectedProducts = useCallback((): ProductOption[] => {
    const ids = getSelectedProductIds();
    return ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean) as ProductOption[];
  }, [getSelectedProductIds, allProducts]);

  const handleSelectProduct = useCallback((product: ProductOption) => {
    const currentIds = getSelectedProductIds();
    if (currentIds.includes(product.id)) return; // already selected
    if (currentIds.length >= 2) return; // max 2
    const newIds = [...currentIds, product.id];
    setForm((prev) => ({ ...prev, promoProductIds: JSON.stringify(newIds) }));
    setProductSearch('');
    setProductDropdownOpen(false);
  }, [getSelectedProductIds]);

  const handleRemoveProduct = useCallback((productId: string) => {
    const currentIds = getSelectedProductIds();
    const newIds = currentIds.filter((id) => id !== productId);
    setForm((prev) => ({ ...prev, promoProductIds: JSON.stringify(newIds) }));
  }, [getSelectedProductIds]);

  // Filter products by search
  const filteredProducts = allProducts.filter((p) => {
    const term = productSearch.toLowerCase();
    if (!term) return true;
    return (
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term)
    );
  });

  // ============================================================
  // Handlers
  // ============================================================

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setForm({
        type: banner.type,
        title: banner.title,
        subtitle: banner.subtitle,
        cta: banner.cta,
        image: banner.image,
        link: banner.link,
        sortOrder: banner.sortOrder,
        isActive: banner.isActive,
        promoProductIds: banner.promoProductIds || '',
        promoStartDate: banner.promoStartDate ? banner.promoStartDate.slice(0, 16) : '',
        promoEndDate: banner.promoEndDate ? banner.promoEndDate.slice(0, 16) : '',
      });
      setPreviewUrl(banner.image);
    } else {
      setEditingBanner(null);
      setForm({ ...DEFAULT_FORM, type: activeTab, sortOrder: banners.length });
      setPreviewUrl('');
    }
    setProductSearch('');
    setProductDropdownOpen(false);
    fetchProducts();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBanner(null);
    setForm(DEFAULT_FORM);
    setPreviewUrl('');
    setUploading(false);
    setProductSearch('');
    setProductDropdownOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/banners/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, image: data.imageUrl }));
        setPreviewUrl(data.imageUrl);
      } else {
        alert(data.error || 'Erreur lors de l\'upload');
      }
    } catch (e) {
      console.error('Upload error:', e);
      alert('Erreur lors de l\'upload');
    }
    setUploading(false);
  };

  const saveBanner = async () => {
    if (!form.title.trim()) {
      alert('Le titre est requis.');
      return;
    }

    setSaving(true);
    try {
      if (editingBanner) {
        const res = await fetch(`/api/banners/${editingBanner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          closeModal();
          fetchBanners();
        } else {
          alert(data.error || 'Erreur lors de la mise à jour');
        }
      } else {
        const res = await fetch('/api/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          closeModal();
          fetchBanners();
        } else {
          alert(data.error || 'Erreur lors de la création');
        }
      }
    } catch (e) {
      console.error('Save banner error:', e);
    }
    setSaving(false);
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchBanners();
      }
    } catch (e) {
      console.error('Delete banner error:', e);
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      fetchBanners();
    } catch (e) {
      console.error('Toggle active error:', e);
    }
  };

  const moveBanner = async (banner: Banner, direction: 'up' | 'down') => {
    const idx = banners.findIndex((b) => b.id === banner.id);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= banners.length) return;

    const swapBanner = banners[swapIdx];
    try {
      await fetch('/api/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orders: [
            { id: banner.id, sortOrder: swapBanner.sortOrder },
            { id: swapBanner.id, sortOrder: banner.sortOrder },
          ],
        }),
      });
      fetchBanners();
    } catch (e) {
      console.error('Reorder error:', e);
    }
  };

  // ============================================================
  // Render
  // ============================================================

  const config = TYPE_CONFIG[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Bannières</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Modifiez les images et textes des bannières de votre page d&apos;accueil
          </p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Bannière
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        {(Object.keys(TYPE_CONFIG) as Array<'hero' | 'offer' | 'promo'>).map((type) => {
          const cfg = TYPE_CONFIG[type];
          const isActive = activeTab === type;
          return (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left ${
                isActive
                  ? 'border-foreground bg-foreground/5 shadow-sm'
                  : 'border-border hover:border-foreground/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex-1">
                <div className="font-semibold text-sm">{cfg.labelPlural}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{cfg.recommendedSize}</div>
              </div>
              <Badge variant="outline" className={isActive ? cfg.color : 'bg-muted text-muted-foreground'}>
                {banners.filter((b) => b.type === type).length || 0}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Info Card */}
      <Card className="border-dashed">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Camera className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">{config.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Taille recommandée : <strong>{config.recommendedSize}</strong>
                {' — '}Format accepté : JPG, PNG, WebP, GIF, AVIF
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banner List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Aucune bannière {config.label.toLowerCase()}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Commencez par ajouter une bannière pour la section &laquo; {config.label} &raquo;
            </p>
            <Button onClick={() => openModal()} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter une bannière
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {banners.map((banner, index) => (
            <Card key={banner.id} className={`overflow-hidden ${!banner.isActive ? 'opacity-60' : ''}`}>
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Image Preview */}
                  <div className="relative w-full sm:w-48 md:w-64 h-40 sm:h-auto bg-muted flex-shrink-0 overflow-hidden">
                    {banner.image ? (
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                    )}
                    {/* Type Badge */}
                    <Badge className={`absolute top-2 left-2 ${TYPE_CONFIG[banner.type as keyof typeof TYPE_CONFIG]?.color || 'bg-gray-100 text-gray-800'} text-[10px]`}>
                      {TYPE_CONFIG[banner.type as keyof typeof TYPE_CONFIG]?.label || banner.type}
                    </Badge>
                    {/* Active indicator */}
                    {!banner.isActive && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-xs font-bold bg-black/60 px-2 py-1 rounded">DÉSACTIVÉE</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                          <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{banner.title}</h3>
                        </div>
                        <Badge variant="outline" className="text-[10px] flex-shrink-0">
                          #{banner.sortOrder}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 pl-6">{banner.subtitle}</p>
                      <div className="flex items-center gap-3 pl-6">
                        {banner.cta && (
                          <Badge variant="secondary" className="text-[10px]">{banner.cta}</Badge>
                        )}
                        {banner.link && (
                          <span className="text-[10px] text-muted-foreground">→ {banner.link}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 mt-3 pl-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveBanner(banner, 'up')}
                        disabled={index === 0}
                        title="Monter"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveBanner(banner, 'down')}
                        disabled={index === banners.length - 1}
                        title="Descendre"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6 mx-1" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleActive(banner)}
                        title={banner.isActive ? 'Désactiver' : 'Activer'}
                      >
                        {banner.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openModal(banner)}
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteBanner(banner.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? 'Modifier la bannière' : 'Nouvelle bannière'}
            </DialogTitle>
            <DialogDescription>
              {config.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Banner Type */}
            <div className="space-y-2">
              <Label>Type de bannière</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm((prev) => ({ ...prev, type: v }))}
                disabled={!!editingBanner}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>
                      {cfg.label} ({cfg.recommendedSize})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Image de la bannière</Label>
              <div
                className="relative border-2 border-dashed border-border rounded-lg overflow-hidden cursor-pointer hover:border-foreground/30 transition-colors group"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="relative aspect-[2/1] bg-muted">
                    <img
                      src={previewUrl}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white">
                        <Upload className="h-5 w-5" />
                        <span className="text-sm font-medium">Changer l&apos;image</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    {uploading ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        <span className="text-sm">Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-sm font-medium">Cliquez pour uploader une image</span>
                        <span className="text-xs mt-1">Taille recommandée : {TYPE_CONFIG[form.type as keyof typeof TYPE_CONFIG]?.recommendedSize}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              {/* URL fallback */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">ou URL :</span>
                <Input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={form.image.startsWith('/uploads/') ? '' : form.image}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, image: e.target.value }));
                    setPreviewUrl(e.target.value);
                  }}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <Separator />

            {/* Text Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="banner-title">Titre *</Label>
                <Input
                  id="banner-title"
                  placeholder="Ex: Brillez Comme Jamais"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner-subtitle">Sous-titre</Label>
                <Textarea
                  id="banner-subtitle"
                  placeholder="Ex: Découvrez notre collection de soins et maquillage haut de gamme"
                  value={form.subtitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner-cta">Texte du bouton (CTA)</Label>
                <Input
                  id="banner-cta"
                  placeholder="Ex: Découvrir"
                  value={form.cta}
                  onChange={(e) => setForm((prev) => ({ ...prev, cta: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Lien de destination</Label>
                <Select
                  value={form.link}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, link: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_LINKS.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Bannière active</Label>
                <p className="text-xs text-muted-foreground">Les bannières désactivées ne sont pas affichées</p>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>

            {/* Promo-specific fields — only shown for type "promo" */}
            {form.type === 'promo' && (
              <>
                <Separator />

                {/* Product Selector */}
                <div className="space-y-2">
                  <Label>Produits promotionnels (1-2)</Label>
                  <p className="text-xs text-muted-foreground">
                    Sélectionnez les produits à afficher dans la bannière promo duo
                  </p>

                  {/* Selected products */}
                  {getSelectedProducts().length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {getSelectedProducts().map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1.5 pr-1"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-medium truncate max-w-[140px]">{p.name}</span>
                            <span className="text-[10px] text-muted-foreground">{p.brand} — {p.price.toFixed(2)}€</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(p.id)}
                            className="flex-shrink-0 p-1 rounded hover:bg-background/80 transition-colors"
                            title="Retirer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Search input */}
                  {getSelectedProductIds().length < 2 && (
                    <div className="relative">
                      <Input
                        ref={productSearchRef}
                        type="text"
                        placeholder="Rechercher un produit par nom ou marque..."
                        value={productSearch}
                        onChange={(e) => {
                          setProductSearch(e.target.value);
                          setProductDropdownOpen(true);
                        }}
                        onFocus={() => {
                          if (!productDropdownOpen) {
                            fetchProducts();
                            setProductDropdownOpen(true);
                          }
                        }}
                        className="h-9"
                      />

                      {/* Dropdown */}
                      {productDropdownOpen && (
                        <div
                          ref={productDropdownRef}
                          className="absolute z-50 top-full mt-1 w-full bg-background border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto"
                        >
                          {productsLoading ? (
                            <div className="flex items-center justify-center py-6">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                          ) : filteredProducts.length === 0 ? (
                            <div className="py-4 px-3 text-center text-xs text-muted-foreground">
                              Aucun produit trouvé
                            </div>
                          ) : (
                            filteredProducts.slice(0, 20).map((p) => {
                              const isSelected = getSelectedProductIds().includes(p.id);
                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  disabled={isSelected}
                                  onClick={() => handleSelectProduct(p)}
                                  className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted/80 transition-colors ${
                                    isSelected ? 'opacity-40 cursor-not-allowed' : ''
                                  }`}
                                >
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-10 h-10 rounded-md object-cover flex-shrink-0 bg-muted"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{p.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {p.brand}
                                      {p.originalPrice && p.originalPrice > p.price && (
                                        <span className="ml-1.5 text-red-500">
                                          {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% off
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                  <span className="text-sm font-semibold flex-shrink-0">
                                    {p.price.toFixed(2)}€
                                  </span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="promo-start-date">Date de début (optionnel)</Label>
                    <Input
                      id="promo-start-date"
                      type="datetime-local"
                      value={form.promoStartDate}
                      onChange={(e) => setForm((prev) => ({ ...prev, promoStartDate: e.target.value }))}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Si vide, la promo est visible immédiatement
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promo-end-date">Date de fin (optionnel)</Label>
                    <Input
                      id="promo-end-date"
                      type="datetime-local"
                      value={form.promoEndDate}
                      onChange={(e) => setForm((prev) => ({ ...prev, promoEndDate: e.target.value }))}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Si vide, la promo est toujours visible
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Annuler
            </Button>
            <Button onClick={saveBanner} disabled={saving || uploading} className="gap-2">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {editingBanner ? 'Mettre à jour' : 'Créer la bannière'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
