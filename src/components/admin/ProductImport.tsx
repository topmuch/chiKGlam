'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  FileJson,
  FileSpreadsheet,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Download,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImportResult {
  success: boolean;
  summary?: {
    total: number;
    created: number;
    updated: number;
    skipped: number;
    failed: number;
  };
  errors?: { index: number; name: string; error: string }[];
  error?: string;
}

interface ProductImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

// Example JSON template
const EXAMPLE_JSON = JSON.stringify([
  {
    name: 'The Cream Cleansing Gel',
    brand: 'La Mer',
    price: 95,
    originalPrice: 120,
    description: 'A luxurious gel-to-foam cleanser...',
    shortDescription: 'Gentle foaming cleanser',
    image: 'https://example.com/product-1.jpg',
    images: ['https://example.com/product-1.jpg', 'https://example.com/product-1b.jpg'],
    category: 'Skincare',
    subcategory: 'Cleansers',
    tags: ['gentle', 'foaming', 'hydrating'],
    sku: 'LM-001',
    stockCount: 100,
    inStock: true,
    isNew: true,
    isTrending: false,
    isBestseller: true,
    weight: 0.15,
  },
  {
    name: 'Another Product',
    brand: 'Brand Name',
    price: 45,
    category: 'Makeup',
    subcategory: 'Face',
    tags: 'foundation, matte',
    image: 'https://example.com/product-2.jpg',
  },
], null, 2);

export function ProductImport({ open, onOpenChange, onImportComplete }: ProductImportProps) {
  const [importMode, setImportMode] = useState<'create' | 'update' | 'upsert'>('create');
  const [importSource, setImportSource] = useState<'json' | 'csv' | 'woocommerce'>('woocommerce');
  const [jsonData, setJsonData] = useState('');
  const [csvData, setCsvData] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setJsonData('');
    setCsvData('');
    setResult(null);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  // Parse CSV to JSON
  const parseCSV = (csv: string): Record<string, string>[] => {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(';').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(';').map((v) => v.trim().replace(/^["']|["']$/g, ''));
      if (values.length === 0 || (values.length === 1 && values[0] === '')) continue;

      const row: Record<string, string> = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });
      rows.push(row);
    }
    return rows;
  };

  // Map CSV headers to product fields
  const mapCSVToProducts = (rows: Record<string, string>[]) => {
    const fieldMap: Record<string, string> = {
      'nom': 'name', 'name': 'name', 'produit': 'name', 'product': 'name',
      'marque': 'brand', 'brand': 'brand',
      'prix': 'price', 'price': 'price', 'prix de vente': 'price',
      'prix original': 'originalPrice', 'prix_barre': 'originalPrice', 'original_price': 'originalPrice',
      'description': 'description', 'desc': 'description',
      'courte description': 'shortDescription', 'short_description': 'shortDescription', 'shortdesc': 'shortDescription',
      'image': 'image', 'photo': 'image', 'url image': 'image', 'image_url': 'image',
      'images': 'images', 'photos': 'images', 'image_urls': 'images',
      'categorie': 'category', 'catégorie': 'category', 'category': 'category',
      'sous-categorie': 'subcategory', 'sous_categorie': 'subcategory', 'subcategory': 'subcategory',
      'tags': 'tags', 'étiquettes': 'tags',
      'sku': 'sku', 'ref': 'sku', 'référence': 'sku', 'reference': 'sku',
      'stock': 'stockCount', 'quantite': 'stockCount', 'quantité': 'stockCount', 'stock_count': 'stockCount',
      'en stock': 'inStock', 'disponible': 'inStock', 'in_stock': 'inStock',
      'nouveau': 'isNew', 'new': 'isNew', 'is_new': 'isNew',
      'tendance': 'isTrending', 'trending': 'isTrending', 'is_trending': 'isTrending',
      'meilleure vente': 'isBestseller', 'bestseller': 'isBestseller', 'is_bestseller': 'isBestseller',
      'poids': 'weight', 'weight': 'weight',
    };

    return rows.map((row) => {
      const product: Record<string, unknown> = {};
      Object.entries(row).forEach(([key, value]) => {
        const field = fieldMap[key.toLowerCase()] || fieldMap[key] || key.toLowerCase();
        if (value !== '' && value !== undefined) {
          // Handle boolean fields
          if (['inStock', 'isNew', 'isTrending', 'isBestseller', 'isFeatured', 'isActive'].includes(field)) {
            product[field] = ['true', 'oui', '1', 'yes'].includes(value.toLowerCase());
          }
          // Handle numeric fields
          else if (['price', 'originalPrice', 'stockCount', 'weight'].includes(field)) {
            product[field] = parseFloat(value) || 0;
          }
          // Handle images array from comma-separated URLs
          else if (field === 'images') {
            product[field] = value.split(',').map((u) => u.trim()).filter(Boolean);
          }
          // Handle tags array
          else if (field === 'tags') {
            product[field] = value.split(',').map((t) => t.trim()).filter(Boolean);
          }
          else {
            product[field] = value;
          }
        }
      });
      return product;
    });
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (file.name.endsWith('.json')) {
        setImportSource('json');
        setJsonData(content);
      } else if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
        // Auto-detect WooCommerce CSV by checking header
        if (content.includes('Type') && content.includes('UGS') && content.includes('Tarif régulier')) {
          setImportSource('woocommerce');
          setCsvData(content);
        } else {
          setImportSource('csv');
          setCsvData(content);
        }
      } else {
        alert('Format non supporté. Utilisez .json ou .csv');
      }
    };
    reader.readAsText(file);
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Execute import
  const handleImport = async () => {
    // WooCommerce mode: send raw CSV to dedicated endpoint
    if (importSource === 'woocommerce') {
      if (!csvData.trim()) {
        setResult({ success: false, error: 'Données CSV manquantes.' });
        return;
      }
      setImporting(true);
      setResult(null);
      try {
        const response = await fetch('/api/products/import/woocommerce', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csv: csvData }),
        });
        const data: ImportResult = await response.json();
        setResult(data);
        if (data.success) onImportComplete();
      } catch {
        setResult({ success: false, error: 'Erreur réseau.' });
      } finally {
        setImporting(false);
      }
      return;
    }

    let products: unknown[];

    if (importSource === 'json') {
      try {
        const parsed = JSON.parse(jsonData);
        products = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        setResult({ success: false, error: 'JSON invalide. Vérifiez le format.' });
        return;
      }
    } else {
      if (!csvData.trim()) {
        setResult({ success: false, error: 'Données CSV manquantes.' });
        return;
      }
      const rows = parseCSV(csvData);
      if (rows.length === 0) {
        setResult({ success: false, error: 'CSV vide ou format incorrect.' });
        return;
      }
      products = mapCSVToProducts(rows);
    }

    if (products.length === 0) {
      setResult({ success: false, error: 'Aucun produit à importer.' });
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      const response = await fetch('/api/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products, mode: importMode }),
      });

      const data: ImportResult = await response.json();
      setResult(data);

      if (data.success) {
        onImportComplete();
      }
    } catch {
      setResult({ success: false, error: 'Erreur réseau. Vérifiez votre connexion.' });
    } finally {
      setImporting(false);
    }
  };

  const loadTemplate = () => {
    setImportSource('json');
    setJsonData(EXAMPLE_JSON);
  };

  const downloadTemplate = () => {
    const csv = 'Nom;Marque;Prix;Prix Original;Description;Courte Description;Image;Images;Catégorie;Sous-catégorie;Tags;SKU;Stock;En Stock;Nouveau;Tendance;Meilleure Vente;Poids\nThe Cream Cleansing Gel;La Mer;95;120;A luxurious gel-to-foam cleanser;Gentle foaming cleanser;https://example.com/product.jpg;https://example.com/p1.jpg,https://example.com/p2.jpg;Skincare;Cleansers;gentle,foaming;LM-001;100;oui;oui;non;oui;0.15\nAnother Product;Brand Name;45;;Nice foundation;Light coverage;https://example.com/prod2.jpg;;Makeup;Face;foundation,matte;BN-002;50;oui;non;non;non;';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modele_import_produits.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const modeDescriptions: Record<string, string> = {
    create: 'Crée uniquement de nouveaux produits (ignore les doublons SKU)',
    update: 'Met à jour uniquement les produits existants (par SKU)',
    upsert: 'Met à jour si existant, crée si nouveau (recommandé)',
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import de Produits
          </DialogTitle>
          <DialogDescription>
            Importez vos produits en masse via JSON ou CSV
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Mode selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium">Mode d&apos;import</Label>
              <Select value={importMode} onValueChange={(v) => setImportMode(v as typeof importMode)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create">
                    <div className="flex flex-col">
                      <span>Créer uniquement</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="update">
                    <div className="flex flex-col">
                      <span>Mettre à jour uniquement</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="upsert">
                    <div className="flex flex-col">
                      <span>Créer ou mettre à jour</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">{modeDescriptions[importMode]}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Source</Label>
              <Select value={importSource} onValueChange={(v) => { setImportSource(v as typeof importSource); setResult(null); }}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="woocommerce">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      WooCommerce CSV
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <FileJson className="h-4 w-4" />
                      JSON
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV personnalisé (;)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {importSource === 'woocommerce' && 'Export WooCommerce auto-détecté. Les URLs images sont converties en local.'}
                {importSource === 'json' && 'Tableau JSON de produits'}
                {importSource === 'csv' && 'CSV avec séparateur point-virgule (;)'}
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={loadTemplate}>
              <Info className="h-3.5 w-3.5 mr-1.5" />
              Charger un exemple JSON
            </Button>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Télécharger modèle CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Charger un fichier
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                e.target.value = '';
              }}
            />
          </div>

          {/* Data input area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-lg border-2 border-dashed transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25'
            }`}
          >
            {importSource === 'json' ? (
              <Textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder='Collez votre JSON ici ou glissez-déposez un fichier .json

[
  {
    "name": "Nom du produit",
    "brand": "Marque",
    "price": 29.99,
    "category": "Skincare",
    "image": "https://..."
  }
]'
                className="min-h-[200px] max-h-[350px] font-mono text-sm border-0 focus-visible:ring-0 resize-none rounded-lg bg-transparent"
              />
            ) : importSource === 'woocommerce' ? (
              <Textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder={`Collez votre export WooCommerce CSV ici ou glissez-déposez le fichier .csv

Format supporté : Export WooCommerce (colonnes FR)
Les colonnes détectées automatiquement :
- Nom, UGS, Description, Description courte
- Tarif régulier, Tarif promo
- Catégories, Étiquettes, Images
- Stock, En stock, Poids

Les URLs d'images WooCommerce sont automatiquement
converties en chemins locaux (/images/products/woocommerce/...)`}
                className="min-h-[200px] max-h-[350px] font-mono text-sm border-0 focus-visible:ring-0 resize-none rounded-lg bg-transparent"
              />
            ) : (
              <Textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder={`Collez votre CSV ici (séparateur ;) ou glissez-déposez un fichier .csv

Nom;Marque;Prix;Catégorie;Image;Stock
Produit 1;Marque A;29.99;Skincare;https://...;100
Produit 2;Marque B;45.00;Makeup;https://...;50`}
                className="min-h-[200px] max-h-[350px] font-mono text-sm border-0 focus-visible:ring-0 resize-none rounded-lg bg-transparent"
              />
            )}
            {dragActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg">
                <p className="text-sm font-medium">Déposez votre fichier ici</p>
              </div>
            )}
          </div>

          {/* Import button */}
          {!result && (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={reset}>
                <Trash2 className="h-4 w-4 mr-2" />
                Effacer
              </Button>
              <Button
                onClick={handleImport}
                disabled={
                  importing ||
                  (importSource === 'json' ? !jsonData.trim() : !csvData.trim())
                }
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importation...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {importSource === 'woocommerce' ? 'Importer WooCommerce CSV' : 'Importer les produits'}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Result display */}
          {result && (
            <div className="space-y-4">
              {result.success ? (
                <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">
                          Import terminé !
                        </h4>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                            {result.summary?.total} total
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {result.summary?.created} créés
                          </Badge>
                          {result.summary && result.summary.updated > 0 && (
                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                              {result.summary.updated} mis à jour
                            </Badge>
                          )}
                          {result.summary && result.summary.skipped > 0 && (
                            <Badge className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                              {result.summary.skipped} ignorés
                            </Badge>
                          )}
                          {result.summary && result.summary.failed > 0 && (
                            <Badge variant="destructive">
                              {result.summary.failed} échoués
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-300">
                          Erreur d&apos;importation
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                          {result.error}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error details */}
              {result.errors && result.errors.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Détails des erreurs ({result.errors.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Error summary by type */}
                    {(() => {
                      const errorGroups: Record<string, number> = {};
                      result.errors!.forEach((err) => {
                        const key = err.error;
                        errorGroups[key] = (errorGroups[key] || 0) + 1;
                      });
                      const entries = Object.entries(errorGroups).sort((a, b) => b[1] - a[1]);
                      return (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {entries.map(([err, count]) => (
                            <Badge key={err} variant="destructive" className="text-[11px]">
                              {count}x {err}
                            </Badge>
                          ))}
                        </div>
                      );
                    })()}
                    <ScrollArea className="max-h-[200px]">
                      <div className="space-y-1">
                        {result.errors.map((err, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs py-1 border-b last:border-0">
                            <Badge variant="outline" className="shrink-0 text-[10px]">#{err.index + 1}</Badge>
                            <span className="font-medium truncate max-w-[150px]">{err.name}</span>
                            <span className="text-destructive">{err.error}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {/* Action buttons after result */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={reset}>
                  Nouvel import
                </Button>
                <Button onClick={handleClose}>
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
