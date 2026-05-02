'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Package,
  ClipboardList,
  Loader2,
  ShoppingBag,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/use-cart-store';
import { useStore } from '@/store/use-store';
import Image from 'next/image';

const steps = [
  { id: 1, label: 'Informations', icon: ClipboardList },
  { id: 2, label: 'Livraison', icon: MapPin },
  { id: 3, label: 'Paiement', icon: CreditCard },
  { id: 4, label: 'Confirmation', icon: Package },
];

const shippingMethods = [
  { id: 'standard', label: 'Livraison standard', desc: '3-5 jours ouvrables', price: 0 },
  { id: 'express', label: 'Livraison express', desc: '1-2 jours ouvrables', price: 5.99 },
  { id: 'pickup', label: 'Retrait en magasin', desc: 'Disponible sous 2h', price: 0 },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');

  const { items, getTotal, clearCart } = useCartStore();
  const { navigateTo, goBack } = useStore();

  const total = getTotal();
  const shipping = shippingMethods.find((m) => m.id === shippingMethod)?.price || 0;
  const grandTotal = total + shipping;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    if (currentStep === 3) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setOrderConfirmed(true);
        setOrderNumber(`CG-${Date.now().toString(36).toUpperCase()}`);
        setCurrentStep(4);
        clearCart();
      }, 2000);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    navigateTo('home');
  };

  const ctaStyle = {
    backgroundColor: '#bc8752',
    color: 'white',
  };

  const ctaHoverEnter = (e: React.MouseEvent) => {
    e.currentTarget.style.backgroundColor = '#a07040';
  };
  const ctaHoverLeave = (e: React.MouseEvent) => {
    e.currentTarget.style.backgroundColor = '#bc8752';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#bc8752] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la boutique
          </button>

          {/* Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                      currentStep >= step.id
                        ? 'text-white'
                        : currentStep === step.id - 1
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                    style={
                      currentStep >= step.id
                        ? { backgroundColor: '#bc8752' }
                        : undefined
                    }
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      currentStep >= step.id ? 'text-[#bc8752]' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 w-12 sm:w-20 mb-6 transition-colors ${
                      currentStep > step.id ? 'bg-[#bc8752]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Vos Informations</h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input
                          id="firstName"
                          placeholder="Marie"
                          value={formData.firstName}
                          onChange={(e) => updateField('firstName', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input
                          id="lastName"
                          placeholder="Dupont"
                          value={formData.lastName}
                          onChange={(e) => updateField('lastName', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="marie@example.com"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Téléphone *</Label>
                        <Input
                          id="phone"
                          placeholder="+33 6 12 34 56 78"
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Adresse *</Label>
                      <Input
                        id="address"
                        placeholder="12 Rue de la Paix"
                        value={formData.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="postalCode">Code postal *</Label>
                        <Input
                          id="postalCode"
                          placeholder="75002"
                          value={formData.postalCode}
                          onChange={(e) => updateField('postalCode', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Ville *</Label>
                        <Input
                          id="city"
                          placeholder="Paris"
                          value={formData.city}
                          onChange={(e) => updateField('city', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Pays</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => updateField('country', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Mode de Livraison</h2>

                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                    <div className="space-y-3">
                      {shippingMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center justify-between rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                            shippingMethod === method.id
                              ? 'border-[#bc8752] bg-[#bc8752]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={method.id} />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{method.label}</p>
                              <p className="text-xs text-gray-500">{method.desc}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold">
                            {method.price === 0 ? 'Gratuit' : `${method.price.toFixed(2)} €`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Paiement</h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardName">Nom sur la carte *</Label>
                      <Input
                        id="cardName"
                        placeholder="MARIE DUPONT"
                        value={formData.cardName}
                        onChange={(e) => updateField('cardName', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Numéro de carte *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        value={formData.cardNumber}
                        onChange={(e) => updateField('cardNumber', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardExpiry">Expiration *</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/AA"
                          value={formData.cardExpiry}
                          onChange={(e) => updateField('cardExpiry', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardCvc">CVC *</Label>
                        <Input
                          id="cardCvc"
                          placeholder="123"
                          value={formData.cardCvc}
                          onChange={(e) => updateField('cardCvc', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <ShieldCheck className="h-4 w-4" style={{ color: '#bc8752' }} />
                      <span>Paiement sécurisé par chiffrement SSL</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && orderConfirmed && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl p-8 shadow-sm text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
                  >
                    <Check className="h-10 w-10 text-green-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Commande confirmée !
                  </h2>
                  <p className="text-gray-500 mb-4">
                    Merci pour votre commande. Un email de confirmation vous sera envoyé.
                  </p>
                  <p className="text-sm text-gray-400 mb-6">
                    Commande n° <span className="font-bold text-gray-700">{orderNumber}</span>
                  </p>
                  <Button
                    className="text-white font-semibold"
                    style={ctaStyle}
                    onMouseEnter={ctaHoverEnter}
                    onMouseLeave={ctaHoverLeave}
                    onClick={handleFinish}
                    size="lg"
                  >
                    Retour à la boutique
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          {currentStep < 4 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
                <h3 className="text-base font-bold text-gray-900 mb-4">Résumé de commande</h3>

                <div className="space-y-3 mb-4">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#bc8752] text-[10px] font-bold text-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.price?.toFixed(2)} €</p>
                      </div>
                      <span className="text-sm font-semibold">
                        {(item.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sous-total</span>
                    <span className="font-medium">{total.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Livraison</span>
                    <span className="font-medium text-green-600">
                      {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{grandTotal.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Navigation buttons */}
                <div className="mt-6 space-y-3">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      className="w-full font-medium"
                      onClick={handlePrev}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Précédent
                    </Button>
                  )}

                  {currentStep < 3 && (
                    <Button
                      className="w-full text-white font-semibold"
                      style={ctaStyle}
                      onMouseEnter={ctaHoverEnter}
                      onMouseLeave={ctaHoverLeave}
                      onClick={handleNext}
                    >
                      {currentStep === 1 ? 'Continuer vers la livraison' : 'Continuer vers le paiement'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}

                  {currentStep === 3 && (
                    <Button
                      className="w-full text-white font-semibold"
                      style={ctaStyle}
                      onMouseEnter={ctaHoverEnter}
                      onMouseLeave={ctaHoverLeave}
                      onClick={handleNext}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Traitement en cours...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Valider la commande
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
