'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  MapPin,
  Search,
  ChevronRight,
  Home,
  ClipboardCheck,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/store/use-store';
import { toast } from 'sonner';

// ===== Types =====

interface TrackingItem {
  id: string;
  productName: string;
  productImage: string;
  brand: string;
  price: number;
  quantity: number;
  total: number;
}

interface TrackingOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingCarrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  orderConfirmedAt: string | null;
  createdAt: string;
  items: TrackingItem[];
}

// ===== Status mapping =====

const STATUS_STEPS = [
  { key: 'confirmed', label: 'Commande confirmée', icon: ClipboardCheck },
  { key: 'preparing', label: 'En cours de préparation', icon: Package },
  { key: 'shipped', label: 'Expédiée', icon: Truck },
  { key: 'delivered', label: 'Livrée', icon: CheckCircle2 },
];

function getOrderStepIndex(status: string): number {
  switch (status) {
    case 'processing':
      return 0;
    case 'validated':
      return 0;
    case 'in_progress':
      return 1;
    case 'shipped':
      return 2;
    case 'delivered':
      return 3;
    default:
      return 0;
  }
}

function getStepDate(
  stepIndex: number,
  order: TrackingOrder
): string | null {
  if (stepIndex === 0) return order.createdAt;
  if (stepIndex === 2) return order.shippedAt;
  if (stepIndex === 3) return order.deliveredAt;
  return null;
}

// ===== Helpers =====

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

function getCarrierTrackingUrl(
  carrier: string | null,
  trackingNumber: string | null
): string | null {
  if (!carrier || !trackingNumber) return null;
  const c = carrier.toLowerCase();
  if (c === 'colissimo') {
    return `https://www.colissimo.fr/transport-suivi-page?lang=fr_FR&trackingNumber=${trackingNumber}`;
  }
  if (c === 'chronopost') {
    return `https://www.chronopost.fr/tracking-cgi?listeNumeroBT=${trackingNumber}&lang=fr`;
  }
  return null;
}

function getCarrierLabel(carrier: string | null): string {
  if (!carrier) return 'Non défini';
  if (carrier.toLowerCase() === 'colissimo') return 'Colissimo';
  if (carrier.toLowerCase() === 'chronopost') return 'Chronopost';
  return carrier;
}

// ===== Status Badge =====

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    processing: { label: 'En attente', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    validated: { label: 'Confirmée', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    in_progress: { label: 'En préparation', className: 'bg-orange-50 text-orange-700 border-orange-200' },
    shipped: { label: 'Expédiée', className: 'bg-purple-50 text-purple-700 border-purple-200' },
    delivered: { label: 'Livrée', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelled: { label: 'Annulée', className: 'bg-red-50 text-red-700 border-red-200' },
  };

  const c = config[status] || { label: status, className: 'bg-gray-50 text-gray-700 border-gray-200' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${c.className}`}>
      {status === 'delivered' && <CheckCircle2 className="size-3.5" />}
      {status === 'shipped' && <Truck className="size-3.5" />}
      {(status === 'processing' || status === 'in_progress') && <Clock className="size-3.5" />}
      {c.label}
    </span>
  );
}

// ===== Timeline Step Component =====

function TimelineStep({
  step,
  index,
  activeIndex,
  date,
  isLast,
}: {
  step: (typeof STATUS_STEPS)[number];
  index: number;
  activeIndex: number;
  date: string | null;
  isLast: boolean;
}) {
  const isCompleted = index < activeIndex;
  const isCurrent = index === activeIndex;
  const isPending = index > activeIndex;

  const Icon = step.icon;

  return (
    <div className="flex gap-4">
      {/* Indicator column */}
      <div className="flex flex-col items-center">
        <div
          className={`flex items-center justify-center size-10 rounded-full border-2 transition-colors shrink-0 ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : isCurrent
              ? 'bg-white border-emerald-500 text-emerald-600'
              : 'bg-white border-neutral-200 text-neutral-300'
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Icon className="size-5" />
          )}
        </div>
        {!isLast && (
          <div
            className={`w-0.5 flex-1 min-h-[40px] transition-colors ${
              isCompleted ? 'bg-emerald-500' : 'bg-neutral-200'
            }`}
          />
        )}
      </div>

      {/* Content column */}
      <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
        <p
          className={`text-sm font-semibold ${
            isCompleted || isCurrent ? 'text-neutral-900' : 'text-neutral-400'
          }`}
        >
          {step.label}
        </p>
        {date && (
          <p className="text-xs text-neutral-500 mt-0.5">{formatShortDate(date)}</p>
        )}
        {isCurrent && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
            <Clock className="size-3" />
            En cours
          </span>
        )}
        {isPending && (
          <p className="text-xs text-neutral-400 mt-0.5">En attente</p>
        )}
      </div>
    </div>
  );
}

// ===== Main Component =====

export default function OrderTrackingPage() {
  const navigateTo = useStore((s) => s.navigateTo);
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({ orderNumber: orderNumber.trim() });
      if (email.trim()) {
        params.set('email', email.trim());
      }
      const res = await fetch(`/api/orders/public-track?${params.toString()}`);
      const data = await res.json();

      if (data.success && data.order) {
        setOrder(data.order);
        setError(null);
      } else {
        setOrder(null);
        setError(data.error || 'Aucune commande trouvée avec ce numéro');
      }
    } catch {
      setOrder(null);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTracking = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      toast.success('Numéro de suivi copié !');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNewSearch = () => {
    setOrder(null);
    setError(null);
    setHasSearched(false);
    setOrderNumber('');
    setEmail('');
  };

  const trackingUrl = order
    ? order.trackingUrl || getCarrierTrackingUrl(order.shippingCarrier, order.trackingNumber)
    : null;

  const activeStep = order ? getOrderStepIndex(order.status) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-neutral-500 mb-6">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-1 hover:text-neutral-900 transition-colors"
            >
              <Home className="size-3.5" />
              Accueil
            </button>
            <ChevronRight className="size-3 text-neutral-400" />
            <span className="text-neutral-900 font-medium">Suivi de Commande</span>
          </nav>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-neutral-950 tracking-tight mb-2">
            Suivi de Commande
          </h1>
          <p className="text-base text-neutral-500">
            Retrouvez votre commande en entrant votre numéro de commande
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Search Section */}
        {!order && (
          <div className="max-w-xl mx-auto">
            <Card className="border-neutral-200 shadow-sm">
              <CardContent className="pt-8 pb-8 px-6 sm:px-8">
                <form onSubmit={handleSearch} className="space-y-5">
                  <div className="text-center mb-6">
                    <div className="size-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                      <Package className="size-7 text-neutral-500" />
                    </div>
                    <p className="text-sm text-neutral-500">
                      Entrez votre numéro de commande pour suivre l&apos;état de votre livraison
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Numéro de commande <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="Ex : CGE-2025-0001"
                      required
                      className="h-11"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Adresse e-mail{' '}
                      <span className="text-xs text-neutral-400 font-normal">(facultatif)</span>
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="h-11"
                    />
                    <p className="text-xs text-neutral-400 mt-1">
                      Permet de vérifier votre identité
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !orderNumber.trim()}
                    className="w-full h-11 bg-black text-white hover:bg-neutral-800 rounded-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Recherche en cours...
                      </>
                    ) : (
                      <>
                        <Search className="size-4 mr-2" />
                        Rechercher
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Error State */}
            {hasSearched && error && !loading && (
              <div className="mt-6">
                <Card className="border-red-200 bg-red-50/50">
                  <CardContent className="pt-6 flex items-start gap-3">
                    <AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">{error}</p>
                      <p className="text-xs text-red-500 mt-1">
                        Vérifiez votre numéro de commande et réessayez.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <Card className="border-neutral-200">
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="flex gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex-1 space-y-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  ))}
                </div>
                <Separator />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Order Results */}
        {order && !loading && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="font-heading text-xl font-bold text-neutral-950">
                    Commande {order.orderNumber}
                  </h2>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-sm text-neutral-500 mt-1">
                  Passée le {formatDate(order.createdAt)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewSearch}
                className="rounded-lg"
              >
                Nouvelle recherche
              </Button>
            </div>

            {/* Timeline / Stepper */}
            <Card className="border-neutral-200 shadow-sm overflow-hidden">
              <CardContent className="pt-6 sm:pt-8 px-6 sm:px-8">
                <h3 className="font-heading font-semibold text-neutral-950 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                  <MapPin className="size-4" />
                  Progression de la commande
                </h3>

                <div>
                  {STATUS_STEPS.map((step, index) => {
                    const stepDate = getStepDate(index, order);
                    const isLast = index === STATUS_STEPS.length - 1;

                    return (
                      <TimelineStep
                        key={step.key}
                        step={step}
                        index={index}
                        activeIndex={activeStep}
                        date={stepDate}
                        isLast={isLast}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Tracking Details Card (if shipped or delivered) */}
            {(order.trackingNumber || order.shippingCarrier) && (
              <Card className="border-neutral-200 shadow-sm">
                <CardContent className="pt-6 px-6 sm:px-8">
                  <h3 className="font-heading font-semibold text-neutral-950 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Truck className="size-4" />
                    Informations de livraison
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Carrier */}
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                        Transporteur
                      </p>
                      <p className="text-sm font-semibold text-neutral-900">
                        {getCarrierLabel(order.shippingCarrier)}
                      </p>
                    </div>

                    {/* Tracking Number */}
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                        Numéro de suivi
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono font-semibold text-neutral-900 flex-1 truncate">
                          {order.trackingNumber || 'Non disponible'}
                        </p>
                        {order.trackingNumber && (
                          <button
                            onClick={handleCopyTracking}
                            className="flex items-center justify-center size-8 rounded-md hover:bg-neutral-200 transition-colors text-neutral-500 hover:text-neutral-700"
                            title="Copier le numéro"
                          >
                            {copied ? (
                              <CheckCircle2 className="size-4 text-emerald-500" />
                            ) : (
                              <Copy className="size-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Track button */}
                  {trackingUrl && (
                    <a
                      href={trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      <ExternalLink className="size-4" />
                      Suivre mon colis
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Order Items Summary */}
            <Card className="border-neutral-200 shadow-sm">
              <CardContent className="pt-6 px-6 sm:px-8">
                <h3 className="font-heading font-semibold text-neutral-950 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Package className="size-4" />
                  Articles commandés
                </h3>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
                    >
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-white border border-neutral-200 shrink-0">
                        <Image
                          src={item.productImage || '/images/placeholder.png'}
                          alt={item.productName}
                          width={64}
                          height={64}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-neutral-500">{item.brand}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Qté : {item.quantity} &times; {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-neutral-900 shrink-0">
                        {formatPrice(item.total)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-4 bg-neutral-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Sous-total</span>
                    <span className="text-neutral-700">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Livraison</span>
                    <span className="text-neutral-700">
                      {order.shippingCost === 0 ? (
                        <span className="text-emerald-600 font-medium">GRATUITE</span>
                      ) : (
                        formatPrice(order.shippingCost)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">TVA (20%)</span>
                    <span className="text-neutral-700">{formatPrice(order.tax)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-neutral-900">Total</span>
                    <span className="text-neutral-900">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help section */}
            <div className="text-center py-4">
              <p className="text-sm text-neutral-500">
                Besoin d&apos;aide ?{' '}
                <button
                  onClick={() => navigateTo('contact-page')}
                  className="text-black font-medium underline underline-offset-4 hover:text-neutral-700 transition-colors"
                >
                  Contactez notre service client
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
