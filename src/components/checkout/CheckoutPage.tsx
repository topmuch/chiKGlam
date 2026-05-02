'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  Package,
  ShoppingBag,
  Truck,
  ChevronLeft,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCartStore } from '@/store/use-cart-store';
import { useStore } from '@/store/use-store';

const STEPS = ['Livraison', 'Livraison', 'Paiement', 'Confirmation'];

// ============================================================
// Payment Logo SVG Components
// ============================================================

function VisaLogo() {
  return (
    <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <path d="M20.2 21.5h-3.2l2-10.8h3.2l-2 10.8zm13.4-10.5c-.6-.2-1.6-.5-2.9-.5-3.1 0-5.3 1.6-5.3 3.9 0 1.7 1.5 2.7 2.7 3.3 1.2.6 1.6 1 1.6 1.5 0 .8-1 1.2-1.9 1.2-1.3 0-2-.2-3-.5l-.4-.2-.5 2.9c.8.4 2.2.7 3.8.7 3.3 0 5.5-1.6 5.5-4 0-1.4-.8-2.4-2.7-3.3-1.1-.6-1.8-1-1.8-1.5 0-.5.6-1 1.8-1 1.1 0 1.8.2 2.4.5l.3.1.5-2.8zm8.2-.3h-2.5c-.8 0-1.4.2-1.7 1.1l-4.9 11.7h3.4l.7-1.9h4.1l.4 1.9h3l-2.5-10.8zm-3.9 7l2.6-7.2-1.3 7.2h-1.3zm-22.1-7l-3.2 7.4-.3-1.7c-.5-1.8-2.2-3.7-4.1-4.7l3 10.7h3.5l5.1-11.7h-3z" fill="white" />
      <path d="M7.8 10.7H3l0 .2c3.1.8 5.1 2.7 6 4.9l-.9-4.3c-.1-.8-.7-1-1.3-1.1z" fill="#F9A533" />
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <circle cx="19.5" cy="16" r="8.5" fill="#EB001B" />
      <circle cx="28.5" cy="16" r="8.5" fill="#F79E1B" />
      <path d="M24 10.1c1.5 1.3 2.5 3.2 2.5 5.4 0 2.1-1 4-2.5 5.4-1.5-1.3-2.5-3.2-2.5-5.4 0-2.1 1-4 2.5-5.4z" fill="#FF5F00" />
    </svg>
  );
}

function CBLogo() {
  return (
    <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none">
      <rect width="48" height="32" rx="4" fill="#002395" />
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif">CB</text>
    </svg>
  );
}

function PaypalLogo() {
  return (
    <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none">
      <rect width="48" height="32" rx="4" fill="#003087" />
      <path d="M18.4 23.5l1.7-10.5h2.7c1.2 0 1.7.4 1.7 1.2 0 .2 0 .4-.1.6l-.8 4.9c-.2 1.1-.9 1.6-2.1 1.6h-1c-.3 0-.4-.1-.4-.4l.3-1.3h1.1c.5 0 .8-.2.9-.7l.5-3.2c0-.2-.1-.3-.4-.3h-1.3l-1.8 9.4h-2.3z" fill="#0070E0" />
      <path d="M25.5 17.5c-.4 0-.7.1-.9.3l-.7 4.2h.5l.6-3.8c0-.1.1-.2.3-.2h1c.5 0 .7-.2.8-.5l.1-.4h-.1c-.5 0-.9-.1-1.6.1v.3z" fill="#003087" />
      <text x="36" y="20" textAnchor="middle" fill="#0070E0" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">Pay</text>
    </svg>
  );
}

function ApplePayLogo() {
  return (
    <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none">
      <rect width="48" height="32" rx="4" fill="white" />
      <text x="24" y="20" textAnchor="middle" fill="#1D1D1F" fontSize="9" fontWeight="bold" fontFamily="system-ui, -apple-system, sans-serif">Pay</text>
    </svg>
  );
}

function PaymentLogos() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs text-muted-foreground">Paiements acceptés :</span>
      <VisaLogo />
      <MastercardLogo />
      <CBLogo />
      <PaypalLogo />
      <ApplePayLogo />
    </div>
  );
}

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

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [accountCreated, setAccountCreated] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
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
  const shippingCost = shippingMethod === 'express' ? 9.99 : subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.2;
  const total = subtotal + shippingCost + tax;

  const updateField = (field: keyof ShippingForm, value: string) => {
    setShippingForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateShipping = (): boolean => {
    const newErrors: Partial<ShippingForm> = {};
    if (!shippingForm.firstName.trim()) newErrors.firstName = 'Required';
    if (!shippingForm.lastName.trim()) newErrors.lastName = 'Required';
    if (!shippingForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingForm.email))
      newErrors.email = 'Valid email required';
    if (!shippingForm.phone.trim()) newErrors.phone = 'Required';
    if (!shippingForm.address1.trim()) newErrors.address1 = 'Required';
    if (!shippingForm.city.trim()) newErrors.city = 'Required';
    if (!shippingForm.postalCode.trim()) newErrors.postalCode = 'Required';
    if (!shippingForm.country.trim()) newErrors.country = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0 && !validateShipping()) return;
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    try {
      // Map payment method to API values
      const paymentMethodMap: Record<string, string> = {
        card: 'stripe',
        sumup: 'sumup',
      };

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
          paymentMethod: paymentMethodMap[paymentMethod] || paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
          status: paymentMethod === 'cod' ? 'processing' : 'processing',
        }),
      });

      const data = await response.json();

      if (data.success && data.order) {
        setOrderId(data.order.id);
        setOrderNumber(data.order.orderNumber);
        setAccountCreated(data.accountCreated === true);
        clearCart();
        setCurrentStep(3);
      } else {
        alert(data.error || 'Failed to place order. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && currentStep < 3) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
          <ShoppingBag className="size-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-heading font-semibold mb-2">Votre panier est vide</h2>
        <p className="text-muted-foreground mb-6 text-center">
          Ajoutez des articles à votre panier avant de passer à la caisse.
        </p>
        <Button
          onClick={() => navigateTo('home')}
          className="text-white hover:opacity-90 rounded-full px-8"
          style={{ backgroundColor: '#bc8752' }}
        >
          Continuer les achats
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Checkout Header */}
      <div className="bg-white border-b border-border sticky top-16 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 pt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-4" />
            Retour à la boutique
          </button>

          {/* Steps indicator */}
          <div className="flex items-center justify-center py-6">
            {STEPS.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center justify-center size-8 rounded-full text-sm font-medium transition-colors ${
                      index <= currentStep ? 'text-white' : 'bg-secondary text-muted-foreground'
                    }`}
                    style={index <= currentStep ? { backgroundColor: '#bc8752' } : undefined}
                  >
                    {index < currentStep ? <Check className="size-4" /> : index + 1}
                  </div>
                  <span
                    className={`text-sm font-medium hidden sm:inline ${
                      index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-px mx-2 sm:mx-3 transition-colors ${
                      index < currentStep ? 'bg-[#bc8752]' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-border p-6 sm:p-8">
              {/* Step 1: Shipping Information */}
              {currentStep === 0 && (
                <div>
                  <h2 className="text-xl font-heading font-semibold mb-1">
                    Informations de Livraison
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Entrez votre adresse de livraison
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={shippingForm.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        placeholder="Jane"
                        className={errors.firstName ? 'border-destructive' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-destructive">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        value={shippingForm.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        placeholder="Doe"
                        className={errors.lastName ? 'border-destructive' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-destructive">{errors.lastName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingForm.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="jane@example.com"
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingForm.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+33 6 12 34 56 78"
                        className={errors.phone ? 'border-destructive' : ''}
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive">{errors.phone}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="address1">Adresse *</Label>
                      <Input
                        id="address1"
                        value={shippingForm.address1}
                        onChange={(e) => updateField('address1', e.target.value)}
                        placeholder="123 Rue de Rivoli"
                        className={errors.address1 ? 'border-destructive' : ''}
                      />
                      {errors.address1 && (
                        <p className="text-xs text-destructive">{errors.address1}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="address2">Appartement, suite, etc. (facultatif)</Label>
                      <Input
                        id="address2"
                        value={shippingForm.address2}
                        onChange={(e) => updateField('address2', e.target.value)}
                        placeholder="Apt 4B"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        value={shippingForm.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        placeholder="Paris"
                        className={errors.city ? 'border-destructive' : ''}
                      />
                      {errors.city && (
                        <p className="text-xs text-destructive">{errors.city}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Code postal *</Label>
                      <Input
                        id="postalCode"
                        value={shippingForm.postalCode}
                        onChange={(e) => updateField('postalCode', e.target.value)}
                        placeholder="75001"
                        className={errors.postalCode ? 'border-destructive' : ''}
                      />
                      {errors.postalCode && (
                        <p className="text-xs text-destructive">{errors.postalCode}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="country">Pays *</Label>
                      <Input
                        id="country"
                        value={shippingForm.country}
                        onChange={(e) => updateField('country', e.target.value)}
                        placeholder="France"
                        className={errors.country ? 'border-destructive' : ''}
                      />
                      {errors.country && (
                        <p className="text-xs text-destructive">{errors.country}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button
                      onClick={handleNext}
                      className="text-white hover:opacity-90 rounded-full px-8"
                      style={{ backgroundColor: '#bc8752' }}
                    >
                      Continuer vers la livraison
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Method */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-heading font-semibold mb-1">
                    Méthode de Livraison
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Choisissez votre mode de livraison préféré
                  </p>

                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                    <label
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        shippingMethod === 'standard'
                          ? 'border-luxury bg-luxury/5'
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value="standard" id="standard" />
                        <div className="flex items-center gap-3">
                          <Truck className="size-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">Livraison Standard</p>
                            <p className="text-xs text-muted-foreground">
                              {subtotal >= 50 ? 'GRATUITE' : '5,99€'} &middot; 2-4 jours ouvrés
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold text-sm">
                        {subtotal >= 50 ? 'GRATUITE' : '5,99€'}
                      </span>
                    </label>

                    <label
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        shippingMethod === 'express'
                          ? 'border-luxury bg-luxury/5'
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value="express" id="express" />
                        <div className="flex items-center gap-3">
                          <Package className="size-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">Livraison Express</p>
                            <p className="text-xs text-muted-foreground">
                              9,99€ &middot; 2-3 jours ouvrés
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold text-sm">9,99€</span>
                    </label>
                  </RadioGroup>

                  {subtotal < 50 && shippingMethod === 'standard' && (
                    <p className="text-xs text-muted-foreground mt-3 bg-secondary/50 p-3 rounded-lg">
                      Ajoutez {(50 - subtotal).toFixed(2)}€ de plus pour bénéficier de la livraison standard GRATUITE !
                    </p>
                  )}

                  <div className="flex justify-between mt-8">
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      className="gap-2"
                    >
                      <ArrowLeft className="size-4" />
                      Retour
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="text-white hover:opacity-90 rounded-full px-8"
                      style={{ backgroundColor: '#bc8752' }}
                    >
                      Continuer vers le paiement
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-heading font-semibold mb-1">Paiement</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Choisissez votre mode de paiement
                  </p>

                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3 mb-6">
                    {/* Card Payment */}
                    <label
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-luxury bg-luxury/5'
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <RadioGroupItem value="card" id="card" />
                      <div className="flex items-center gap-3">
                        <CreditCard className="size-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">Carte de crédit / débit</p>
                          <p className="text-xs text-muted-foreground">Payez en toute sécurité avec Stripe</p>
                        </div>
                      </div>
                    </label>

                    {/* SumUp */}
                    <label
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'sumup'
                          ? 'border-luxury bg-luxury/5'
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <RadioGroupItem value="sumup" id="sumup" />
                      <div className="flex items-center gap-3">
                        <div className="size-5 rounded bg-[#00BFFF] flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">S</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">SumUp</p>
                          <p className="text-xs text-muted-foreground">Pay with SumUp</p>
                        </div>
                      </div>
                    </label>


                  </RadioGroup>

                  {/* Payment form / info based on method */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 p-5 rounded-lg bg-secondary/30 border border-border">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <Input
                          id="cardNumber"
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                            const formatted = v.replace(/(.{4})/g, '$1 ').trim();
                            setCardNumber(formatted);
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Date d&apos;expiration</Label>
                          <Input
                            id="cardExpiry"
                            placeholder="MM / YY"
                            value={cardExpiry}
                            onChange={(e) => {
                              let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                              if (v.length >= 2) v = v.slice(0, 2) + ' / ' + v.slice(2);
                              setCardExpiry(v);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCvc">CVC</Label>
                          <Input
                            id="cardCvc"
                            placeholder="123"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Ceci est une caisse de démonstration. Aucun paiement réel ne sera effectué.
                      </p>

                      {/* Payment Logos under card form */}
                      <div className="pt-3 border-t border-border">
                        <PaymentLogos />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'sumup' && (
                    <div className="p-6 rounded-lg bg-secondary/30 border border-border text-center">
                      <div className="size-12 rounded-full bg-[#00BFFF] flex items-center justify-center mx-auto mb-3">
                        <span className="text-white text-lg font-bold">S</span>
                      </div>
                      <p className="font-medium text-sm mb-1">Payer avec SumUp</p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Vous serez redirigé vers SumUp pour finaliser votre paiement.
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Ceci est une caisse de démonstration. Aucun paiement réel ne sera effectué.
                      </p>

                      {/* Payment Logos under SumUp form */}
                      <div className="pt-4 border-t border-border mt-4">
                        <PaymentLogos />
                      </div>
                    </div>
                  )}

                  {/* Security badge */}
                  <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <ShieldCheck className="size-4 text-emerald-500" />
                    <span>Paiement 100% sécurisé — Vos données sont protégées</span>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button variant="ghost" onClick={handleBack} className="gap-2">
                      <ArrowLeft className="size-4" />
                      Retour
                    </Button>
                    <Button
                      onClick={handleSubmitOrder}
                      disabled={isSubmitting}
                      className="text-white hover:opacity-90 rounded-full px-8 min-w-[180px]"
                      style={{ backgroundColor: '#bc8752' }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        `Commander — ${total.toFixed(2)}€`
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Order Confirmation */}
              {currentStep === 3 && (
                <div className="text-center py-8">
                  <div className="size-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <Check className="size-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-heading font-semibold mb-2">
                    Merci pour votre commande !
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    Votre commande a été passée avec succès.
                  </p>
                  {orderNumber && (
                    <p className="text-sm font-medium bg-secondary px-4 py-2 rounded-full inline-block mb-4">
                      Commande {orderNumber}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mb-6">
                    Un e-mail de confirmation a été envoyé à <strong>{shippingForm.email}</strong>
                  </p>

                  {/* Account creation notice */}
                  {accountCreated && (
                    <div className="bg-luxury/5 border border-luxury/20 rounded-xl p-5 mb-6 text-left max-w-md mx-auto">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="size-8 rounded-full bg-luxury/10 flex items-center justify-center shrink-0">
                          <Check className="size-4 text-luxury" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Compte créé avec succès
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Vos identifiants de connexion ont été envoyés par e-mail.
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Un compte a été automatiquement créé pour vous avec votre adresse e-mail.
                        Consultez votre boîte de réception pour retrouver vos identifiants et suivre vos commandes en toute simplicité.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => navigateTo('home')}
                      className="text-white hover:opacity-90 rounded-full px-8"
                      style={{ backgroundColor: '#bc8752' }}
                    >
                      Continuer les achats
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigateTo('order-tracking')}
                      className="rounded-full px-8"
                    >
                      Suivre ma commande
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigateTo('customer-dashboard')}
                      className="rounded-full px-8"
                    >
                      Voir les commandes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          {currentStep < 3 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-border p-6 sticky top-40">
                <h3 className="font-heading font-semibold text-lg mb-4">Résumé de la commande</h3>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
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
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          {item.product.brand}
                        </p>
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qté : {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium flex-shrink-0">
                        {(item.product.price * item.quantity).toFixed(2)}€
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-medium">GRATUITE</span>
                      ) : (
                        `${shippingCost.toFixed(2)}€`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">TVA (20%)</span>
                    <span>{tax.toFixed(2)}€</span>
                  </div>

                  <Separator />
                  <div className="flex justify-between font-heading font-semibold text-lg">
                    <span>Total</span>
                    <span>{total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
