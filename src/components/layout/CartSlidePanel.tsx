'use client';

import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCartStore } from '@/store/use-cart-store';
import { useStore } from '@/store/use-store';

interface CartSlidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartSlidePanel({ open, onOpenChange }: CartSlidePanelProps) {
  const { items, removeItem, updateQuantity, getTotal, getItemCount, clearCart } =
    useCartStore();
  const { navigateTo, setCartOpen } = useStore();

  const total = getTotal();
  const itemCount = getItemCount();

  const handleCheckout = () => {
    onOpenChange(false);
    navigateTo('checkout');
  };

  const handleContinueShopping = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingBag className="h-5 w-5" style={{ color: '#bc8752' }} />
            Mon Panier ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <ShoppingBag className="h-10 w-10 text-gray-300" />
            </div>
            <p className="text-center text-gray-500">Votre panier est vide</p>
            <Button
              className="text-white font-medium"
              style={{ backgroundColor: '#bc8752' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a07040')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#bc8752')}
              onClick={handleContinueShopping}
            >
              Continuer mes achats
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4">
              <div className="flex flex-col gap-4 pb-4">
                {items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-sm font-semibold text-gray-700 mt-0.5">
                          {item.price?.toFixed(2)} €
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-[#bc8752] hover:text-[#bc8752] transition-colors"
                            onClick={() =>
                              item.quantity > 1
                                ? updateQuantity(item.id, item.quantity - 1)
                                : removeItem(item.id)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-[#bc8752] hover:text-[#bc8752] transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="border-t bg-white px-4 py-4">
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Sous-total</span>
                  <span className="text-sm font-semibold">{total.toFixed(2)} €</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Livraison</span>
                  <span className="text-sm font-semibold text-green-600">Gratuite</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-base font-bold">{total.toFixed(2)} €</span>
                </div>
                <Button
                  className="w-full text-white font-semibold py-5"
                  style={{ backgroundColor: '#bc8752' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a07040')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#bc8752')}
                  onClick={handleCheckout}
                  size="lg"
                >
                  Passer à la caisse
                </Button>
                <Button
                  variant="outline"
                  className="w-full font-medium"
                  style={{ borderColor: '#bc8752', color: '#bc8752' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#bc8752';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#bc8752';
                  }}
                  onClick={handleContinueShopping}
                >
                  Continuer mes achats
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
