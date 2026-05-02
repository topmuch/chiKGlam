'use client';

import Image from 'next/image';
import { ShoppingBag, X, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { useCartStore } from '@/store/use-cart-store';
import { useStore } from '@/store/use-store';

export default function CartSlidePanel() {
  const items = useCartStore((s) => s.items);
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const navigateTo = useStore((s) => s.navigateTo);

  const itemCount = getItemCount();
  const subtotal = getTotal();

  const handleCheckout = () => {
    setCartOpen(false);
    navigateTo('checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => setCartOpen(open)}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-border flex-shrink-0">
          <SheetTitle className="font-heading text-lg font-semibold text-foreground">
            Panier ({itemCount} {itemCount === 1 ? 'article' : 'articles'})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
              <ShoppingBag className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
              Votre panier est vide
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Vous n'avez pas encore ajouté d'articles à votre panier.
            </p>
            <Button
              onClick={() => setCartOpen(false)}
              className="w-full rounded-full px-6 h-11 font-semibold text-white hover:opacity-90"
              style={{ backgroundColor: '#bc8752' }}
            >
              Commencer vos achats
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1">
              <div className="px-6 py-4 space-y-0">
                {items.map((item, index) => (
                  <div key={item.product.id}>
                    <div className="flex gap-4 py-4">
                      {/* Product Image */}
                      <button
                        onClick={() => {
                          setCartOpen(false);
                          navigateTo('product', { product: item.product });
                        }}
                        className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-secondary"
                      >
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          unoptimized
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </button>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => {
                            setCartOpen(false);
                            navigateTo('product', { product: item.product });
                          }}
                          className="text-left"
                        >
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            {item.product.brand}
                          </p>
                          <p className="text-sm font-medium text-foreground truncate mt-0.5">
                            {item.product.name}
                          </p>
                        </button>
                        <p className="text-sm font-semibold text-foreground mt-1">
                          {item.product.price.toFixed(2)}€
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border rounded-full">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="size-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="size-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="size-7 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-secondary"
                            aria-label="Remove item"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {index < items.length - 1 && (
                      <Separator className="bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <SheetFooter className="border-t border-border px-6 py-4 flex-col gap-3 flex-shrink-0">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-muted-foreground">Sous-total</span>
                <span className="text-lg font-heading font-semibold text-foreground">
                  {subtotal.toFixed(2)}€
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Frais de port et taxes calculés à la validation
              </p>
              <Button
                onClick={handleCheckout}
                className="w-full rounded-full h-11 font-semibold text-white hover:opacity-90"
                style={{ backgroundColor: '#bc8752' }}
              >
                Valider la commande
              </Button>
              <Button
                variant="ghost"
                className="w-full text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setCartOpen(false)}
              >
                Continuer les achats
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
