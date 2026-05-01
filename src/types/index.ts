export interface ProductVariant {
  name: string;           // e.g. "Teinte", "Taille", "Volume", "Couleur"
  type: 'color' | 'text' | 'image';  // color = swatch, text = button label, image = thumbnail
  options: {
    label: string;        // e.g. "Clair", "Moyen", "Foncé"
    value: string;        // hex color for color swatch, or same as label
    inStock?: boolean;
  }[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  subcategory: string;
  rating: number;
  reviewCount: number;
  description: string;
  tags: string[];
  inStock: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  isBestseller?: boolean;
  concerns?: string[];
  skinType?: string[];
  variants?: ProductVariant[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
  subcategories: { name: string; slug: string }[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

export type PageType =
  | 'home' | 'category' | 'product' | 'cart' | 'checkout' | 'customer-dashboard' | 'admin-dashboard'
  | 'about' | 'cgv' | 'privacy' | 'contact-page' | 'faq' | 'shipping' | 'returns'
  | 'order-tracking' | 'careers' | 'press' | 'blog' | 'cookies' | 'legal';

export interface NavigationState {
  currentPage: PageType;
  selectedCategory: string | null;
  selectedProduct: Product | null;
  previousPage: PageType;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: string;
  billingAddress?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: 'processing' | 'validated' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  paymentId?: string;
  paymentStatus: string;
  shippingCarrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  brand: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Address {
  id: string;
  label?: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface SiteProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  images: string;
  category: string;
  subcategory: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew: boolean;
  isTrending: boolean;
  isBestseller: boolean;
  tags: string;
  sku: string;
  seoTitle?: string;
  seoDescription?: string;
  stockCount: number;
  isActive: boolean;
  createdAt: string;
}
