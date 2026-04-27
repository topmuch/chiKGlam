'use client';

import { Search, User, Heart, ShoppingBag, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { categories } from '@/data/products';
import { useCartStore } from '@/store/use-cart-store';
import { useStore } from '@/store/use-store';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const menuLinks = [
  { label: 'Boutique', icon: ChevronRight, page: 'category' as const, data: { category: 'boutique' } },
  { label: 'Espace Client', icon: ChevronRight, page: 'espace-client' as const },
  { label: 'Contact', icon: ChevronRight, page: 'contact-page' as const },
];

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const navigateTo = useStore((s) => s.navigateTo);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const itemCount = getItemCount();

  const handleNavigate = (page: string, data?: any) => {
    if (page === 'espace-client') {
      onClose();
      // Dispatch custom event to open login dialog
      window.dispatchEvent(new CustomEvent('open-login-dialog'));
      return;
    }
    navigateTo(page as any, data);
    onClose();
  };

  const handleOpenCart = () => {
    onClose();
    setTimeout(() => setCartOpen(true), 200);
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="left" className="w-full sm:max-w-sm flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-border flex-shrink-0">
          <SheetTitle className="font-heading font-bold text-xl tracking-tight text-foreground">
            CHIC GLAM BY EVA
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1">
          {/* Search */}
          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Rechercher des produits..."
                className="pl-9 h-10 rounded-full bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-ring text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* Categories */}
          <div className="px-6 py-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Catégories
            </h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    handleNavigate('category', { category: category.slug })
                  }
                  className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  <span>{category.name}</span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              ))}
              <button
                onClick={() =>
                  handleNavigate('category', { category: 'offers' })
                }
                className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg text-sm font-medium text-promo hover:bg-secondary transition-colors"
              >
                <span>Offres</span>
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <Separator />

          {/* Quick Links */}
          <div className="px-6 py-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Liens rapides
            </h3>
            <div className="space-y-1">
              {menuLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavigate(link.page, link.data)}
                  className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <span>{link.label}</span>
                  <link.icon className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Account Actions */}
          <div className="px-6 py-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Compte
            </h3>
            <div className="space-y-1">
              <button className="flex items-center gap-3 w-full py-2.5 px-3 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors">
                <User className="size-4 text-muted-foreground" />
                <span>Mon Compte</span>
              </button>
              <button className="flex items-center gap-3 w-full py-2.5 px-3 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors">
                <Heart className="size-4 text-muted-foreground" />
                <span>Favoris</span>
              </button>
              <button
                onClick={handleOpenCart}
                className="flex items-center gap-3 w-full py-2.5 px-3 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <ShoppingBag className="size-4 text-muted-foreground" />
                <span>Panier</span>
                {itemCount > 0 && (
                  <span className="ml-auto text-xs font-medium bg-luxury text-luxury-foreground px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
