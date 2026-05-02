'use client';

import { useState } from 'react';
import {
  X,
  Home,
  ShoppingBag,
  User,
  Package,
  Heart,
  HelpCircle,
  Phone,
  ChevronDown,
  ChevronRight,
  Truck,
  RotateCcw,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/store/use-store';
import { useCartStore } from '@/store/use-cart-store';
import { categories } from '@/data/products';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { navigateTo, currentUser } = useStore();
  const { getItemCount } = useCartStore();

  const toggleCategory = (slug: string) => {
    setExpandedCategory(expandedCategory === slug ? null : slug);
  };

  const handleNavigate = (page: string, data?: any) => {
    navigateTo(page as any, data);
    onClose();
  };

  const menuItems = [
    { icon: Home, label: 'Accueil', action: () => handleNavigate('home') },
    { icon: ShoppingBag, label: 'Boutique', action: () => handleNavigate('category', { slug: 'all', name: 'Boutique' }) },
    { icon: Heart, label: 'Favoris', action: () => handleNavigate('home') },
    { icon: Package, label: 'Mes commandes', action: () => handleNavigate('orders') },
    { icon: User, label: 'Mon compte', action: () => handleNavigate('account') },
  ];

  const helpItems = [
    { icon: Truck, label: 'Livraison', action: () => handleNavigate('page', 'shipping') },
    { icon: RotateCcw, label: 'Retours', action: () => handleNavigate('page', 'returns') },
    { icon: FileText, label: 'CGV', action: () => handleNavigate('page', 'cgv') },
    { icon: HelpCircle, label: 'FAQ', action: () => handleNavigate('page', 'faq') },
    { icon: Phone, label: 'Contact', action: () => handleNavigate('page', 'contact') },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-[85%] max-w-sm bg-white overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold" style={{ color: '#bc8752' }}>
                CHIC GLAM
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User info */}
            {currentUser ? (
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
            ) : (
              <div className="px-4 py-3 border-b border-gray-100">
                <Button
                  className="w-full text-white text-sm"
                  style={{ backgroundColor: '#bc8752' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a07040')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#bc8752')}
                  onClick={() => handleNavigate('login')}
                >
                  Se connecter / S&apos;inscrire
                </Button>
              </div>
            )}

            {/* Main menu */}
            <div className="p-4">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#bc8752] transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {item.label === 'Mon compte' && (
                      <span className="ml-auto rounded-full px-2 py-0.5 bg-[#bc8752] text-white text-xs">
                        0
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Categories */}
            <div className="p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Catégories
              </h3>
              <div className="space-y-1">
                {categories.map((cat: any) => (
                  <div key={cat.id || cat.slug}>
                    <button
                      onClick={() => {
                        if (cat.subcategories?.length) {
                          toggleCategory(cat.slug);
                        } else {
                          handleNavigate('category', { slug: cat.slug, name: cat.name });
                        }
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#bc8752] transition-colors"
                    >
                      <span>{cat.name}</span>
                      {cat.subcategories?.length ? (
                        expandedCategory === cat.slug ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )
                      ) : null}
                    </button>
                    <AnimatePresence>
                      {expandedCategory === cat.slug && cat.subcategories && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden ml-4"
                        >
                          {cat.subcategories.map((sub: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={() =>
                                handleNavigate('category', {
                                  slug: cat.slug,
                                  name: sub.name,
                                  subcategory: sub.slug,
                                })
                              }
                              className="flex w-full items-center px-3 py-2 text-sm text-gray-500 hover:text-[#bc8752] transition-colors"
                            >
                              {sub.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Help */}
            <div className="p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Aide
              </h3>
              <div className="space-y-1">
                {helpItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#bc8752] transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 mt-4">
              <Button
                className="w-full text-white font-medium"
                style={{ backgroundColor: '#bc8752' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a07040')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#bc8752')}
                onClick={() => handleNavigate('category', { slug: 'all', name: 'Boutique' })}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Explorer la boutique
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
