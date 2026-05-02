'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  User,
  ShoppingBag,
  Menu,
  Heart,
  X,
  ShieldCheck,
  LayoutDashboard,
  LogIn,
  Search,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCartStore } from '@/store/use-cart-store';
import { useStore } from '@/store/use-store';
import LoginDialog from '@/components/auth/LoginDialog';
import { categories } from '@/data/products';

// ─── Navigation Items ───────────────────────────────────────────
const navItems = [
  { label: 'ACCUEIL', action: 'home' as const },
  { label: 'BOUTIQUE', action: 'category' as const, slug: 'boutique' },
  { label: 'MAKEUP', action: 'category' as const, slug: 'makeup' },
  { label: 'LINGERIE', action: 'category' as const, slug: 'lingerie' },
  { label: 'ACCESSOIRES', action: 'category' as const, slug: 'accessoires' },
  { label: 'BLOG', action: 'blog' as const },
  { label: 'CONTACT', action: 'contact-page' as const },
];

const mobileQuickLinks = [
  { label: 'Espace Client', icon: User, page: 'espace-client' as const },
  { label: 'Contact', icon: ChevronRight, page: 'contact-page' as const },
];

// ─── Colors (Amiy Design System) ────────────────────────────────
const C = {
  primary: '#663130',
  primaryLight: '#7a3d3b',
  primaryDark: '#4d2524',
  black: '#000000',
  tertiary: '#F4F2ED',
  quaternary: '#FBEADE',
  border: '#E8E4DE',
  sectionBg: '#F9F7F4',
  textLight: '#666666',
  textMuted: '#999999',
};

export default function LuxuriaHeader() {
  const [promoBarVisible, setPromoBarVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginDefaultMode, setLoginDefaultMode] = useState<'login' | 'register'>('login');
  const itemCount = useCartStore((s) => s.getItemCount());
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const navigateTo = useStore((s) => s.navigateTo);
  const currentUser = useStore((s) => s.currentUser);
  const currentPage = useStore((s) => s.currentPage);
  const selectedCategory = useStore((s) => s.selectedCategory);
  const setUser = useStore((s) => s.setUser);

  // Derive active nav from current page and selected category
  const activeNav = useMemo(() => {
    const pageNavMap: Record<string, string> = {
      home: 'ACCUEIL',
      category: 'BOUTIQUE',
      blog: 'BLOG',
      'contact-page': 'CONTACT',
    };
    if (currentPage === 'category') {
      if (selectedCategory === 'makeup') return 'MAKEUP';
      if (selectedCategory === 'lingerie') return 'LINGERIE';
      if (selectedCategory === 'accessoires') return 'ACCESSOIRES';
      return 'BOUTIQUE';
    }
    return pageNavMap[currentPage] || null;
  }, [currentPage, selectedCategory]);

  const handleOpenLogin = () => {
    setLoginDefaultMode('login');
    setLoginOpen(true);
  };

  const handleOpenRegister = () => {
    setLoginDefaultMode('register');
    setLoginOpen(true);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  // Sticky shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for custom event from MobileMenu to open login dialog
  useEffect(() => {
    const openLogin = () => handleOpenLogin();
    window.addEventListener('open-login-dialog', openLogin);
    return () => window.removeEventListener('open-login-dialog', openLogin);
  }, []);

  const handleNavClick = useCallback(
    (item: { label: string; action: string; slug?: string }) => {
      if (item.action === 'home') {
        navigateTo('home');
      } else if (item.action === 'contact-page') {
        navigateTo('contact-page');
      } else if (item.action === 'blog') {
        navigateTo('blog');
      } else if (item.action === 'category' && item.slug) {
        navigateTo('category', { category: item.slug });
      }
    },
    [navigateTo]
  );

  const handleMobileNavigate = (page: string, data?: any) => {
    if (page === 'espace-client') {
      setMobileMenuOpen(false);
      window.dispatchEvent(new CustomEvent('open-login-dialog'));
      return;
    }
    navigateTo(page as any, data);
    setMobileMenuOpen(false);
  };

  const handleOpenCart = () => {
    setMobileMenuOpen(false);
    setTimeout(() => setCartOpen(true), 200);
  };

  return (
    <>
      {/* ================================================================
          1. ANNOUNCEMENT BAR
          ================================================================ */}
      {promoBarVisible && (
        <div
          className="relative z-50 transition-all duration-300"
          style={{ backgroundColor: C.tertiary }}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center h-10">
            <p className="text-sm font-medium tracking-wide text-center" style={{ color: C.primary }}>
              <span className="hidden sm:inline">
                ✨ Livraison gratuite dès 50€ d&apos;achat &nbsp;|&nbsp; -10% avec le code BIENVENUE ✨
              </span>
              <span className="sm:hidden">
                ✨ Livraison gratuite dès 50€ | -10% BIENVENUE ✨
              </span>
            </p>
            <button
              onClick={() => setPromoBarVisible(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
              style={{ color: C.textMuted }}
              aria-label="Fermer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================================================================
          2. MAIN HEADER — Sticky
          ================================================================ */}
      <header
        className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${
          isScrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.08)]' : ''
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* ── LEFT: Hamburger (mobile only) ── */}
            <div className="flex items-center gap-2 flex-1 justify-start min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden shrink-0 hover:bg-transparent"
                style={{ color: C.black }}
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Ouvrir le menu"
              >
                <Menu className="size-5" />
              </Button>
            </div>

            {/* ── CENTER: Logo ── */}
            <div className="absolute left-1/2 -translate-x-1/2 z-10">
              <button
                onClick={() => navigateTo('home')}
                className="font-heading font-bold text-lg sm:text-xl md:text-[22px] tracking-wider uppercase transition-colors whitespace-nowrap"
                style={{ color: C.black }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.black)}
              >
                CHIC GLAM BY EVA
              </button>
            </div>

            {/* ── RIGHT: Search + User + Heart + Bag ── */}
            <div className="flex items-center gap-0.5 sm:gap-1.5 flex-1 justify-end min-w-0">
              {/* Search (desktop only) */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex shrink-0 hover:bg-transparent"
                style={{ color: C.textLight }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textLight)}
                aria-label="Rechercher"
              >
                <Search className="size-[20px]" />
              </Button>

              {/* Account / User button */}
              {currentUser ? (
                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 relative hover:bg-transparent"
                    style={{ color: C.textLight }}
                    aria-label="Mon Compte"
                  >
                    <div
                      className="size-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                      style={{ backgroundColor: C.primary }}
                    >
                      {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                    </div>
                    {currentUser.role === 'admin' && (
                      <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center">
                        <ShieldCheck className="size-1.5 text-white" strokeWidth={3} />
                      </span>
                    )}
                  </Button>

                  {/* ── User Dropdown ── */}
                  <div
                    className="absolute right-0 top-full mt-2 w-60 bg-white rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                    style={{ border: `1px solid ${C.border}` }}
                  >
                    {/* User info header */}
                    <div className="px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="size-10 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                          style={{ backgroundColor: C.primary }}
                        >
                          {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: C.black }}>
                            {currentUser.name || 'Utilisateur'}
                          </p>
                          <p className="text-xs truncate" style={{ color: C.textMuted }}>
                            {currentUser.email}
                          </p>
                        </div>
                      </div>
                      {currentUser.role === 'admin' && (
                        <div className="mt-2">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                            style={{
                              backgroundColor: '#FEF3C7',
                              color: '#92400E',
                              border: '1px solid #FDE68A',
                            }}
                          >
                            <ShieldCheck className="size-3" />
                            Admin
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Dropdown links */}
                    <div className="py-1">
                      <button
                        onClick={() => navigateTo('customer-dashboard')}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors"
                        style={{ color: C.textLight }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = C.tertiary;
                          e.currentTarget.style.color = C.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = C.textLight;
                        }}
                      >
                        <User className="size-4" style={{ color: C.textMuted }} />
                        Mon Compte
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => navigateTo('admin-dashboard')}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors"
                          style={{ color: '#92400E' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FEF3C7';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <LayoutDashboard className="size-4" />
                          Tableau de Bord
                        </button>
                      )}

                      <div style={{ borderTop: `1px solid ${C.border}`, margin: '2px 0' }} />

                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors"
                        style={{ color: '#cc3333' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FEF2F2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <LogOut className="size-4" />
                        Se Déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 hover:bg-transparent"
                  style={{ color: C.textLight }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.textLight)}
                  aria-label="Se connecter"
                  onClick={handleOpenLogin}
                >
                  <LogIn className="size-5" />
                </Button>
              )}

              {/* Heart / Favorites (desktop only) */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex shrink-0 hover:bg-transparent"
                style={{ color: C.textLight }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textLight)}
                aria-label="Favoris"
              >
                <Heart className="size-[20px]" />
              </Button>

              {/* Cart bag */}
              <Button
                variant="ghost"
                size="icon"
                className="relative shrink-0 hover:bg-transparent"
                style={{ color: C.textLight }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textLight)}
                onClick={() => setCartOpen(true)}
                aria-label="Panier"
              >
                <ShoppingBag className="size-[20px]" />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 size-5 flex items-center justify-center text-[10px] text-white font-bold rounded-full"
                    style={{ backgroundColor: C.primary }}
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* ================================================================
            3. NAVIGATION BAR (Desktop only)
            ================================================================ */}
        <nav
          className="hidden md:block bg-white"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center justify-center gap-0">
              {navItems.map((item) => (
                <li key={item.label} className="relative">
                  <button
                    onClick={() => handleNavClick(item)}
                    className="relative px-5 py-3 text-[13px] font-medium tracking-[0.08em] uppercase transition-colors duration-200 whitespace-nowrap"
                    style={{
                      color: activeNav === item.label ? C.primary : C.textLight,
                    }}
                    onMouseEnter={(e) => {
                      if (activeNav !== item.label) e.currentTarget.style.color = C.primary;
                    }}
                    onMouseLeave={(e) => {
                      if (activeNav !== item.label) e.currentTarget.style.color = C.textLight;
                    }}
                  >
                    {item.label}
                    {/* Active underline indicator */}
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: C.primary,
                        width: activeNav === item.label ? '24px' : '0',
                      }}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* ================================================================
          4. MOBILE MENU — Sheet from left
          ================================================================ */}
      <Sheet open={mobileMenuOpen} onOpenChange={(isOpen) => !isOpen && setMobileMenuOpen(false)}>
        <SheetContent side="left" className="w-full sm:max-w-sm flex flex-col p-0">
          {/* Header */}
          <SheetHeader className="px-6 py-4 flex-shrink-0" style={{ borderBottom: `1px solid ${C.border}` }}>
            <SheetTitle
              className="font-heading font-bold text-xl tracking-wider uppercase"
              style={{ color: C.black }}
            >
              CHIC GLAM BY EVA
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1">
            {/* Search */}
            <div className="px-6 py-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
                  style={{ color: C.textMuted }}
                />
                <Input
                  type="text"
                  placeholder="Rechercher des produits..."
                  className="pl-9 h-10 rounded-lg text-sm placeholder:text-[#999]"
                  style={{
                    backgroundColor: C.tertiary,
                    border: `1px solid ${C.border}`,
                    color: C.black,
                  }}
                />
              </div>
            </div>

            <Separator style={{ backgroundColor: C.border }} />

            {/* Nav links */}
            <div className="px-6 py-4">
              <h3
                className="text-xs font-semibold uppercase tracking-[0.12em] mb-3"
                style={{ color: C.textMuted }}
              >
                Navigation
              </h3>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      handleNavClick(item);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      color: activeNav === item.label ? C.primary : C.textLight,
                      backgroundColor: activeNav === item.label ? C.quaternary : 'transparent',
                    }}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="size-4" style={{ color: C.textMuted }} />
                  </button>
                ))}
              </div>
            </div>

            <Separator style={{ backgroundColor: C.border }} />

            {/* Categories */}
            <div className="px-6 py-4">
              <h3
                className="text-xs font-semibold uppercase tracking-[0.12em] mb-3"
                style={{ color: C.textMuted }}
              >
                Catégories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() =>
                      handleMobileNavigate('category', { category: category.slug })
                    }
                    className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                    style={{ color: C.textLight }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = C.tertiary;
                      e.currentTarget.style.color = C.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = C.textLight;
                    }}
                  >
                    <span>{category.name}</span>
                    <ChevronRight className="size-4" style={{ color: C.border }} />
                  </button>
                ))}
                <button
                  onClick={() => handleMobileNavigate('category', { category: 'offers' })}
                  className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: '#cc3333' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEF2F2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>Offres</span>
                  <ChevronRight className="size-4" style={{ color: '#cc3333', opacity: 0.5 }} />
                </button>
              </div>
            </div>

            <Separator style={{ backgroundColor: C.border }} />

            {/* Quick Links */}
            <div className="px-6 py-4">
              <h3
                className="text-xs font-semibold uppercase tracking-[0.12em] mb-3"
                style={{ color: C.textMuted }}
              >
                Liens rapides
              </h3>
              <div className="space-y-1">
                {mobileQuickLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleMobileNavigate(link.page, undefined)}
                    className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg text-sm transition-colors"
                    style={{ color: C.textLight }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = C.tertiary;
                      e.currentTarget.style.color = C.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = C.textLight;
                    }}
                  >
                    <span>{link.label}</span>
                    <link.icon className="size-4" style={{ color: C.textMuted }} />
                  </button>
                ))}
              </div>
            </div>

            <Separator style={{ backgroundColor: C.border }} />

            {/* Account Actions */}
            <div className="px-6 py-4 pb-8">
              <h3
                className="text-xs font-semibold uppercase tracking-[0.12em] mb-3"
                style={{ color: C.textMuted }}
              >
                Compte
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (currentUser) {
                      navigateTo('customer-dashboard');
                    } else {
                      handleOpenLogin();
                    }
                  }}
                  className="flex items-center gap-3 w-full py-2.5 px-3 rounded-lg text-sm transition-colors"
                  style={{ color: C.textLight }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = C.tertiary;
                    e.currentTarget.style.color = C.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = C.textLight;
                  }}
                >
                  <User className="size-4" style={{ color: C.textMuted }} />
                  <span>{currentUser ? 'Mon Compte' : 'Se Connecter'}</span>
                </button>
                <button
                  className="flex items-center gap-3 w-full py-2.5 px-3 rounded-lg text-sm transition-colors"
                  style={{ color: C.textLight }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = C.tertiary;
                    e.currentTarget.style.color = C.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = C.textLight;
                  }}
                >
                  <Heart className="size-4" style={{ color: C.textMuted }} />
                  <span>Favoris</span>
                </button>
                <button
                  onClick={handleOpenCart}
                  className="flex items-center gap-3 w-full py-2.5 px-3 rounded-lg text-sm transition-colors"
                  style={{ color: C.textLight }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = C.tertiary;
                    e.currentTarget.style.color = C.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = C.textLight;
                  }}
                >
                  <ShoppingBag className="size-4" style={{ color: C.textMuted }} />
                  <span>Panier</span>
                  {itemCount > 0 && (
                    <span
                      className="ml-auto text-xs font-semibold text-white px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: C.primary }}
                    >
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* ================================================================
          5. LOGIN / REGISTER DIALOG
          ================================================================ */}
      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        defaultMode={loginDefaultMode}
      />
    </>
  );
}
