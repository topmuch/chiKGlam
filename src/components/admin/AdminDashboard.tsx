'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/store/use-store';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  UserCog,
  Settings,
  Download,
  LogOut,
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  TrendingUp,
  DollarSign,
  Minus,
  AlertTriangle,
  Truck,
  Send,
  RefreshCw,
  Loader2,
  Menu,
  Bell,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Save,
  Image as ImageIcon,
  FileJson,
  FileSpreadsheet,
  Globe,
  AlertCircle,
  PanelTop,
  FolderOpen,
  Mail,
  Palette,
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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BannerManagement } from '@/components/admin/BannerManagement';
import { CategoryManagement } from '@/components/admin/CategoryManagement';
import { AdminOrderNotification } from '@/components/admin/AdminOrderNotification';
import { ProductImport } from '@/components/admin/ProductImport';
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

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeProducts: number;
  totalProducts: number;
  totalCustomers: number;
  totalUsers: number;
}

interface StatusBreakdown {
  status: string;
  count: number;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  brand: string;
  price: number;
  quantity: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  billingAddress?: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: string;
  paymentMethod?: string;
  paymentId?: string;
  paymentStatus: string;
  shippingCarrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippedAt?: string;
  deliveredAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  user?: { id: string; name: string; email: string };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string;
  category: string;
  subcategory: string;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription?: string;
  tags: string;
  inStock: boolean;
  stockCount: number;
  isNew: boolean;
  isTrending: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  sku: string;
  weight?: number;
  createdAt: string;
  updatedAt: string;
}

interface CustomerUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  isActive: boolean;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  _count?: { orders: number };
  orders?: { id: string; orderNumber: string; total: number; status: string; createdAt: string }[];
}

interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  ogImage?: string;
  contactEmail?: string;
  stripeKey?: string;
  stripeSecret?: string;
  sumupKey?: string;
  sumUpMerchantId?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  updatedAt: string;
}

interface WooImportRecord {
  id: string;
  productId?: string;
  product?: { name: string; image: string };
  wooId?: string;
  status: string;
  error?: string;
  rawData?: string;
  createdAt: string;
}

interface MediaFileItem {
  name: string;
  url: string;
  folder: string;
  size: number;
  sizeFormatted: string;
  type: string;
  lastModified: string;
  source?: string;
}

// ============================================================
// Helpers
// ============================================================

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const STATUS_COLORS: Record<string, string> = {
  processing: 'bg-amber-100 text-amber-800 border-amber-200',
  validated: 'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-orange-100 text-orange-800 border-orange-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const STATUS_LABELS: Record<string, string> = {
  processing: 'En cours de traitement',
  validated: 'Validée',
  in_progress: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'}>
      {STATUS_LABELS[status] || status}
    </Badge>
  );
}

// ============================================================
// AdminDashboard Component
// ============================================================

type Section = 'dashboard' | 'banners' | 'categories' | 'products' | 'orders' | 'customers' | 'users' | 'settings' | 'woocommerce' | 'media';

interface NavItem {
  key: Section;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Général',
    items: [
      { key: 'dashboard', label: 'Tableau de Bord', icon: <LayoutDashboard className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Catalogue',
    items: [
      { key: 'products', label: 'Produits', icon: <Package className="h-4 w-4" /> },
      { key: 'categories', label: 'Catégories', icon: <FolderOpen className="h-4 w-4" /> },
      { key: 'media', label: 'Médias', icon: <ImageIcon className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Ventes',
    items: [
      { key: 'orders', label: 'Commandes', icon: <ShoppingCart className="h-4 w-4" /> },
      { key: 'customers', label: 'Clientes', icon: <Users className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { key: 'banners', label: 'Bannières', icon: <PanelTop className="h-4 w-4" /> },
      { key: 'woocommerce', label: 'Import WooCommerce', icon: <Download className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { key: 'settings', label: 'Paramètres', icon: <Settings className="h-4 w-4" /> },
      { key: 'users', label: 'Utilisateurs', icon: <UserCog className="h-4 w-4" /> },
    ],
  },
];

const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap(g => g.items);

const CATEGORIES = [
  'Makeup', 'Lingerie', 'Accessoires', 'Cartes Cadeaux',
  'Skincare', 'Haircare', 'Fragrance', 'Bodycare',
  'Nailcare', 'Tools & Accessories', 'Wellness', 'Gift Sets',
];

export default function AdminDashboard() {
  const { currentUser, navigateTo } = useStore();
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dashboard state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdown[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSaving, setProductSaving] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '', brand: '', price: '', originalPrice: '', category: '', subcategory: '',
    description: '', shortDescription: '', sku: '', stockCount: '100', tags: '',
    inStock: true, isNew: false, isTrending: false, isBestseller: false,
    isFeatured: false, isActive: true, seoTitle: '', seoDescription: '',
  });
  const [productImages, setProductImages] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [orderSaving, setOrderSaving] = useState(false);
  const [trackingCarrier, setTrackingCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [generatedTrackingUrl, setGeneratedTrackingUrl] = useState('');

  // Create order state
  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [orderCreating, setOrderCreating] = useState(false);
  const [createOrderProducts, setCreateOrderProducts] = useState<Product[]>([]);
  const [createOrderItems, setCreateOrderItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [createOrderForm, setCreateOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingPostalCode: '',
    shippingCountry: 'France',
    paymentMethod: 'card',
    paymentStatus: 'pending',
    status: 'processing',
    notes: '',
  });

  // Customers state
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);
  const [customerDetailOpen, setCustomerDetailOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerCreating, setCustomerCreating] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
  });

  // Users state
  const [users, setUsers] = useState<CustomerUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<CustomerUser | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [userSaving, setUserSaving] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    siteName: '', siteDescription: '', siteUrl: '', ogImage: '', contactEmail: '',
    stripeKey: '', stripeSecret: '', sumupKey: '', sumUpMerchantId: '',
    smtpHost: '', smtpPort: '', smtpUser: '', smtpPass: '',
    activeTemplate: 'default',
  });

  // WooCommerce state
  const [wooImports, setWooImports] = useState<WooImportRecord[]>([]);
  const [wooImportsLoading, setWooImportsLoading] = useState(true);
  const [wooUrl, setWooUrl] = useState('');
  const [wooJson, setWooJson] = useState('');
  const [wooImporting, setWooImporting] = useState(false);
  const [wooCsvFile, setWooCsvFile] = useState<File | null>(null);
  const [wooCsvPreview, setCsvPreview] = useState<{ products: number; skipped: number; total: number } | null>(null);

  // New order notification state
  const [newOrderNotification, setNewOrderNotification] = useState<{
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    itemsCount: number;
    createdAt: string;
    status: string;
  } | null>(null);
  const [lastKnownOrderId, setLastKnownOrderId] = useState<string>('');
  const [unseenOrdersCount, setUnseenOrdersCount] = useState(0);

  // Media state
  const [mediaFiles, setMediaFiles] = useState<MediaFileItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [mediaFolderFilter, setMediaFolderFilter] = useState('');
  const [mediaSourceFilter, setMediaSourceFilter] = useState('');
  const [mediaUploading, setMediaUploading] = useState(false);
  const [mediaUploadProgress, setMediaUploadProgress] = useState(0);
  const [mediaPreviewOpen, setMediaPreviewOpen] = useState(false);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState('');
  const [mediaPreviewName, setMediaPreviewName] = useState('');

  // ============================================================
  // Data Fetching
  // ============================================================

  const fetchDashboard = useCallback(async () => {
    setDashboardLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setStatusBreakdown(data.statusBreakdown);
        setRecentOrders(data.recentOrders);
        setLowStockProducts(data.lowStockProducts);
      }
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    }
    setDashboardLoading(false);
  }, []);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100', admin: 'true' });
      if (productSearch) params.set('search', productSearch);
      if (productCategoryFilter) params.set('category', productCategoryFilter);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (e) {
      console.error('Products fetch error:', e);
    }
    setProductsLoading(false);
  }, [productSearch, productCategoryFilter]);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (orderStatusFilter) params.set('status', orderStatusFilter);
      if (orderSearch) params.set('search', orderSearch);
      const res = await fetch(`/api/orders?${params}`);
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (e) {
      console.error('Orders fetch error:', e);
    }
    setOrdersLoading(false);
  }, [orderStatusFilter, orderSearch]);

  const fetchCustomers = useCallback(async () => {
    setCustomersLoading(true);
    try {
      const res = await fetch('/api/users?role=customer&limit=100');
      const data = await res.json();
      if (data.users) setCustomers(data.users);
    } catch (e) {
      console.error('Customers fetch error:', e);
    }
    setCustomersLoading(false);
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (userSearch) params.set('search', userSearch);
      const res = await fetch(`/api/users?${params}`);
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (e) {
      console.error('Users fetch error:', e);
    }
    setUsersLoading(false);
  }, [userSearch]);

  const fetchSettings = useCallback(async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        setSettingsForm({
          siteName: data.settings.siteName || '',
          siteDescription: data.settings.siteDescription || '',
          siteUrl: data.settings.siteUrl || '',
          ogImage: data.settings.ogImage || '',
          contactEmail: data.settings.contactEmail || '',
          stripeKey: data.settings.stripeKey || '',
          stripeSecret: data.settings.stripeSecret || '',
          sumupKey: data.settings.sumupKey || '',
          sumUpMerchantId: data.settings.sumUpMerchantId || '',
          smtpHost: data.settings.smtpHost || '',
          smtpPort: data.settings.smtpPort?.toString() || '',
          smtpUser: data.settings.smtpUser || '',
          smtpPass: data.settings.smtpPass || '',
          activeTemplate: data.settings.activeTemplate || 'default',
        });
      }
    } catch (e) {
      console.error('Settings fetch error:', e);
    }
    setSettingsLoading(false);
  }, []);

  const fetchWooImports = useCallback(async () => {
    setWooImportsLoading(true);
    try {
      const res = await fetch('/api/woocommerce/import');
      const data = await res.json();
      if (data.success) setWooImports(data.imports);
    } catch (e) {
      console.error('WooCommerce imports fetch error:', e);
    }
    setWooImportsLoading(false);
  }, []);

  const fetchMedia = useCallback(async () => {
    setMediaLoading(true);
    try {
      const params = new URLSearchParams();
      if (mediaFolderFilter) params.set('folder', mediaFolderFilter);
      if (mediaSourceFilter) params.set('source', mediaSourceFilter);
      const res = await fetch(`/api/media?${params}`);
      const data = await res.json();
      if (data.success) setMediaFiles(data.files);
    } catch (e) {
      console.error('Media fetch error:', e);
    }
    setMediaLoading(false);
  }, [mediaFolderFilter, mediaSourceFilter]);

  // Initial load & section-specific data fetching
  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  useEffect(() => {
    if (activeSection === 'products') { fetchProducts(); }
  }, [activeSection, fetchProducts]);

  useEffect(() => {
    if (activeSection === 'orders') { fetchOrders(); }
  }, [activeSection, fetchOrders]);

  useEffect(() => {
    if (activeSection === 'customers') { fetchCustomers(); }
  }, [activeSection, fetchCustomers]);

  useEffect(() => {
    if (activeSection === 'users') { fetchUsers(); }
  }, [activeSection, fetchUsers]);

  useEffect(() => {
    if (activeSection === 'settings') { fetchSettings(); }
  }, [activeSection, fetchSettings]);

  useEffect(() => {
    if (activeSection === 'woocommerce') { fetchWooImports(); }
  }, [activeSection, fetchWooImports]);

  useEffect(() => {
    if (activeSection === 'media') { fetchMedia(); }
  }, [activeSection, fetchMedia]);

  // ============================================================
  // New Order Notification Polling
  // ============================================================

  const checkForNewOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders?limit=1');
      const data = await res.json();
      if (data.orders && data.orders.length > 0) {
        const latestOrder = data.orders[0];
        if (lastKnownOrderId && latestOrder.id !== lastKnownOrderId) {
          setNewOrderNotification({
            id: latestOrder.id,
            orderNumber: latestOrder.orderNumber,
            customerName: latestOrder.customerName,
            customerEmail: latestOrder.customerEmail,
            total: latestOrder.total,
            itemsCount: latestOrder.items?.length || 0,
            createdAt: latestOrder.createdAt,
            status: latestOrder.status,
          });
          setUnseenOrdersCount((prev) => prev + 1);
          // Also refresh dashboard and orders
          fetchDashboard();
          if (activeSection === 'orders') fetchOrders();
        }
        setLastKnownOrderId(latestOrder.id);
      }
    } catch {
      // Silently fail — don't disrupt the admin
    }
  }, [lastKnownOrderId, activeSection, fetchDashboard, fetchOrders]);

  // Initial lastKnownOrderId and polling setup
  useEffect(() => {
    // Get initial order ID (don't show notification for existing orders)
    const initOrderId = async () => {
      try {
        const res = await fetch('/api/orders?limit=1');
        const data = await res.json();
        if (data.orders && data.orders.length > 0) {
          setLastKnownOrderId(data.orders[0].id);
        }
      } catch { /* skip */ }
    };
    initOrderId();

    // Poll every 30 seconds
    const pollInterval = setInterval(checkForNewOrders, 30000);
    return () => clearInterval(pollInterval);
  }, []); // Polling should only be set up once on mount

  const dismissNotification = useCallback(() => {
    setNewOrderNotification(null);
    setUnseenOrdersCount(0);
  }, []);

  const handleViewNewOrder = useCallback(() => {
    if (!newOrderNotification) return;
    setNewOrderNotification(null);
    setUnseenOrdersCount(0);
    // Navigate to orders section
    setActiveSection('orders');
  }, [newOrderNotification]);

  // ============================================================
  // Product Handlers
  // ============================================================

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      const imgs = parseJson<string[]>(product.images, []);
      setProductImages(imgs.length ? imgs : (product.image ? [product.image] : []));
      setProductForm({
        name: product.name,
        brand: product.brand,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        category: product.category,
        subcategory: product.subcategory,
        description: product.description,
        shortDescription: product.shortDescription || '',
        sku: product.sku,
        stockCount: product.stockCount.toString(),
        tags: parseJson<string[]>(product.tags, []).join(', '),
        inStock: product.inStock,
        isNew: product.isNew,
        isTrending: product.isTrending,
        isBestseller: product.isBestseller,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        seoTitle: product.seoTitle || '',
        seoDescription: product.seoDescription || '',
      });
    } else {
      setEditingProduct(null);
      setProductImages([]);
      setProductForm({
        name: '', brand: '', price: '', originalPrice: '', category: '', subcategory: '',
        description: '', shortDescription: '', sku: '', stockCount: '100', tags: '',
        inStock: true, isNew: false, isTrending: false, isBestseller: false,
        isFeatured: false, isActive: true, seoTitle: '', seoDescription: '',
      });
    }
    setProductModalOpen(true);
  };

  const saveProduct = async () => {
    if (imageUploading) {
      alert('Veuillez attendre la fin du téléchargement des images.');
      return;
    }
    setProductSaving(true);
    try {
      const tagsArray = productForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const body = {
        ...productForm,
        price: parseFloat(productForm.price) || 0,
        originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
        stockCount: parseInt(productForm.stockCount) || 0,
        tags: tagsArray,
        images: productImages,
        image: productImages[0] || '',
      };

      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      const data = await res.json();
      if (data.success) {
        setProductModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
        fetchDashboard();
      } else {
        alert('Erreur: ' + (data.error || 'Échec de la sauvegarde'));
      }
    } catch (e) {
      console.error('Save product error:', e);
      alert('Erreur réseau lors de la sauvegarde.');
    }
    setProductSaving(false);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        fetchDashboard();
      }
    } catch (e) {
      console.error('Delete product error:', e);
    }
  };

  const toggleProductActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      const data = await res.json();
      if (data.success) fetchProducts();
    } catch (e) {
      console.error('Toggle product active error:', e);
    }
  };

  const uploadProductImage = async (file: File, productId?: string) => {
    setImageUploading(true);
    try {
      const targetId = editingProduct?.id || productId;
      if (targetId) {
        // Upload to existing product via product API
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch(`/api/products/${targetId}/images`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.imageUrl) {
          setProductImages((prev) => [...prev, data.imageUrl]);
        }
      } else {
        // Upload via media API for new products
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'products');
        const res = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.file?.url) {
          setProductImages((prev) => [...prev, data.file.url]);
        }
      }
    } catch (e) {
      console.error('Upload image error:', e);
    }
    setImageUploading(false);
  };

  const removeImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ============================================================
  // Order Handlers
  // ============================================================

  const openOrderDetail = async (order: Order) => {
    try {
      const res = await fetch(`/api/orders/${order.id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.order);
        setTrackingCarrier(data.order.shippingCarrier || '');
        setTrackingNumber(data.order.trackingNumber || '');
        setGeneratedTrackingUrl(data.order.trackingUrl || '');
        setOrderDetailOpen(true);
      }
    } catch (e) {
      console.error('Order detail error:', e);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setOrderSaving(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success && selectedOrder) {
        setSelectedOrder({ ...selectedOrder, ...data.order, status });
        fetchOrders();
        fetchDashboard();
      }
    } catch (e) {
      console.error('Update order status error:', e);
    }
    setOrderSaving(false);
  };

  const saveTracking = async () => {
    if (!selectedOrder) return;
    setOrderSaving(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingCarrier: trackingCarrier || null,
          trackingNumber: trackingNumber || null,
          trackingUrl: generatedTrackingUrl || null,
        }),
      });
      const data = await res.json();
      if (data.success && selectedOrder) {
        setSelectedOrder({
          ...selectedOrder,
          shippingCarrier: trackingCarrier,
          trackingNumber,
          trackingUrl: generatedTrackingUrl,
        });
      }
    } catch (e) {
      console.error('Save tracking error:', e);
    }
    setOrderSaving(false);
  };

  const generateTrackingUrl = () => {
    if (!trackingNumber) return;
    const carrier = trackingCarrier.toLowerCase();
    let url = '';
    if (carrier === 'colissimo') {
      url = `https://www.colissimo.fr/portal/page/redirect?trackingNumber=${encodeURIComponent(trackingNumber)}`;
    } else if (carrier === 'chronopost') {
      url = `https://www.chronopost.fr/tracking-no-cms/suivi-page?lang=en&listNumber=${encodeURIComponent(trackingNumber)}`;
    }
    setGeneratedTrackingUrl(url);
  };

  const openCreateOrder = async () => {
    setCreateOrderItems([]);
    setCreateOrderForm({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      shippingAddress: '',
      shippingCity: '',
      shippingPostalCode: '',
      shippingCountry: 'France',
      paymentMethod: 'card',
      paymentStatus: 'pending',
      status: 'processing',
      notes: '',
    });
    // Fetch products for the selector
    try {
      const res = await fetch('/api/products?limit=100&admin=true');
      const data = await res.json();
      if (data.products) setCreateOrderProducts(data.products);
    } catch (e) {
      console.error('Fetch products for create order error:', e);
    }
    setCreateOrderOpen(true);
  };

  const addCreateOrderItem = (productId: string) => {
    const existing = createOrderItems.find((item) => item.productId === productId);
    if (existing) return; // already added
    setCreateOrderItems((prev) => [...prev, { productId, quantity: 1 }]);
  };

  const removeCreateOrderItem = (productId: string) => {
    setCreateOrderItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCreateOrderItemQty = (productId: string, quantity: number) => {
    setCreateOrderItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  };

  const getCreateOrderTotals = () => {
    let subtotal = 0;
    createOrderItems.forEach((item) => {
      const product = createOrderProducts.find((p) => p.id === item.productId);
      if (product) subtotal += product.price * item.quantity;
    });
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.2;
    const total = subtotal + shippingCost + tax;
    return { subtotal, shippingCost, tax, total };
  };

  const handleCreateOrder = async () => {
    if (!createOrderForm.customerName || !createOrderForm.customerEmail) {
      alert('Le nom et l\'e-mail du client sont requis.');
      return;
    }
    if (createOrderItems.length === 0) {
      alert('Ajoutez au moins un article à la commande.');
      return;
    }
    if (!createOrderForm.shippingAddress || !createOrderForm.shippingCity || !createOrderForm.shippingPostalCode) {
      alert('L\'adresse de livraison est requise (adresse, ville, code postal).');
      return;
    }

    setOrderCreating(true);
    try {
      const shippingAddress = JSON.stringify({
        address1: createOrderForm.shippingAddress,
        city: createOrderForm.shippingCity,
        postalCode: createOrderForm.shippingPostalCode,
        country: createOrderForm.shippingCountry,
      });

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: createOrderItems,
          customerName: createOrderForm.customerName,
          customerEmail: createOrderForm.customerEmail,
          customerPhone: createOrderForm.customerPhone,
          shippingAddress,
          paymentMethod: createOrderForm.paymentMethod,
          paymentStatus: createOrderForm.paymentStatus,
          status: createOrderForm.status,
          notes: createOrderForm.notes || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreateOrderOpen(false);
        fetchOrders();
        fetchDashboard();
      } else {
        alert(data.error || 'Échec de la création de la commande.');
      }
    } catch (e) {
      console.error('Create order error:', e);
    }
    setOrderCreating(false);
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setOrderDetailOpen(false);
        setSelectedOrder(null);
        fetchOrders();
        fetchDashboard();
      } else {
        alert(data.error || 'Échec de la suppression.');
      }
    } catch (e) {
      console.error('Delete order error:', e);
    }
  };

  const saveOrderNotes = async () => {
    if (!selectedOrder) return;
    setOrderSaving(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: selectedOrder.notes }),
      });
      await res.json();
    } catch (e) {
      console.error('Save order notes error:', e);
    }
    setOrderSaving(false);
  };

  // ============================================================
  // Customer Handlers
  // ============================================================

  const openCustomerDetail = async (customer: CustomerUser) => {
    try {
      const res = await fetch(`/api/users/${customer.id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedCustomer(data.user);
        setCustomerDetailOpen(true);
      }
    } catch (e) {
      console.error('Customer detail error:', e);
    }
  };

  const openCreateCustomerModal = () => {
    setCustomerForm({ name: '', email: '', password: '', phone: '', role: 'customer' });
    setCustomerModalOpen(true);
  };

  const createCustomer = async () => {
    if (!customerForm.email || !customerForm.password) {
      alert('E-mail et mot de passe sont requis.');
      return;
    }
    setCustomerCreating(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerForm),
      });
      const data = await res.json();
      if (data.success) {
        setCustomerModalOpen(false);
        fetchCustomers();
        fetchDashboard();
      } else {
        alert(data.error || "Échec de la création de la cliente.");
      }
    } catch (e) {
      console.error('Create customer error:', e);
    }
    setCustomerCreating(false);
  };

  const deleteCustomer = async (customerId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette cliente ? Elle sera désactivée.')) return;
    try {
      const res = await fetch(`/api/users/${customerId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCustomerDetailOpen(false);
        setSelectedCustomer(null);
        fetchCustomers();
        fetchDashboard();
      } else {
        alert(data.error || 'Échec de la suppression.');
      }
    } catch (e) {
      console.error('Delete customer error:', e);
    }
  };

  const sendNotification = async (orderId: string, type: string) => {
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, type }),
      });
      alert('Notification envoyée avec succès (enregistrée).');
    } catch (e) {
      console.error('Send notification error:', e);
    }
  };

  // ============================================================
  // User Handlers
  // ============================================================

  const openUserModal = (user?: CustomerUser) => {
    if (user) {
      setEditingUser(user);
      setUserForm({ name: user.name || '', email: user.email, password: '', role: user.role });
    } else {
      setEditingUser(null);
      setUserForm({ name: '', email: '', password: '', role: 'customer' });
    }
    setUserModalOpen(true);
  };

  const saveUser = async () => {
    setUserSaving(true);
    try {
      if (editingUser) {
        const body: Record<string, string> = { name: userForm.name, email: userForm.email, role: userForm.role };
        if (userForm.password) body.password = userForm.password;
        const res = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success) {
          setUserModalOpen(false);
          fetchUsers();
          fetchCustomers();
        }
      } else {
        if (!userForm.email || !userForm.password) {
          alert('E-mail et mot de passe requis.');
          setUserSaving(false);
          return;
        }
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userForm),
        });
        const data = await res.json();
        if (data.success) {
          setUserModalOpen(false);
          fetchUsers();
          fetchCustomers();
        } else {
          alert(data.error || 'Échec de la création de l\'utilisateur.');
        }
      }
    } catch (e) {
      console.error('Save user error:', e);
    }
    setUserSaving(false);
  };

  const toggleUserActive = async (user: CustomerUser) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      const data = await res.json();
      if (data.success) fetchUsers();
    } catch (e) {
      console.error('Toggle user active error:', e);
    }
  };

  // ============================================================
  // Settings Handlers
  // ============================================================

  const saveSettings = async () => {
    setSettingsSaving(true);
    try {
      const body = { ...settingsForm };
      if (body.smtpPort) body.smtpPort = parseInt(body.smtpPort);
      else body.smtpPort = null;
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) alert('Paramètres enregistrés avec succès !');
    } catch (e) {
      console.error('Save settings error:', e);
    }
    setSettingsSaving(false);
  };

  // ============================================================
  // WooCommerce Handlers
  // ============================================================

  const importWooProducts = async () => {
    let products = [];
    if (wooUrl) {
      try {
        // Attempt to fetch products from WooCommerce REST API
        const url = wooUrl.replace(/\/$/, '');
        const apiUrl = `${url}/wp-json/wc/v3/products?per_page=20`;
        const res = await fetch(apiUrl);
        if (res.ok) {
          products = await res.json();
        } else {
          alert('Impossible de récupérer les produits depuis l\'URL. Vérifiez que l\'API REST WooCommerce est accessible. Essayez l\'import manuel.');
          return;
        }
      } catch {
        alert('Échec de la connexion au site WooCommerce. Essayez l\'import manuel.');
        return;
      }
    } else if (wooJson) {
      try {
        products = JSON.parse(wooJson);
        if (!Array.isArray(products)) {
          alert('Le JSON doit être un tableau de produits.');
          return;
        }
      } catch {
        alert('Format JSON invalide.');
        return;
      }
    } else {
      alert('Veuillez entrer une URL ou coller des données JSON.');
      return;
    }

    setWooImporting(true);
    try {
      const res = await fetch('/api/woocommerce/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products, url: wooUrl || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`${data.imported} produits importés. ${data.errors} erreurs.`);
        setWooUrl('');
        setWooJson('');
        fetchWooImports();
        fetchProducts();
        fetchDashboard();
      } else {
        alert(data.error || 'Échec de l\'import.');
      }
    } catch (e) {
      console.error('WooCommerce import error:', e);
    }
    setWooImporting(false);
  };

  // CSV Import Handler
  const handleCsvFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setWooCsvFile(file);
    setCsvPreview(null);
    e.target.value = '';

    // Preview: read and parse CSV to show count
    try {
      const text = await file.text();
      const Papa = (await import('papaparse')).default;
      const result = Papa.parse(text.trim(), {
        header: true,
        skipEmptyLines: true,
      });
      const variationCount = result.data.filter(
        (row: Record<string, string>) => {
          const type = (row['Type'] || row.type || 'simple').toString().trim().toLowerCase();
          return type === 'variation';
        }
      ).length;
      setCsvPreview({
        products: result.data.length - variationCount,
        skipped: variationCount,
        total: result.data.length,
      });
    } catch {
      setCsvPreview(null);
    }
  };

  const importWooCsv = async () => {
    if (!wooCsvFile) {
      alert('Veuillez sélectionner un fichier CSV.');
      return;
    }
    setWooImporting(true);
    try {
      const text = await wooCsvFile.text();
      const res = await fetch('/api/woocommerce/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: text }),
      });
      const data = await res.json();
      if (data.success) {
        const msg = `${data.imported} produits importés sur ${data.total} lignes (${data.skipped} variations ignorées). ${data.errors} erreurs.`;
        if (data.importErrors?.length > 0) {
          alert(msg + '\n\nErreurs:\n' + data.importErrors.join('\n'));
        } else {
          alert(msg);
        }
        setWooCsvFile(null);
        setCsvPreview(null);
        fetchWooImports();
        fetchProducts();
        fetchDashboard();
      } else {
        alert(data.error || "Échec de l'import.");
      }
    } catch (e) {
      console.error('WooCommerce CSV import error:', e);
      alert("Erreur lors de l'import CSV.");
    }
    setWooImporting(false);
  };

  // ============================================================
  // Media Handlers
  // ============================================================

  const MEDIA_SOURCES = [
    { key: '', label: 'Tous les médias' },
    { key: 'upload', label: 'Uploads' },
    { key: 'images', label: 'Images statiques' },
    { key: 'product', label: 'Produits importés' },
  ];
  const MEDIA_FOLDERS = ['all', 'products', 'banners', 'categories', 'general'];

  const uploadMediaFile = async (file: File) => {
    setMediaUploading(true);
    setMediaUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', mediaFolderFilter || 'general');

      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setMediaUploadProgress((prev) => Math.min(prev + 15, 90));
      }, 200);

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setMediaUploadProgress(100);

      const data = await res.json();
      if (data.success) {
        fetchMedia();
      } else {
        alert(data.error || 'Upload failed.');
      }
    } catch (e) {
      console.error('Media upload error:', e);
    }
    setTimeout(() => {
      setMediaUploading(false);
      setMediaUploadProgress(0);
    }, 300);
  };

  const deleteMediaFile = async (url: string) => {
    if (!confirm('Supprimer ce fichier ?')) return;
    try {
      const res = await fetch(`/api/media?url=${encodeURIComponent(url)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchMedia();
      } else {
        alert(data.error || 'Échec de la suppression.');
      }
    } catch (e) {
      console.error('Media delete error:', e);
    }
  };

  const copyMediaUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copiée !');
    }).catch(() => {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      alert('URL copiée !');
    });
  };

  const openMediaPreview = (file: MediaFileItem) => {
    setMediaPreviewUrl(file.url);
    setMediaPreviewName(file.name);
    setMediaPreviewOpen(true);
  };

  // ============================================================
  // Render sections
  // ============================================================

  const handleNavClick = (section: Section) => {
    setActiveSection(section);
    setSidebarOpen(false);
    // Clear notification count when viewing orders
    if (section === 'orders') {
      setUnseenOrdersCount(0);
    }
  };

  // ------ DASHBOARD OVERVIEW ------
  const renderDashboard = () => {
    if (dashboardLoading) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-lg" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Vue d'ensemble</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Chiffre d'affaires</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
              <p className="text-xs text-muted-foreground">Commandes livrées</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
              <div className="flex gap-1 flex-wrap mt-1">
                {statusBreakdown.slice(0, 3).map((s) => (
                  <Badge key={s.status} variant="secondary" className="text-xs">
                    {s.status}: {s.count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Produits Actifs</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeProducts || 0}</div>
              <p className="text-xs text-muted-foreground">sur {stats?.totalProducts || 0} au total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
              <p className="text-xs text-muted-foreground">clientes inscrites</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Commandes Récentes</CardTitle>
              <CardDescription>5 dernières commandes</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Aucune commande</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Commande</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell><StatusBadge status={order.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Low Stock */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Produits en Stock Faible
              </CardTitle>
              <CardDescription>Produits avec moins de 10 en stock</CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Tous les produits sont bien approvisionnés</p>
              ) : (
                <ScrollArea className="max-h-72">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Marque</TableHead>
                        <TableHead>Stock</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowStockProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium max-w-[180px] truncate">{product.name}</TableCell>
                          <TableCell>{product.brand}</TableCell>
                          <TableCell>
                            <Badge variant={product.stockCount === 0 ? 'destructive' : 'secondary'}>
                              {product.stockCount}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ------ PRODUCTS MANAGEMENT ------
  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Produits</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" /> Importer
          </Button>
          <Button onClick={() => openProductModal()}>
            <Plus className="h-4 w-4 mr-2" /> Ajouter un Produit
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des produits..."
            className="pl-9"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
        </div>
        <Select value={productCategoryFilter} onValueChange={(v) => setProductCategoryFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Toutes les Catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Toutes les Catégories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {productsLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">Aucun produit trouvé</p>
          ) : (
            <ScrollArea className="max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Image</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Marque</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const imgs = parseJson<string[]>(product.images, []);
                    const thumb = imgs[0] || product.image;
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          {thumb ? (
                            <img src={thumb} alt={product.name} className="h-10 w-10 rounded object-cover bg-muted" />
                          ) : (
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium max-w-[200px] truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.sku}</p>
                          </div>
                        </TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">{formatCurrency(product.price)}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="ml-2 text-xs text-muted-foreground line-through">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.stockCount < 10 ? 'destructive' : 'secondary'}>
                            {product.stockCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {!product.isActive && <Badge variant="destructive">Inactif</Badge>}
                            {product.isNew && <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Nouveau</Badge>}
                            {product.isTrending && <Badge className="bg-rose-100 text-rose-800 border-rose-200">Tendance</Badge>}
                            {product.isBestseller && <Badge className="bg-violet-100 text-violet-800 border-violet-200">Meilleure vente</Badge>}
                            {product.isActive && !product.isNew && !product.isTrending && !product.isBestseller && (
                              <Badge variant="secondary">Actif</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openProductModal(product)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteProduct(product.id)}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => toggleProductActive(product)}>
                              {product.isActive ? (
                                <Eye className="h-3.5 w-3.5" />
                              ) : (
                                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // ------ ORDERS MANAGEMENT ------
  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Commandes</h2>
        <Button onClick={openCreateOrder}>
          <Plus className="h-4 w-4 mr-2" /> Nouvelle Commande
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par n° ou cliente..."
            className="pl-9"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', 'processing', 'validated', 'in_progress', 'shipped', 'delivered', 'cancelled'].map((s) => (
            <Button
              key={s}
              variant={orderStatusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setOrderStatusFilter(s)}
            >
              {s ? STATUS_LABELS[s] : 'Tous'}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {ordersLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">Aucune commande trouvée</p>
          ) : (
            <ScrollArea className="max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Commande</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Paiement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{order.items?.length || 0}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                      <TableCell><StatusBadge status={order.status} /></TableCell>
                      <TableCell>
                        <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openOrderDetail(order)}>
                          <Eye className="h-3.5 w-3.5 mr-1" /> Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Commande {selectedOrder.orderNumber}</DialogTitle>
                <DialogDescription>
                  Créée le {formatDateTime(selectedOrder.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status & Customer Info */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">Statut de la Commande</Label>
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(v) => updateOrderStatus(selectedOrder.id, v)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Cliente</Label>
                    <div className="mt-1 text-sm">
                      <p className="font-medium">{selectedOrder.customerName}</p>
                      <p className="text-muted-foreground">{selectedOrder.customerEmail}</p>
                      {selectedOrder.customerPhone && <p>{selectedOrder.customerPhone}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> Adresse de Livraison
                  </Label>
                  <div className="mt-1 text-sm bg-muted/50 rounded-md p-3">
                    {(() => {
                      try {
                        const addr = JSON.parse(selectedOrder.shippingAddress);
                        return (
                          <div>
                            <p>{addr.firstName} {addr.lastName}</p>
                            {addr.address1 && <p>{addr.address1}</p>}
                            {addr.address2 && <p>{addr.address2}</p>}
                            <p>{addr.postalCode} {addr.city}, {addr.state && `${addr.state}, `}{addr.country}</p>
                          </div>
                        );
                      } catch {
                        return <p>{selectedOrder.shippingAddress}</p>;
                      }
                    })()}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <Label className="text-sm font-medium">Articles de la Commande</Label>
                  <div className="mt-2 space-y-2">
                    {(selectedOrder.items || []).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-muted/30 rounded-md p-2">
                        {item.productImage && (
                          <img src={item.productImage} alt={item.productName} className="h-12 w-12 rounded object-cover" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.brand} &middot; Qté : {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(item.price)}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(item.total)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-muted/30 rounded-md p-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>{selectedOrder.shippingCost === 0 ? 'Gratuite' : formatCurrency(selectedOrder.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA (20%)</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5" /> Paiement
                  </Label>
                  <div className="mt-1 text-sm">
                    <p>Méthode : <span className="capitalize">{selectedOrder.paymentMethod || 'N/A'}</span></p>
                    <p>Statut : <Badge variant={selectedOrder.paymentStatus === 'paid' ? 'default' : 'secondary'}>{selectedOrder.paymentStatus}</Badge></p>
                    {selectedOrder.paymentId && <p className="text-xs text-muted-foreground">ID: {selectedOrder.paymentId}</p>}
                  </div>
                </div>

                <Separator />

                {/* Delivery Tracking */}
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5" /> Suivi de Livraison
                  </Label>
                  <div className="mt-2 space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <Label className="text-xs">Transporteur</Label>
                        <Select value={trackingCarrier} onValueChange={setTrackingCarrier}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Sélectionner le transporteur" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="colissimo">Colissimo</SelectItem>
                            <SelectItem value="chronopost">Chronopost</SelectItem>
                            <SelectItem value="__none__">Aucun</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Numéro de Suivi</Label>
                        <Input
                          className="mt-1"
                          placeholder="Entrez le numéro de suivi"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={generateTrackingUrl}>
                        <Globe className="h-3.5 w-3.5 mr-1" /> Générer le Lien de Suivi
                      </Button>
                      <Button size="sm" onClick={saveTracking} disabled={orderSaving}>
                        <Save className="h-3.5 w-3.5 mr-1" /> Enregistrer le Suivi
                      </Button>
                    </div>
                    {generatedTrackingUrl && (
                      <div className="bg-muted/50 rounded-md p-2">
                        <p className="text-xs text-muted-foreground mb-1">Lien de Suivi :</p>
                        <a
                          href={generatedTrackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline break-all"
                        >
                          {generatedTrackingUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <Label className="text-sm font-medium">Notes de la Commande</Label>
                  <Textarea
                    className="mt-1"
                    rows={3}
                    placeholder="Notes internes..."
                    value={selectedOrder.notes || ''}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, notes: e.target.value })}
                    onBlur={saveOrderNotes}
                  />
                </div>

                {/* Timeline */}
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Chronologie de la Commande
                  </Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Commande créée</span>
                      <span className="text-muted-foreground ml-auto">{formatDateTime(selectedOrder.createdAt)}</span>
                    </div>
                    {selectedOrder.shippedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4 text-purple-500" />
                        <span>Commande expédiée</span>
                        <span className="text-muted-foreground ml-auto">{formatDateTime(selectedOrder.shippedAt)}</span>
                      </div>
                    )}
                    {selectedOrder.deliveredAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Commande livrée</span>
                        <span className="text-muted-foreground ml-auto">{formatDateTime(selectedOrder.deliveredAt)}</span>
                      </div>
                    )}
                    {selectedOrder.status === 'cancelled' && (
                      <div className="flex items-center gap-2 text-sm">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>Commande annulée</span>
                        <span className="text-muted-foreground ml-auto">{formatDateTime(selectedOrder.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Send Notification */}
                <Separator />
                <div>
                  <Label className="text-sm font-medium">Envoyer une Notification</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendNotification(selectedOrder.id, 'order_confirmed')}
                    >
                      <Send className="h-3.5 w-3.5 mr-1" /> Confirmation
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendNotification(selectedOrder.id, 'order_shipped')}
                    >
                      <Truck className="h-3.5 w-3.5 mr-1" /> Expédiée
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendNotification(selectedOrder.id, 'order_delivered')}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Livrée
                    </Button>
                  </div>
                </div>

                {/* Delete Order */}
                <Separator />
                <div className="pt-2">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => deleteOrder(selectedOrder.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Supprimer cette commande
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog open={createOrderOpen} onOpenChange={setCreateOrderOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle Commande</DialogTitle>
            <DialogDescription>Créer une commande manuellement pour une cliente</DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[65vh] pl-0 pr-1">
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Informations Cliente</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="coName">Nom *</Label>
                    <Input
                      id="coName"
                      value={createOrderForm.customerName}
                      onChange={(e) => setCreateOrderForm({ ...createOrderForm, customerName: e.target.value })}
                      placeholder="Nom de la cliente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="coEmail">E-mail *</Label>
                    <Input
                      id="coEmail"
                      type="email"
                      value={createOrderForm.customerEmail}
                      onChange={(e) => setCreateOrderForm({ ...createOrderForm, customerEmail: e.target.value })}
                      placeholder="cliente@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="coPhone">Téléphone</Label>
                    <Input
                      id="coPhone"
                      value={createOrderForm.customerPhone}
                      onChange={(e) => setCreateOrderForm({ ...createOrderForm, customerPhone: e.target.value })}
                      placeholder="+33 6 00 00 00 00"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Adresse de Livraison</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="coAddr">Adresse *</Label>
                    <Input
                      id="coAddr"
                      value={createOrderForm.shippingAddress}
                      onChange={(e) => setCreateOrderForm({ ...createOrderForm, shippingAddress: e.target.value })}
                      placeholder="12 Rue de la Paix"
                    />
                  </div>
                  <div>
                    <Label htmlFor="coCity">Ville *</Label>
                    <Input
                      id="coCity"
                      value={createOrderForm.shippingCity}
                      onChange={(e) => setCreateOrderForm({ ...createOrderForm, shippingCity: e.target.value })}
                      placeholder="Paris"
                    />
                  </div>
                  <div>
                    <Label htmlFor="coZip">Code Postal *</Label>
                    <Input
                      id="coZip"
                      value={createOrderForm.shippingPostalCode}
                      onChange={(e) => setCreateOrderForm({ ...createOrderForm, shippingPostalCode: e.target.value })}
                      placeholder="75001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="coCountry">Pays</Label>
                    <Input
                      id="coCountry"
                      value={createOrderForm.shippingCountry}
                      onChange={(e) => setCreateOrderForm({ ...createOrderForm, shippingCountry: e.target.value })}
                      placeholder="France"
                    />
                  </div>
                </div>
              </div>

              {/* Product Selector */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Articles</h4>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label>Ajouter un produit</Label>
                    <Select onValueChange={(v) => addCreateOrderItem(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {createOrderProducts
                          .filter((p) => !createOrderItems.some((item) => item.productId === p.id))
                          .map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} — {formatCurrency(p.price)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {createOrderItems.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {createOrderItems.map((item) => {
                      const product = createOrderProducts.find((p) => p.id === item.productId);
                      if (!product) return null;
                      return (
                        <div key={item.productId} className="flex items-center gap-3 bg-muted/30 rounded-md p-3">
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover" />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{formatCurrency(product.price)} / unité</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateCreateOrderItemQty(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </Button>
                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateCreateOrderItemQty(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <span className="text-sm font-medium w-20 text-right">
                            {formatCurrency(product.price * item.quantity)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => removeCreateOrderItem(item.productId)}
                          >
                            <X className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {createOrderItems.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-3 text-center py-4">Aucun article ajouté</p>
                )}

                {/* Totals */}
                {createOrderItems.length > 0 && (() => {
                  const totals = getCreateOrderTotals();
                  return (
                    <div className="mt-4 bg-muted/30 rounded-md p-4 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Sous-total</span>
                        <span>{formatCurrency(totals.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Livraison</span>
                        <span>{totals.shippingCost === 0 ? 'Gratuite' : formatCurrency(totals.shippingCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TVA (20%)</span>
                        <span>{formatCurrency(totals.tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span>{formatCurrency(totals.total)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Payment & Status */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Paiement & Statut</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <Label>Méthode de paiement</Label>
                    <Select
                      value={createOrderForm.paymentMethod}
                      onValueChange={(v) => setCreateOrderForm({ ...createOrderForm, paymentMethod: v })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Carte</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="sumup">SumUp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Statut du paiement</Label>
                    <Select
                      value={createOrderForm.paymentStatus}
                      onValueChange={(v) => setCreateOrderForm({ ...createOrderForm, paymentStatus: v })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="paid">Payé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Statut de la commande</Label>
                    <Select
                      value={createOrderForm.status}
                      onValueChange={(v) => setCreateOrderForm({ ...createOrderForm, status: v })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="coNotes">Notes</Label>
                <Textarea
                  id="coNotes"
                  rows={3}
                  value={createOrderForm.notes}
                  onChange={(e) => setCreateOrderForm({ ...createOrderForm, notes: e.target.value })}
                  placeholder="Notes internes (optionnel)..."
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOrderOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateOrder} disabled={orderCreating}>
              {orderCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <ShoppingCart className="h-4 w-4 mr-2" />
              Créer la commande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  // ------ CUSTOMERS ------
  const renderCustomers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <Button onClick={openCreateCustomerModal}>
          <Plus className="h-4 w-4 mr-2" /> Ajouter une cliente
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {customersLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : customers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">Aucune cliente trouvée</p>
          ) : (
            <ScrollArea className="max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Commandes</TableHead>
                    <TableHead>Inscription</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name || '—'}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone || '—'}</TableCell>
                      <TableCell>{customer._count?.orders || 0}</TableCell>
                      <TableCell className="text-sm">{formatDate(customer.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={customer.isActive ? 'default' : 'secondary'}>
                          {customer.isActive ? 'Active' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openCustomerDetail(customer)}>
                          <Eye className="h-3.5 w-3.5 mr-1" /> Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={customerDetailOpen} onOpenChange={setCustomerDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCustomer.name || selectedCustomer.email}</DialogTitle>
                <DialogDescription>Cliente depuis le {formatDate(selectedCustomer.createdAt)}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">E-mail</p>
                    <p>{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Téléphone</p>
                    <p>{selectedCustomer.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rôle</p>
                    <Badge>{selectedCustomer.role}</Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Statut</p>
                    <Badge variant={selectedCustomer.isActive ? 'default' : 'secondary'}>
                      {selectedCustomer.isActive ? 'Active' : 'Inactif'}
                    </Badge>
                  </div>
                </div>

                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Historique des Commandes ({selectedCustomer.orders?.length || 0})</h4>
                  {(!selectedCustomer.orders || selectedCustomer.orders.length === 0) ? (
                    <p className="text-sm text-muted-foreground">Aucune commande</p>
                  ) : (
                    <ScrollArea className="max-h-60">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>N° Commande</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedCustomer.orders!.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.orderNumber}</TableCell>
                              <TableCell>{formatCurrency(order.total)}</TableCell>
                              <TableCell><StatusBadge status={order.status} /></TableCell>
                              <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                </div>

                <Separator />
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCustomer(selectedCustomer.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Supprimer cette cliente
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Customer Dialog */}
      <Dialog open={customerModalOpen} onOpenChange={setCustomerModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvelle Cliente</DialogTitle>
            <DialogDescription>Créer un compte cliente</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Nom</Label>
              <Input
                id="customer-name"
                placeholder="Nom complet (optionnel)"
                value={customerForm.name}
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-email">E-mail *</Label>
              <Input
                id="customer-email"
                type="email"
                placeholder="email@example.com"
                value={customerForm.email}
                onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-password">Mot de passe *</Label>
              <Input
                id="customer-password"
                type="password"
                placeholder="Mot de passe"
                value={customerForm.password}
                onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-phone">Téléphone</Label>
              <Input
                id="customer-phone"
                placeholder="+33 6 00 00 00 00"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-role">Rôle</Label>
              <Select
                value={customerForm.role}
                onValueChange={(value) => setCustomerForm({ ...customerForm, role: value })}
              >
                <SelectTrigger id="customer-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomerModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={createCustomer} disabled={customerCreating}>
              {customerCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Créer la cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  // ------ USERS MANAGEMENT ------
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Utilisateurs</h2>
        <Button onClick={() => openUserModal()}>
          <Plus className="h-4 w-4 mr-2" /> Ajouter un Utilisateur
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom ou e-mail..."
          className="pl-9"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {usersLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">Aucun utilisateur trouvé</p>
          ) : (
            <ScrollArea className="max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name || '—'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'destructive'}>
                          {user.isActive ? 'Active' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openUserModal(user)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => toggleUserActive(user)}>
                            <PowerIcon active={user.isActive} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* User Modal */}
      <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Modifier l'Utilisateur" : 'Nouvel Utilisateur'}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Mettre à jour les informations" : 'Créer un nouveau compte'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="userName">Nom</Label>
              <Input
                id="userName"
                placeholder="Nom complet"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="userEmail">E-mail</Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="user@example.com"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              />
            </div>
            {!editingUser && (
              <div>
                <Label htmlFor="userPassword">Mot de passe</Label>
                <Input
                  id="userPassword"
                  type="password"
                  placeholder="••••••••"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                />
              </div>
            )}
            {editingUser && (
              <div>
                <Label htmlFor="userNewPassword">Nouveau mot de passe (laisser vide pour conserver)</Label>
                <Input
                  id="userNewPassword"
                  type="password"
                  placeholder="••••••••"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                />
              </div>
            )}
            <div>
              <Label>Rôle</Label>
              <Select value={userForm.role} onValueChange={(v) => setUserForm({ ...userForm, role: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="customer">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserModalOpen(false)}>Annuler</Button>
            <Button onClick={saveUser} disabled={userSaving}>
              {userSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingUser ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  // ------ SETTINGS ------
  const [settingsTab, setSettingsTab] = useState<'site' | 'payment' | 'email' | 'template'>('site');
  
  const renderSettings = () => {
    if (settingsLoading) {
      return <div className="space-y-4">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>;
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold">Paramètres</h2>
          <Button onClick={saveSettings} disabled={settingsSaving}>
            {settingsSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" /> Enregistrer
          </Button>
        </div>

        {/* Settings Tabs */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={settingsTab === 'site' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSettingsTab('site')}
          >
            <Globe className="h-4 w-4 mr-2" />
            Site
          </Button>
          <Button
            variant={settingsTab === 'payment' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSettingsTab('payment')}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Paiement
          </Button>
          <Button
            variant={settingsTab === 'email' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSettingsTab('email')}
          >
            <Mail className="h-4 w-4 mr-2" />
            E-mail (SMTP)
          </Button>
          <Button
            variant={settingsTab === 'template' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSettingsTab('template')}
          >
            <Palette className="h-4 w-4 mr-2" />
            Template
          </Button>
        </div>

        {/* Site Settings Tab */}
        {settingsTab === 'site' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Paramètres du Site
              </CardTitle>
              <CardDescription>Informations générales et identité du site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="siteName">Nom du Site</Label>
                  <Input
                    id="siteName"
                    value={settingsForm.siteName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">E-mail de Contact</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="siteUrl">URL du Site</Label>
                <Input
                  id="siteUrl"
                  value={settingsForm.siteUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteUrl: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="siteDescription">Description du Site</Label>
                <Textarea
                  id="siteDescription"
                  rows={3}
                  value={settingsForm.siteDescription}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteDescription: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="ogImage">Image de partage (Open Graph)</Label>
                <Input
                  id="ogImage"
                  value={settingsForm.ogImage}
                  onChange={(e) => setSettingsForm({ ...settingsForm, ogImage: e.target.value })}
                  placeholder="URL de l'image affichée lors du partage sur les réseaux sociaux"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Settings Tab */}
        {settingsTab === 'payment' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Stripe
                </CardTitle>
                <CardDescription>Configuration de votre compte Stripe pour les paiements par carte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="stripeKey">Clé Publique Stripe</Label>
                  <Input
                    id="stripeKey"
                    value={settingsForm.stripeKey}
                    onChange={(e) => setSettingsForm({ ...settingsForm, stripeKey: e.target.value })}
                    placeholder="pk_..."
                  />
                </div>
                <div>
                  <Label htmlFor="stripeSecret">Clé Secrète Stripe</Label>
                  <Input
                    id="stripeSecret"
                    type="password"
                    value={settingsForm.stripeSecret}
                    onChange={(e) => setSettingsForm({ ...settingsForm, stripeSecret: e.target.value })}
                    placeholder="sk_..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  SumUp
                </CardTitle>
                <CardDescription>Configuration de votre compte SumUp pour les paiements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="sumupKey">Clé SumUp</Label>
                    <Input
                      id="sumupKey"
                      value={settingsForm.sumupKey}
                      onChange={(e) => setSettingsForm({ ...settingsForm, sumupKey: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sumUpMerchantId">ID Marchand SumUp</Label>
                    <Input
                      id="sumUpMerchantId"
                      value={settingsForm.sumUpMerchantId}
                      onChange={(e) => setSettingsForm({ ...settingsForm, sumUpMerchantId: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Email Settings Tab */}
        {settingsTab === 'email' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Paramètres E-mail (SMTP)
              </CardTitle>
              <CardDescription>Configuration du serveur d'envoi d'e-mails pour les notifications clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="smtpHost">Hôte SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={settingsForm.smtpHost}
                    onChange={(e) => setSettingsForm({ ...settingsForm, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">Port SMTP</Label>
                  <Input
                    id="smtpPort"
                    value={settingsForm.smtpPort}
                    onChange={(e) => setSettingsForm({ ...settingsForm, smtpPort: e.target.value })}
                    placeholder="587"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="smtpUser">Identifiant SMTP</Label>
                  <Input
                    id="smtpUser"
                    value={settingsForm.smtpUser}
                    onChange={(e) => setSettingsForm({ ...settingsForm, smtpUser: e.target.value })}
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPass">Mot de passe SMTP</Label>
                  <Input
                    id="smtpPass"
                    type="password"
                    value={settingsForm.smtpPass}
                    onChange={(e) => setSettingsForm({ ...settingsForm, smtpPass: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Template Settings Tab */}
        {settingsTab === 'template' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Thème du Site
              </CardTitle>
              <CardDescription>Choisissez le template de couleur pour votre boutique en ligne</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Default Template */}
                <div
                  onClick={() => setSettingsForm({ ...settingsForm, activeTemplate: 'default' })}
                  className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all hover:shadow-md ${
                    settingsForm.activeTemplate === 'default'
                      ? 'border-black bg-black/5 shadow-md'
                      : 'border-border hover:border-neutral-300'
                  }`}
                >
                  {settingsForm.activeTemplate === 'default' && (
                    <div className="absolute top-3 right-3 bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      Actif
                    </div>
                  )}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                        <Palette className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Original</h3>
                        <p className="text-xs text-muted-foreground">Template par défaut</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-black border border-neutral-300" />
                      <div className="w-6 h-6 rounded-full bg-white border border-neutral-300" />
                      <div className="w-6 h-6 rounded-full bg-neutral-950 border border-neutral-300" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Thème noir et blanc classique avec des accents sobres
                    </p>
                  </div>
                </div>

                {/* Gold Template */}
                <div
                  onClick={() => setSettingsForm({ ...settingsForm, activeTemplate: 'gold' })}
                  className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all hover:shadow-md ${
                    settingsForm.activeTemplate === 'gold'
                      ? 'border-[#bc8752] bg-[#bc8752]/5 shadow-md'
                      : 'border-border hover:border-[#bc8752]/50'
                  }`}
                >
                  {settingsForm.activeTemplate === 'gold' && (
                    <div className="absolute top-3 right-3 bg-[#bc8752] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      Actif
                    </div>
                  )}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#bc8752] flex items-center justify-center">
                        <Palette className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Gold</h3>
                        <p className="text-xs text-muted-foreground">Template doré élégant</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-[#bc8752] border border-neutral-300" />
                      <div className="w-6 h-6 rounded-full bg-white border border-neutral-300" />
                      <div className="w-6 h-6 rounded-full bg-[#bc8752]/80 border border-neutral-300" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Thème doré luxueux avec des accents élégants
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // ------ WOOCOMMERCE IMPORT ------
  const renderWooCommerce = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Import WooCommerce</h2>

      {/* CSV Import - Primary method */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Import CSV WooCommerce (Recommandé)
          </CardTitle>
          <CardDescription>
            Importez votre fichier d&apos;export WooCommerce (.csv). Supporte les colonnes en français et en anglais.
            Les variations sont automatiquement ignorées.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            onClick={() => document.getElementById('wooCsvInput')?.click()}
          >
            <input
              id="wooCsvInput"
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleCsvFileSelect}
            />
            {wooCsvFile ? (
              <div className="space-y-2">
                <FileSpreadsheet className="h-10 w-10 mx-auto text-primary" />
                <p className="font-medium text-sm">{wooCsvFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(wooCsvFile.size / 1024).toFixed(1)} Ko
                </p>
                {wooCsvPreview && (
                  <div className="mt-3 flex items-center justify-center gap-4 text-sm">
                    <span className="text-green-600 font-medium">
                      {wooCsvPreview.products} produits à importer
                    </span>
                    {wooCsvPreview.skipped > 0 && (
                      <span className="text-muted-foreground">
                        ({wooCsvPreview.skipped} variations ignorées)
                      </span>
                    )}
                    <span className="text-muted-foreground">
                      sur {wooCsvPreview.total} lignes
                    </span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">Cliquez pour changer de fichier</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="font-medium text-sm">Cliquez pour sélectionner votre fichier CSV</p>
                <p className="text-xs text-muted-foreground">
                  Export WooCommerce (.csv) — colonnes FR ou EN supportées
                </p>
              </div>
            )}
          </div>
          <Button
            onClick={importWooCsv}
            disabled={wooImporting || !wooCsvFile}
            size="lg"
          >
            {wooImporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 mr-2" />
            )}
            {wooImporting ? 'Import en cours...' : 'Importer le CSV'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* URL Import */}
        <Card>
          <CardHeader>
            <CardTitle>Importer depuis une URL</CardTitle>
            <CardDescription>Entrez l&apos;URL de votre site WooCommerce pour importer les produits via API REST</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="wooUrl">URL du Site WooCommerce</Label>
              <Input
                id="wooUrl"
                placeholder="https://your-store.com"
                value={wooUrl}
                onChange={(e) => setWooUrl(e.target.value)}
              />
            </div>
            <Button onClick={importWooProducts} disabled={wooImporting || !wooUrl}>
              {wooImporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Importer des Produits
            </Button>
          </CardContent>
        </Card>

        {/* Manual Import */}
        <Card>
          <CardHeader>
            <CardTitle>Import JSON Manuel</CardTitle>
            <CardDescription>Collez les données produits WooCommerce au format JSON</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="wooJson">Données JSON</Label>
              <Textarea
                id="wooJson"
                rows={8}
                placeholder='[{"name":"Product Name","price":"29.99","short_description":"Description...","images":[{"src":"https://..."}],"categories":[{"name":"Skincare"}],"sku":"SKU-001","stock_quantity":50}]'
                value={wooJson}
                onChange={(e) => setWooJson(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <Button onClick={importWooProducts} disabled={wooImporting || !wooJson}>
              {wooImporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileJson className="h-4 w-4 mr-2" />}
              Importer depuis JSON
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Import CSV (recommandé)
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Exportez vos produits depuis WooCommerce (WooCommerce &gt; Exporter)</li>
              <li>Les colonnes en français sont automatiquement reconnues (Nom, Tarif promo, Catégories, etc.)</li>
              <li>Les lignes de type &quot;variation&quot; sont ignorées (seuls les produits parents sont importés)</li>
              <li>Le HTML est nettoyé automatiquement des descriptions</li>
              <li>Les attributs (couleurs, tailles) sont ajoutés aux tags du produit</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Import JSON / URL
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>name</strong> — Nom du produit</li>
              <li><strong>price</strong> — Prix de vente (texte)</li>
              <li><strong>regular_price</strong> — Prix original pour l&apos;affichage de la réduction</li>
              <li><strong>images</strong> — Tableau d&apos;objets avec <code className="bg-muted px-1 rounded">{"{ src: 'url' }"}</code></li>
              <li><strong>categories</strong> — Tableau d&apos;objets avec <code className="bg-muted px-1 rounded">{"{ name: 'Catégorie' }"}</code></li>
              <li><strong>sku</strong> — SKU du produit</li>
              <li><strong>stock_quantity</strong> — Quantité en stock</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Imports</CardTitle>
          <CardDescription>Tentatives d'import récentes</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {wooImportsLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : wooImports.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Aucun import</p>
          ) : (
            <ScrollArea className="max-h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>ID Woo</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Erreur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wooImports.map((imp) => (
                    <TableRow key={imp.id}>
                      <TableCell className="text-sm">{formatDateTime(imp.createdAt)}</TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {imp.product?.name || '—'}
                      </TableCell>
                      <TableCell>{imp.wooId || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={imp.status === 'success' ? 'default' : 'destructive'}>
                          {imp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-destructive">
                        {imp.error || '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // ------ MEDIA LIBRARY ------
  const renderMedia = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Médias</h2>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*,video/mp4,video/webm,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadMediaFile(file);
                e.target.value = '';
              }}
            />
            <Button disabled={mediaUploading}>
              {mediaUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Uploader
            </Button>
          </label>
          <Button variant="outline" onClick={fetchMedia}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Rafraîchir
          </Button>
        </div>
      </div>

      {/* Upload progress */}
      {mediaUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Téléchargement en cours...</span>
            <span className="font-medium">{mediaUploadProgress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-600 rounded-full transition-all duration-200"
              style={{ width: `${mediaUploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Source filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {MEDIA_SOURCES.map((src) => (
          <Button
            key={src.key}
            variant={mediaSourceFilter === src.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMediaSourceFilter(src.key)}
          >
            {src.label}
          </Button>
        ))}
      </div>

      {/* Folder filter tabs */}
      {!mediaSourceFilter && (
        <div className="flex gap-2 flex-wrap">
          {MEDIA_FOLDERS.map((folder) => (
            <Button
              key={folder}
              variant={(mediaFolderFilter || 'all') === folder ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMediaFolderFilter(folder === 'all' ? '' : folder)}
            >
              {folder === 'all' ? 'Tous' : folder.charAt(0).toUpperCase() + folder.slice(1)}
            </Button>
          ))}
        </div>
      )}

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{mediaFiles.length} fichier{mediaFiles.length !== 1 ? 's' : ''}</span>
        {mediaFolderFilter && <Badge variant="secondary">{mediaFolderFilter}</Badge>}
      </div>

      {/* Media grid */}
      <Card>
        <CardContent className="p-4">
          {mediaLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : mediaFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium">Aucun média</p>
              <p className="text-sm text-muted-foreground mt-1">
                Uploadez vos images dans les dossiers ci-dessus
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {mediaFiles.map((file) => (
                <div
                  key={file.url}
                  className="group relative aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => openMediaPreview(file)}
                >
                  <img
                    src={file.url}
                    alt={file.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyMediaUrl(file.url);
                        }}
                        className="h-7 w-7 rounded-md bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                        title="Copier l'URL"
                      >
                        <Eye className="h-3.5 w-3.5 text-gray-700" />
                      </button>
                      {file.source !== 'product' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMediaFile(file.url);
                          }}
                          className="h-7 w-7 rounded-md bg-red-500/90 flex items-center justify-center hover:bg-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-white" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-white/90 truncate">{file.name}</p>
                      <p className="text-[10px] text-white/60">{file.sizeFormatted}</p>
                    </div>
                  </div>
                  {/* Source badge */}
                  <Badge
                    className={`absolute top-1.5 left-1.5 text-[9px] px-1.5 py-0 opacity-90 ${
                      file.source === 'product'
                        ? 'bg-orange-100 text-orange-800 border-orange-200'
                        : file.source === 'images'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {file.source === 'product' ? '📦 Import' : file.source === 'images' ? '🖼️ Statique' : '📤 Upload'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Preview Dialog */}
      <Dialog open={mediaPreviewOpen} onOpenChange={setMediaPreviewOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{mediaPreviewName}</DialogTitle>
            <DialogDescription>
              {mediaFiles.find((f) => f.url === mediaPreviewUrl)?.url}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-center bg-muted rounded-lg overflow-hidden min-h-[300px]">
              <img
                src={mediaPreviewUrl}
                alt={mediaPreviewName}
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>
            {mediaFiles.find((f) => f.url === mediaPreviewUrl) && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Dossier</p>
                  <p className="font-medium">{mediaFiles.find((f) => f.url === mediaPreviewUrl)?.folder}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Taille</p>
                  <p className="font-medium">{mediaFiles.find((f) => f.url === mediaPreviewUrl)?.sizeFormatted}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">{mediaFiles.find((f) => f.url === mediaPreviewUrl)?.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Modifié</p>
                  <p className="font-medium">{formatDate(mediaFiles.find((f) => f.url === mediaPreviewUrl)?.lastModified || '')}</p>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => copyMediaUrl(mediaPreviewUrl)}
              >
                Copier l'URL
              </Button>
              <Button
                className="flex-1"
                variant="destructive"
                onClick={() => {
                  deleteMediaFile(mediaPreviewUrl);
                  setMediaPreviewOpen(false);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Supprimer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  // ============================================================
  // Main Render
  // ============================================================

  const sectionMap: Record<Section, () => React.ReactNode> = {
    dashboard: renderDashboard,
    banners: () => <BannerManagement />,
    categories: () => <CategoryManagement />,
    products: renderProducts,
    orders: renderOrders,
    customers: renderCustomers,
    users: renderUsers,
    settings: renderSettings,
    woocommerce: renderWooCommerce,
    media: renderMedia,
  };

  // Admin access guard
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold">Accès Refusé</h2>
          <p className="text-muted-foreground">
            {!currentUser
              ? 'Veuillez vous connecter pour accéder au tableau de bord.'
              : 'Vous n\'avez pas la permission d\'accéder au tableau de bord.'}
          </p>
          <Button onClick={() => navigateTo('home')}>
            Aller à l\'Accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 text-white transform transition-transform duration-200 lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-zinc-700">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
              CG
            </div>
            <div>
              <h1 className="font-bold text-sm">ChicGlambyEva</h1>
              <p className="text-xs text-zinc-400">Administration</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto lg:hidden text-zinc-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
            {NAV_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleNavClick(item.key)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors relative
                        ${activeSection === item.key
                          ? 'bg-white/10 text-white font-medium'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {item.icon}
                      {item.label}
                      {item.key === 'orders' && unseenOrdersCount > 0 && (
                        <span className="ml-auto flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold">
                          {unseenOrdersCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-3 py-4 border-t border-zinc-700">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
              <LogOut className="h-4 w-4" />
              Se Déconnecter
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b bg-background flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold">
              {NAV_ITEMS.find((n) => n.key === activeSection)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button
              onClick={() => {
                if (unseenOrdersCount > 0) {
                  handleViewNewOrder();
                }
              }}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unseenOrdersCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">
                  {unseenOrdersCount}
                </span>
              )}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (activeSection === 'dashboard') fetchDashboard();
                else if (activeSection === 'products') fetchProducts();
                else if (activeSection === 'orders') fetchOrders();
                else if (activeSection === 'customers') fetchCustomers();
                else if (activeSection === 'users') fetchUsers();
                else if (activeSection === 'settings') fetchSettings();
                else if (activeSection === 'woocommerce') fetchWooImports();
                else if (activeSection === 'media') fetchMedia();
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <span className="hidden sm:inline font-medium">Admin</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {sectionMap[activeSection]?.()}
        </main>
      </div>

      {/* Product Import Modal */}
      <ProductImport
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onImportComplete={fetchProducts}
      />

      {/* Product Modal */}
      <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Mettre à jour les détails du produit' : 'Créer un nouveau produit'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[65vh] pl-0 pr-1">
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Informations de base</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="pName">Nom *</Label>
                    <Input
                      id="pName"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pBrand">Marque</Label>
                    <Input
                      id="pBrand"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pSku">SKU</Label>
                    <Input
                      id="pSku"
                      value={productForm.sku}
                      onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Tarification</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="pPrice">Prix (€) *</Label>
                    <Input
                      id="pPrice"
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pOrigPrice">Prix Original (€)</Label>
                    <Input
                      id="pOrigPrice"
                      type="number"
                      step="0.01"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Catégorie</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Catégorie</Label>
                    <Select
                      value={productForm.category}
                      onValueChange={(v) => setProductForm({ ...productForm, category: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pSubcat">Sous-catégorie</Label>
                    <Input
                      id="pSubcat"
                      value={productForm.subcategory}
                      onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Description</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="pShortDesc">Description Courte</Label>
                    <Textarea
                      id="pShortDesc"
                      rows={2}
                      value={productForm.shortDescription}
                      onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pDesc">Description Complète</Label>
                    <Textarea
                      id="pDesc"
                      rows={4}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Inventaire</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="pStock">Quantité en Stock</Label>
                    <Input
                      id="pStock"
                      type="number"
                      value={productForm.stockCount}
                      onChange={(e) => setProductForm({ ...productForm, stockCount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pTags">Étiquettes (séparées par des virgules)</Label>
                    <Input
                      id="pTags"
                      placeholder="hydratant, anti-âge, sérum"
                      value={productForm.tags}
                      onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Product Flags */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Indicateurs du Produit</h4>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={productForm.inStock}
                      onCheckedChange={(v) => setProductForm({ ...productForm, inStock: v })}
                    />
                    <Label>En Stock</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={productForm.isNew}
                      onCheckedChange={(v) => setProductForm({ ...productForm, isNew: v })}
                    />
                    <Label>Nouveau</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={productForm.isTrending}
                      onCheckedChange={(v) => setProductForm({ ...productForm, isTrending: v })}
                    />
                    <Label>Tendance</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={productForm.isBestseller}
                      onCheckedChange={(v) => setProductForm({ ...productForm, isBestseller: v })}
                    />
                    <Label>Meilleure Vente</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={productForm.isFeatured}
                      onCheckedChange={(v) => setProductForm({ ...productForm, isFeatured: v })}
                    />
                    <Label>En Vedette</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={productForm.isActive}
                      onCheckedChange={(v) => setProductForm({ ...productForm, isActive: v })}
                    />
                    <Label>Actif</Label>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Images</h4>

                {/* Current images */}
                {productImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {productImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Image du produit ${idx + 1}`}
                          className="h-20 w-20 rounded-md object-cover border bg-muted"
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {idx === 0 && (
                          <Badge className="absolute -bottom-1 left-1 text-[10px]">Principale</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload area */}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          Array.from(files).forEach((file) => uploadProductImage(file));
                        }
                      }}
                    />
                    <Button variant="outline" size="sm" asChild disabled={imageUploading}>
                      <span>
                        {imageUploading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Télécharger des Images
                      </span>
                    </Button>
                  </label>
                  <span className="text-xs text-muted-foreground">
                    Sélectionnez une ou plusieurs images
                  </span>
                </div>

                {/* Or enter image URL */}
                <div className="mt-2">
                  <Input
                    placeholder="Ou collez une URL d'image et appuyez sur Entrée"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                        setProductImages((prev) => [...prev, (e.target as HTMLInputElement).value]);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                </div>
              </div>

              {/* SEO */}
              <div>
                <h4 className="text-sm font-semibold mb-3">SEO</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="pSeoTitle">Titre SEO</Label>
                    <Input
                      id="pSeoTitle"
                      value={productForm.seoTitle}
                      onChange={(e) => setProductForm({ ...productForm, seoTitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pSeoDesc">Description SEO</Label>
                    <Textarea
                      id="pSeoDesc"
                      rows={2}
                      value={productForm.seoDescription}
                      onChange={(e) => setProductForm({ ...productForm, seoDescription: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProductModalOpen(false)}>Annuler</Button>
            <Button onClick={saveProduct} disabled={productSaving}>
              {productSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingProduct ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Order Notification Popup */}
      <AdminOrderNotification
        latestOrder={newOrderNotification}
        onDismiss={dismissNotification}
        onViewOrder={handleViewNewOrder}
      />
    </div>
  );
}

// Helper component for power icon
function PowerIcon({ active }: { active: boolean }) {
  return (
    <div className={`h-3.5 w-3.5 rounded-full border-2 ${active ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500'}`} />
  );
}
