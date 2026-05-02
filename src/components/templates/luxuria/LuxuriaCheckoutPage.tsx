'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  Package,
  ShoppingBag,
  Truck,
  ChevronRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { useCartStore } from '@/store/use-cart-store';
import { useStore } from '@/store/use-store';

// ─── Amiy Design Tokens ───────────────────────────────────
const C = {
  primary: '#663130',
  primaryHover: '#7a3a38',
  tertiaryBg: '#F4F2ED',
  quaternaryBg: '#FBEADE',
  sectionBg: '#F9F7F4',
  border: '#E8E4DE',
  textLight: '#666666',
  textMuted: '#999999',
  white: '#FFFFFF',
  textDark: '#1a1a1a',
};

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function LuxuriaCheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});

  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    country: 'France',
  });

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotal = useCartStore((s) => s.getTotal);
  const navigateTo = useStore((s) => s.navigateTo);

  const subtotal = getTotal();
  const shippingCost = shippingMethod === 'express' ? 9.99 : subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shippingCost - promoDiscount;

  const updateField = (field: keyof ShippingForm, value: string) => {
    setShippingForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingForm> = {};
    if (!shippingForm.firstName.trim()) newErrors.firstName = 'Requis';
    if (!shippingForm.lastName.trim()) newErrors.lastName = 'Requis';
    if (!shippingForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingForm.email))
      newErrors.email = 'Email invalide';
    if (!shippingForm.phone.trim()) newErrors.phone = 'Requis';
    if (!shippingForm.address1.trim()) newErrors.address1 = 'Requis';
    if (!shippingForm.city.trim()) newErrors.city = 'Requis';
    if (!shippingForm.postalCode.trim()) newErrors.postalCode = 'Requis';
    if (!shippingForm.country.trim()) newErrors.country = 'Requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'BIENVENUE10') {
      setPromoDiscount(subtotal * 0.1);
      setPromoApplied(true);
    } else if (promoCode.trim().toUpperCase() === 'LUXURIA20') {
      setPromoDiscount(subtotal * 0.2);
      setPromoApplied(true);
    } else {
      setPromoDiscount(0);
      setPromoApplied(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            productName: item.product.name,
            productImage: item.product.image,
            brand: item.product.brand,
            price: item.product.price,
          })),
          customerName: `${shippingForm.firstName} ${shippingForm.lastName}`,
          customerEmail: shippingForm.email,
          customerPhone: shippingForm.phone,
          shippingAddress: shippingForm,
          paymentMethod: paymentMethod === 'card' ? 'stripe' : 'cod',
          paymentStatus: 'pending',
          status: 'processing',
        }),
      });

      const data = await response.json();

      if (data.success && data.order) {
        setOrderId(data.order.id);
        setOrderNumber(data.order.orderNumber);
        clearCart();
        setIsOrderConfirmed(true);
      } else {
        alert(data.error || 'Impossible de passer la commande. Veuillez réessayer.');
      }
    } catch {
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Empty Cart Guard ────────────────────────────────────
  if (items.length === 0 && !isOrderConfirmed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div
            className="w-20 h-20 flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: C.tertiaryBg }}
          >
            <ShoppingBag className="size-8" style={{ color: C.primary }} />
          </div>
          <h2 className="font-heading text-xl font-semibold mb-2" style={{ color: C.textDark }}>
            Votre panier est vide
          </h2>
          <p className="text-sm mb-6 text-center" style={{ color: C.textLight }}>
            Ajoutez des articles à votre panier avant de passer à la caisse.
          </p>
          <Button
            onClick={() => navigateTo('home')}
            className="text-white rounded-sm px-8 transition-all duration-300"
            style={{ backgroundColor: C.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.primaryHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.primary)}
          >
            Continuer les achats
          </Button>
        </motion.div>
      </div>
    );
  }

  // ── Order Confirmation State ────────────────────────────
  if (isOrderConfirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6, bounce: 0.5 }}
            className="w-20 h-20 flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: C.quaternaryBg }}
          >
            <Check className="size-10" style={{ color: C.primary }} />
          </motion.div>
          <h2 className="font-heading text-2xl font-semibold mb-2" style={{ color: C.textDark }}>
            Merci pour votre commande !
          </h2>
          <p className="mb-4" style={{ color: C.textLight }}>
            Votre commande a été passée avec succès. Vous recevrez un email de confirmation
            sous peu.
          </p>
          {orderNumber && (
            <p
              className="text-sm font-medium px-4 py-2 inline-block mb-6 rounded-sm"
              style={{ backgroundColor: C.tertiaryBg, color: C.primary }}
            >
              Commande {orderNumber}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigateTo('home')}
              className="text-white rounded-sm px-8 py-3.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300"
              style={{ backgroundColor: C.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.primaryHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.primary)}
            >
              Retour à la boutique
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const inputStyle = {
    borderRadius: '2px',
    border: `1px solid ${C.border}`,
    color: C.textDark,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.white }}>
      {/* ── Breadcrumb ── */}
      <div style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigateTo('home')}
              className="hover:opacity-70 transition-opacity duration-300"
              style={{ color: C.textLight }}
            >
              Accueil
            </button>
            <ChevronRight className="size-3" style={{ color: C.border }} />
            <button
              onClick={() => navigateTo('cart')}
              className="hover:opacity-70 transition-opacity duration-300"
              style={{ color: C.textLight }}
            >
              Panier
            </button>
            <ChevronRight className="size-3" style={{ color: C.border }} />
            <span className="font-medium" style={{ color: C.textDark }}>
              Checkout
            </span>
          </nav>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          {/* ── Left: Checkout Form (~60%) ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-sm p-6 sm:p-8"
              style={{ border: `1px solid ${C.border}` }}
            >
              <Accordion type="multiple" defaultValue={['personal', 'address', 'shipping', 'payment', 'promo']} className="w-full">
                {/* ── Personal Info ── */}
                <AccordionItem value="personal" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <AccordionTrigger className="font-heading text-base font-semibold py-4 hover:no-underline" style={{ color: C.textDark }}>
                    1. Informations personnelles
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm" style={{ color: C.textLight }}>
                          Prénom <span style={{ color: C.primary }}>*</span>
                        </Label>
                        <Input
                          id="firstName"
                          value={shippingForm.firstName}
                          onChange={(e) => updateField('firstName', e.target.value)}
                          placeholder="Prénom"
                          className="focus-visible:ring-offset-0 focus-visible:ring-1"
                          style={{
                            ...inputStyle,
                            borderColor: errors.firstName ? C.primary : C.border,
                          }}
                        />
                        {errors.firstName && (
                          <p className="text-xs" style={{ color: C.primary }}>{errors.firstName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm" style={{ color: C.textLight }}>
                          Nom <span style={{ color: C.primary }}>*</span>
                        </Label>
                        <Input
                          id="lastName"
                          value={shippingForm.lastName}
                          onChange={(e) => updateField('lastName', e.target.value)}
                          placeholder="Nom"
                          className="focus-visible:ring-offset-0 focus-visible:ring-1"
                          style={{
                            ...inputStyle,
                            borderColor: errors.lastName ? C.primary : C.border,
                          }}
                        />
                        {errors.lastName && (
                          <p className="text-xs" style={{ color: C.primary }}>{errors.lastName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm" style={{ color: C.textLight }}>
                          Email <span style={{ color: C.primary }}>*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingForm.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="email@exemple.com"
                          className="focus-visible:ring-offset-0 focus-visible:ring-1"
                          style={{
                            ...inputStyle,
                            borderColor: errors.email ? C.primary : C.border,
                          }}
                        />
                        {errors.email && (
                          <p className="text-xs" style={{ color: C.primary }}>{errors.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm" style={{ color: C.textLight }}>
                          Téléphone <span style={{ color: C.primary }}>*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={shippingForm.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          placeholder="+33 6 12 34 56 78"
                          className="focus-visible:ring-offset-0 focus-visible:ring-1"
                          style={{
                            ...inputStyle,
                            borderColor: errors.phone ? C.primary : C.border,
                          }}
                        />
                        {errors.phone && (
                          <p className="text-xs" style={{ color: C.primary }}>{errors.phone}</p>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* ── Shipping Address ── */}
                <AccordionItem value="address" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <AccordionTrigger className="font-heading text-base font-semibold py-4 hover:no-underline" style={{ color: C.textDark }}>
                    2. Adresse de livraison
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-4">
                      <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="address1" className="text-sm" style={{ color: C.textLight }}>
                          Adresse ligne 1 <span style={{ color: C.primary }}>*</span>
                        </Label>
                        <Input
                          id="address1"
                          value={shippingForm.address1}
                          onChange={(e) => updateField('address1', e.target.value)}
                          placeholder="123 Rue de Rivoli"
                          className="focus-visible:ring-offset-0 focus-visible:ring-1"
                          style={{
                            ...inputStyle,
                            borderColor: errors.address1 ? C.primary : C.border,
                          }}
                        />
                        {errors.address1 && (
                          <p className="text-xs" style={{ color: C.primary }}>{errors.address1}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="address2" className="text-sm" style={{ color: C.textLight }}>
                          Adresse ligne 2 (facultatif)
                        </Label>
                        <Input
                          id="address2"
                          value={shippingForm.address2}
                          onChange={(e) => updateField('address2', e.target.value)}
                          placeholder="Bâtiment, étage, etc."
                          className="focus-visible:ring-offset-0 focus-visible:ring-1"
                          style={inputStyle}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm" style={{ color: C.textLight }}>
                          Ville <span style={{ color: C.primary }}>*</span>
                        </Label>
                        <Input
                          id="city"
                          value={shippingForm.city}
                          onChange={(e) => updateField('city', e.target.value)}
                          placeholder="Paris"
                          className="focus-visible:ring-offset-0 focus-visible:ring-1"
                          style={{
                            ...inputStyle,
                            borderColor: errors.city ? C.primary : C.border,
                          }}
                        />
                        {errors.city && (
                          <p className="text-xs" style={{ color: C.primary }}>{errors.city}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode" className="text-sm" style={{ color: C.textLight }}>
                          Code postal <span style={{ color: C.primary }}>*</span>
                        </Label>
                        <Input
                          id="postalCode"
                          value={shippingForm.postalCode}
                          onChange={(e) => updateField('postalCode', e.target.value)}
                          placeholder="75001"
                          className="focus-visible:ring-offset-0 focus-visible:ring-1"
                          style={{
                            ...inputStyle,
                            borderColor: errors.postalCode ? C.primary : C.border,
                          }}
                        />
                        {errors.postalCode && (
                          <p className="text-xs" style={{ color: C.primary }}>{errors.postalCode}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm" style={{ color: C.textLight }}>
                          Pays <span style={{ color: C.primary }}>*</span>
                        </Label>
                        <Input
                          id="country"
                          value={shippingForm.country}
                          onChange={(e) => updateField('country', e.target.value)}
                          placeholder="France"
                          className="focus-visible:ring-offset-0 focus-visible:ring-1"
                          style={{
                            ...inputStyle,
                            borderColor: errors.country ? C.primary : C.border,
                          }}
                        />
                        {errors.country && (
                          <p className="text-xs" style={{ color: C.primary }}>{errors.country}</p>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* ── Shipping Method ── */}
                <AccordionItem value="shipping" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <AccordionTrigger className="font-heading text-base font-semibold py-4 hover:no-underline" style={{ color: C.textDark }}>
                    3. Méthode de livraison
                  </AccordionTrigger>
                  <AccordionContent>
                    <RadioGroup
                      value={shippingMethod}
                      onValueChange={setShippingMethod}
                      className="space-y-3 pb-4"
                    >
                      {/* Standard */}
                      <label
                        className="flex items-center justify-between p-4 cursor-pointer transition-all duration-300"
                        style={{
                          borderRadius: '2px',
                          border: `2px solid ${shippingMethod === 'standard' ? C.primary : C.border}`,
                          backgroundColor: shippingMethod === 'standard' ? C.tertiaryBg : C.white,
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <RadioGroupItem value="standard" id="standard" />
                          <div className="flex items-center gap-3">
                            <Truck className="size-5" style={{ color: C.primary }} />
                            <div>
                              <p className="font-medium text-sm" style={{ color: C.textDark }}>
                                Livraison Standard
                              </p>
                              <p className="text-xs" style={{ color: C.textMuted }}>
                                {subtotal >= 50 ? 'GRATUITE' : '4,99\u00a0€'} · 3-5 jours ouvrés
                              </p>
                            </div>
                          </div>
                        </div>
                        <span className="font-semibold text-sm" style={{ color: C.textDark }}>
                          {subtotal >= 50 ? 'GRATUITE' : '4,99\u00a0€'}
                        </span>
                      </label>

                      {/* Express */}
                      <label
                        className="flex items-center justify-between p-4 cursor-pointer transition-all duration-300"
                        style={{
                          borderRadius: '2px',
                          border: `2px solid ${shippingMethod === 'express' ? C.primary : C.border}`,
                          backgroundColor: shippingMethod === 'express' ? C.tertiaryBg : C.white,
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <RadioGroupItem value="express" id="express" />
                          <div className="flex items-center gap-3">
                            <Package className="size-5" style={{ color: C.primary }} />
                            <div>
                              <p className="font-medium text-sm" style={{ color: C.textDark }}>
                                Livraison Express
                              </p>
                              <p className="text-xs" style={{ color: C.textMuted }}>
                                9,99\u00a0€ · 1-2 jours ouvrés
                              </p>
                            </div>
                          </div>
                        </div>
                        <span className="font-semibold text-sm" style={{ color: C.textDark }}>
                          9,99\u00a0€
                        </span>
                      </label>
                    </RadioGroup>

                    {subtotal < 50 && shippingMethod === 'standard' && (
                      <p
                        className="text-xs p-3 rounded-sm"
                        style={{ color: C.textLight, backgroundColor: C.quaternaryBg }}
                      >
                        Ajoutez {(50 - subtotal).toFixed(2)}&euro; de plus pour bénéficier de la
                        livraison standard GRATUITE !
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* ── Payment Method ── */}
                <AccordionItem value="payment" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <AccordionTrigger className="font-heading text-base font-semibold py-4 hover:no-underline" style={{ color: C.textDark }}>
                    4. Méthode de paiement
                  </AccordionTrigger>
                  <AccordionContent>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-3 pb-4"
                    >
                      {/* Card Payment */}
                      <label
                        className="flex items-center gap-4 p-4 cursor-pointer transition-all duration-300"
                        style={{
                          borderRadius: '2px',
                          border: `2px solid ${paymentMethod === 'card' ? C.primary : C.border}`,
                          backgroundColor: paymentMethod === 'card' ? C.tertiaryBg : C.white,
                        }}
                      >
                        <RadioGroupItem value="card" id="card" />
                        <div className="flex items-center gap-3">
                          <CreditCard className="size-5" style={{ color: C.primary }} />
                          <div>
                            <p className="font-medium text-sm" style={{ color: C.textDark }}>
                              Carte bancaire
                            </p>
                            <p className="text-xs" style={{ color: C.textMuted }}>
                              Visa, Mastercard, CB
                            </p>
                          </div>
                        </div>
                      </label>

                      {/* Cash on Delivery */}
                      <label
                        className="flex items-center gap-4 p-4 cursor-pointer transition-all duration-300"
                        style={{
                          borderRadius: '2px',
                          border: `2px solid ${paymentMethod === 'cod' ? C.primary : C.border}`,
                          backgroundColor: paymentMethod === 'cod' ? C.tertiaryBg : C.white,
                        }}
                      >
                        <RadioGroupItem value="cod" id="cod" />
                        <div className="flex items-center gap-3">
                          <Package className="size-5" style={{ color: C.primary }} />
                          <div>
                            <p className="font-medium text-sm" style={{ color: C.textDark }}>
                              Payer à la livraison
                            </p>
                            <p className="text-xs" style={{ color: C.textMuted }}>
                              Paiement en espèces à la réception
                            </p>
                          </div>
                        </div>
                      </label>
                    </RadioGroup>

                    {/* Card placeholder */}
                    {paymentMethod === 'card' && (
                      <div
                        className="p-5 rounded-sm space-y-4"
                        style={{ backgroundColor: C.sectionBg, border: `1px solid ${C.border}` }}
                      >
                        <div className="space-y-2">
                          <Label className="text-sm" style={{ color: C.textLight }}>
                            Numéro de carte
                          </Label>
                          <Input
                            placeholder="4242 4242 4242 4242"
                            disabled
                            style={inputStyle}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm" style={{ color: C.textLight }}>
                              Expiration
                            </Label>
                            <Input
                              placeholder="MM / YY"
                              disabled
                              style={inputStyle}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm" style={{ color: C.textLight }}>
                              CVC
                            </Label>
                            <Input
                              placeholder="123"
                              disabled
                              style={inputStyle}
                            />
                          </div>
                        </div>
                        <p className="text-[11px]" style={{ color: C.textMuted }}>
                          Le paiement sera traité de manière sécurisée lors de la confirmation.
                        </p>
                      </div>
                    )}

                    {/* Security badge */}
                    <div className="flex items-center gap-2 text-xs mt-3" style={{ color: C.textLight }}>
                      <ShieldCheck className="size-4" style={{ color: C.primary }} />
                      <span>Paiement 100% sécurisé — Vos données sont protégées</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* ── Promo Code ── */}
                <AccordionItem value="promo">
                  <AccordionTrigger className="font-heading text-base font-semibold py-4 hover:no-underline" style={{ color: C.textDark }}>
                    <span className="flex items-center gap-2">
                      <Tag className="size-4" />
                      Code promo
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex gap-2 pb-4">
                      <Input
                        placeholder="Entrez votre code"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          if (promoApplied) {
                            setPromoApplied(false);
                            setPromoDiscount(0);
                          }
                        }}
                        className="focus-visible:ring-offset-0 focus-visible:ring-1"
                        style={inputStyle}
                      />
                      <Button
                        onClick={handleApplyPromo}
                        variant="outline"
                        className="rounded-sm px-6 text-sm font-medium uppercase tracking-wider whitespace-nowrap transition-all duration-300"
                        style={{ borderColor: C.primary, color: C.primary }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.tertiaryBg)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        Appliquer
                      </Button>
                    </div>
                    {promoApplied && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs pb-4"
                        style={{ color: C.primary }}
                      >
                        ✓ Code promo appliqué : -{promoDiscount.toFixed(2)}&euro; de réduction
                      </motion.p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Back to cart */}
              <div className="mt-6">
                <button
                  onClick={() => navigateTo('cart')}
                  className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
                  style={{ color: C.textLight }}
                >
                  <ArrowLeft className="size-4" />
                  Retour au panier
                </button>
              </div>
            </motion.div>
          </div>

          {/* ── Right: Order Summary (~35%) ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-sm p-6 lg:sticky lg:top-28"
              style={{ backgroundColor: C.tertiaryBg }}
            >
              <h3 className="font-heading font-semibold text-lg mb-4" style={{ color: C.textDark }}>
                Résumé de la commande
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div
                      className="w-16 h-16 rounded-sm overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: C.white }}
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[10px] uppercase tracking-widest font-medium"
                        style={{ color: C.primary }}
                      >
                        {item.product.brand}
                      </p>
                      <p className="text-sm font-medium truncate" style={{ color: C.textDark }}>
                        {item.product.name}
                      </p>
                      <p className="text-xs" style={{ color: C.textMuted }}>
                        Qté : {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium flex-shrink-0" style={{ color: C.textDark }}>
                      {(item.product.price * item.quantity).toFixed(2)}&euro;
                    </p>
                  </div>
                ))}
              </div>

              <Separator style={{ backgroundColor: C.border }} className="my-4" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: C.textLight }}>Sous-total</span>
                  <span style={{ color: C.textDark }}>{subtotal.toFixed(2)}&euro;</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: C.textLight }}>Livraison</span>
                  {shippingCost === 0 ? (
                    <span className="font-medium" style={{ color: C.primary }}>GRATUITE</span>
                  ) : (
                    <span style={{ color: C.textDark }}>{shippingCost.toFixed(2)}&euro;</span>
                  )}
                </div>
                {promoApplied && promoDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: C.primary }}>Réduction</span>
                    <span style={{ color: C.primary }}>-{promoDiscount.toFixed(2)}&euro;</span>
                  </div>
                )}

                <Separator style={{ backgroundColor: C.border }} className="my-2" />

                <div className="flex justify-between font-heading font-semibold text-lg">
                  <span style={{ color: C.textDark }}>Total</span>
                  <span style={{ color: C.textDark }}>{total.toFixed(2)}&euro;</span>
                </div>
              </div>

              {/* Confirm Button */}
              <Button
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="w-full text-white rounded-sm py-3.5 text-sm font-semibold uppercase tracking-widest mt-8 transition-all duration-300 shadow-sm"
                style={{ backgroundColor: C.primary }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.currentTarget.style.backgroundColor = C.primaryHover;
                }}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.primary)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  'Confirmer la commande'
                )}
              </Button>

              {/* Trust */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs" style={{ color: C.textMuted }}>
                <ShieldCheck className="size-3.5" style={{ color: C.primary }} />
                <span>Transaction sécurisée</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
