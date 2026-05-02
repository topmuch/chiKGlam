'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { User, ShoppingBag, Menu, Heart, X, ShieldCheck, LayoutDashboard, Package, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/use-cart-store';
import { useStore } from '@/store/use-store';
import { useTemplate } from '@/hooks/use-template';
import MegaMenu from '@/components/layout/MegaMenu';
import MobileMenu from '@/components/layout/MobileMenu';
import LoginDialog from '@/components/auth/LoginDialog';

const navItems = [
  { label: 'ACCUEIL', action: 'home' as const },
  { label: 'BOUTIQUE', action: 'category' as const, slug: 'boutique' },
  { label: 'MAKEUP', action: 'category' as const, slug: 'makeup' },
  { label: 'LINGERIE', action: 'category' as const, slug: 'lingerie' },
  { label: 'ACCESSOIRES', action: 'category' as const, slug: 'accessoires' },
  { label: 'ESPACE CLIENT', action: 'espace-client' as const },
  { label: 'CONTACT', action: 'contact-page' as const },
];

export default function Header() {
  const [promoBarVisible, setPromoBarVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginDefaultMode, setLoginDefaultMode] = useState<'login' | 'register'>('login');
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemCount = useCartStore((s) => s.getItemCount());
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const navigateTo = useStore((s) => s.navigateTo);
  const { isGold } = useTemplate();
  const currentUser = useStore((s) => s.currentUser);
  const setUser = useStore((s) => s.setUser);

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

  const handleNavMouseEnter = useCallback((item: { label: string; action: string; slug?: string }) => {
    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
      navTimeoutRef.current = null;
    }
    if (item.action === 'home' || item.action === 'contact-page' || item.action === 'espace-client' || item.action === 'boutique') {
      setActiveCategory(null);
      setMegaMenuOpen(false);
      return;
    }
    setActiveCategory(item.slug || item.label);
    setMegaMenuOpen(true);
  }, []);

  const handleNavMouseLeave = useCallback(() => {
    navTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
      setActiveCategory(null);
    }, 200);
  }, []);

  const handleNavClick = useCallback(
    (item: { label: string; action: string; slug?: string }) => {
      if (item.action === 'home') {
        navigateTo('home');
      } else if (item.action === 'contact-page') {
        navigateTo('contact-page');
      } else if (item.action === 'espace-client') {
        handleOpenLogin();
      } else if (item.action === 'category' && item.slug) {
        navigateTo('category', { category: item.slug });
      }
    },
    [navigateTo]
  );

  return (
    <>
      {/* ===== 1. Promotional Top Bar ===== */}
      {promoBarVisible && (
        <div className={`text-white relative z-50 ${isGold ? 'bg-[#bc8752]' : 'bg-black'}`}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center h-10">
            <p className="text-sm font-semibold tracking-wide text-center">
              <span className="hidden sm:inline">
                ✨ Livraison gratuite dès 100€ d&apos;achat &nbsp;|&nbsp; Retours gratuits sous 15 jours &nbsp;|&nbsp; ★ Trustpilot 4.8/5 ✨
              </span>
              <span className="sm:hidden">
                ✨ Livraison gratuite dès 100€ &nbsp;|&nbsp; Retours gratuits 15j ✨
              </span>
            </p>
            <button
              onClick={() => setPromoBarVisible(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===== 2. Main Header ===== */}
      <header
        className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${
          isScrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* LEFT: Hamburger (mobile) */}
            <div className="flex items-center gap-2 flex-1 justify-start min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden shrink-0"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </div>

            {/* CENTER: Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 z-10">
              <button
                onClick={() => navigateTo('home')}
                className="font-heading font-bold text-lg sm:text-xl md:text-2xl tracking-tight text-foreground hover:opacity-80 transition-opacity whitespace-nowrap"
                style={{ width: '265px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                CHIC GLAM BY EVA
              </button>
            </div>

            {/* RIGHT: User + Heart + Bag */}
            <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end min-w-0">
              {/* Account / User button */}
              {currentUser ? (
                <div className="relative group">
                  <Button variant="ghost" size="icon" className="shrink-0 relative" aria-label="Mon Compte">
                    <div className="size-7 rounded-full bg-luxury text-luxury-foreground flex items-center justify-center text-xs font-semibold">
                      {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                    </div>
                    {currentUser.role === 'admin' && (
                      <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center">
                        <ShieldCheck className="size-1.5 text-white" strokeWidth={3} />
                      </span>
                    )}
                  </Button>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <div className="size-9 rounded-full bg-luxury text-luxury-foreground flex items-center justify-center text-sm font-semibold shrink-0">
                          {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{currentUser.name || currentUser.email}</p>
                          <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                        </div>
                      </div>
                      {currentUser.role === 'admin' && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold uppercase tracking-wider border border-amber-200">
                            <ShieldCheck className="size-3" />
                            Admin
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => navigateTo('customer-dashboard')}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left hover:bg-secondary transition-colors"
                      >
                        <User className="size-4 text-muted-foreground" />
                        Mon Compte
                      </button>
                      {currentUser.role === 'admin' && (
                        <>
                          <button
                            onClick={() => navigateTo('admin-dashboard')}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left hover:bg-secondary transition-colors text-amber-700"
                          >
                            <LayoutDashboard className="size-4" />
                            Tableau de Bord
                          </button>
                          <Separator />
                          <button
                            onClick={() => navigateTo('category', { category: 'boutique' })}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left hover:bg-secondary transition-colors"
                          >
                            <Package className="size-4 text-muted-foreground" />
                            Voir la Boutique
                          </button>
                        </>
                      )}
                      <Separator />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-destructive hover:bg-secondary transition-colors"
                      >
                        <X className="size-4" />
                        Se Déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  aria-label="Se connecter"
                  onClick={handleOpenLogin}
                >
                  <LogIn className="size-5" />
                </Button>
              )}

              <Button variant="ghost" size="icon" className="hidden sm:inline-flex shrink-0" aria-label="Wishlist">
                <Heart className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative shrink-0"
                onClick={() => setCartOpen(true)}
                aria-label="Shopping bag"
              >
                <ShoppingBag className="size-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-[10px] bg-luxury text-luxury-foreground border-0 rounded-full">
                    {itemCount > 99 ? '99+' : itemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* ===== 3. Navigation Bar ===== */}
        <nav
          className="hidden md:block border-b border-gray-200 bg-white"
          onMouseLeave={handleNavMouseLeave}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center justify-center gap-0">
              {navItems.map((item) => (
                <li key={item.label} className="relative">
                  <button
                    onMouseEnter={() => handleNavMouseEnter(item)}
                    onClick={() => handleNavClick(item)}
                    className={`px-5 py-3 text-sm font-medium tracking-wide uppercase transition-colors whitespace-nowrap ${
                      activeCategory === (item.slug || item.label)
                        ? 'text-black border-b-2 border-black'
                        : 'text-gray-600 hover:text-black hover:border-b-2 hover:border-black'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* MegaMenu positioned below header */}
        <div
          onMouseEnter={() => {
            if (navTimeoutRef.current) {
              clearTimeout(navTimeoutRef.current);
              navTimeoutRef.current = null;
            }
          }}
          onMouseLeave={handleNavMouseLeave}
        >
          <MegaMenu
            isOpen={megaMenuOpen}
            onClose={() => {
              setMegaMenuOpen(false);
              setActiveCategory(null);
            }}
            activeCategory={activeCategory}
          />
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* ===== Login / Register Dialog (extracted component) ===== */}
      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        defaultMode={loginDefaultMode}
      />
    </>
  );
}
