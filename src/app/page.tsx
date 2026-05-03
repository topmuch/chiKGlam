'use client';

import { useStore } from '@/store/use-store';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTemplate } from '@/hooks/use-template';
import { MaintenancePage } from '@/components/shared/MaintenancePage';

// Default template components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartSlidePanel from '@/components/layout/CartSlidePanel';
import { CookieConsentBanner } from '@/components/layout/CookieConsentBanner';
import { AddToCartNotification } from '@/components/shared/AddToCartNotification';
import { HomePage } from '@/components/home/HomePage';
import { CategoryPage } from '@/components/category/CategoryPage';
import { ProductPage } from '@/components/product/ProductPage';
import CheckoutPage from '@/components/checkout/CheckoutPage';
import CustomerDashboard from '@/components/customer/CustomerDashboard';
import AdminDashboard from '@/components/admin/AdminDashboard';
import {
  AboutPage,
  CGVPage,
  PrivacyPage,
  ContactPage,
  FAQPage,
  ShippingPage,
  ReturnsPage,
  CookiesPage,
  LegalPage,
  CareersPage,
  PressPage,
  BlogPage,
} from '@/components/pages/StaticPages';
import OrderTrackingPage from '@/components/order/OrderTrackingPage';

// Luxuria template components
import LuxuriaHeader from '@/components/templates/luxuria/LuxuriaHeader';
import LuxuriaFooter from '@/components/templates/luxuria/LuxuriaFooter';
import LuxuriaHomePage from '@/components/templates/luxuria/LuxuriaHomePage';
import LuxuriaShopPage from '@/components/templates/luxuria/LuxuriaShopPage';
import LuxuriaProductPage from '@/components/templates/luxuria/LuxuriaProductPage';
import LuxuriaCheckoutPage from '@/components/templates/luxuria/LuxuriaCheckoutPage';
import LuxuriaCartPage from '@/components/templates/luxuria/LuxuriaCartPage';
import LuxuriaBlogPage from '@/components/templates/luxuria/LuxuriaBlogPage';

// Glamshop template components
import GlamshopHeader from '@/components/templates/glamshop/GlamshopHeader';
import GlamshopFooter from '@/components/templates/glamshop/GlamshopFooter';
import { GlamshopHomePage } from '@/components/templates/glamshop/GlamshopHomePage';

// Golden template components
import GoldenHeader from '@/components/templates/golden/GoldenHeader';
import GoldenFooter from '@/components/templates/golden/GoldenFooter';
import { GoldenHomePage } from '@/components/templates/golden/GoldenHomePage';
import GoldenShopPage from '@/components/templates/golden/GoldenShopPage';
import GoldenProductPage from '@/components/templates/golden/GoldenProductPage';
import GoldenCheckoutPage from '@/components/templates/golden/GoldenCheckoutPage';
import { GoldenCartPage } from '@/components/templates/golden/GoldenCartPage';
import { GoldenBlogPage } from '@/components/templates/golden/GoldenBlogPage';
import GoldenBlogPostPage from '@/components/templates/golden/GoldenBlogPostPage';

export default function Page() {
  const { currentPage, selectedCategory, selectedProduct, currentUser } = useStore();
  const { isLuxuria, isGolden, isGlamshop, isReady } = useTemplate();
  const [maintenanceInfo, setMaintenanceInfo] = useState<{ mode: boolean; message: string; end: string | null } | null>(null);

  // Check maintenance mode
  useEffect(() => {
    async function checkMaintenance() {
      try {
        const res = await fetch('/api/maintenance');
        const data = await res.json();
        if (data.maintenanceMode) {
          setMaintenanceInfo({
            mode: true,
            message: data.maintenanceMessage || 'Nous effectuons une mise à jour. Revenez bientôt !',
            end: data.maintenanceEnd || null,
          });
        }
      } catch {
        // On error, allow normal access
      }
    }
    checkMaintenance();
    // Poll every 30 seconds in case admin disables maintenance
    const interval = setInterval(checkMaintenance, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Show maintenance page to non-admin users
  const isAdmin = currentUser?.role === 'admin';
  if (maintenanceInfo?.mode && !isAdmin) {
    return <MaintenancePage message={maintenanceInfo.message} endTime={maintenanceInfo.end} />;
  }

  // ============================================================
  // Default Template Rendering
  // ============================================================
  const renderDefaultPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'category':
        return selectedCategory ? <CategoryPage categorySlug={selectedCategory} /> : <HomePage />;
      case 'product':
        return selectedProduct ? <ProductPage product={selectedProduct} /> : <HomePage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'customer-dashboard':
        return <CustomerDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'about':
        return <AboutPage />;
      case 'cgv':
        return <CGVPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'contact-page':
        return <ContactPage />;
      case 'faq':
        return <FAQPage />;
      case 'shipping':
        return <ShippingPage />;
      case 'returns':
        return <ReturnsPage />;
      case 'order-tracking':
        return <OrderTrackingPage />;
      case 'cookies':
        return <CookiesPage />;
      case 'legal':
        return <LegalPage />;
      case 'careers':
        return <CareersPage />;
      case 'press':
        return <PressPage />;
      case 'blog':
        return <BlogPage />;
      case 'blog-post':
        return <BlogPage />;
      default:
        return <HomePage />;
    }
  };

  // ============================================================
  // Shared template page renderer
  // ============================================================
  const renderTemplatePage = (template: 'luxuria' | 'golden') => {
    const Shop = template === 'luxuria' ? LuxuriaShopPage : GoldenShopPage;
    const Product = template === 'luxuria' ? LuxuriaProductPage : GoldenProductPage;
    const Cart = template === 'luxuria' ? LuxuriaCartPage : GoldenCartPage;
    const Checkout = template === 'luxuria' ? LuxuriaCheckoutPage : GoldenCheckoutPage;
    const Blog = template === 'luxuria' ? LuxuriaBlogPage : GoldenBlogPage;
    // Note: Luxuria uses GoldenBlogPostPage for blog post detail (no dedicated LuxuriaBlogPostPage yet)
    const BlogPost = GoldenBlogPostPage;
    const Home = template === 'luxuria' ? LuxuriaHomePage : GoldenHomePage;

    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'category':
        return selectedCategory ? <Shop categorySlug={selectedCategory} /> : <Home />;
      case 'product':
        return selectedProduct ? <Product product={selectedProduct} /> : <Home />;
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'blog':
        return <Blog />;
      case 'blog-post':
        return <BlogPost />;
      case 'customer-dashboard':
        return <CustomerDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'about':
        return <AboutPage />;
      case 'cgv':
        return <CGVPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'contact-page':
        return <ContactPage />;
      case 'faq':
        return <FAQPage />;
      case 'shipping':
        return <ShippingPage />;
      case 'returns':
        return <ReturnsPage />;
      case 'order-tracking':
        return <OrderTrackingPage />;
      case 'cookies':
        return <CookiesPage />;
      case 'legal':
        return <LegalPage />;
      case 'careers':
        return <CareersPage />;
      case 'press':
        return <PressPage />;
      default:
        return <Home />;
    }
  };

  const hideFooter = currentPage === 'checkout' || currentPage === 'customer-dashboard' || currentPage === 'admin-dashboard' || currentPage === 'cart';

  // Wait for template to be determined before rendering (prevents flash of wrong template)
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F7F7' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 rounded-full animate-spin" style={{ borderColor: '#bc875240', borderTopColor: '#bc8752' }} />
        </div>
      </div>
    );
  }

  // Show maintenance banner to admin (so they know it's active and can disable it)
  const maintenanceBanner = maintenanceInfo?.mode && isAdmin ? (
    <div className="bg-amber-500 text-white text-center text-sm py-2 px-4 font-medium">
      ⚠️ Mode maintenance ACTIF — Les visiteurs voient la page de maintenance.{' '}
      <button
        onClick={() => setMaintenanceInfo(null)}
        className="underline ml-2 hover:text-amber-100"
      >Masquer</button>
    </div>
  ) : null;

  // ============================================================
  // Glamshop Template Layout
  // ============================================================
  if (isGlamshop) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        {maintenanceBanner}
        <GlamshopHeader />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentPage === 'home' ? (
                <GlamshopHomePage />
              ) : (
                renderDefaultPage()
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        {!hideFooter && <GlamshopFooter />}
        <CartSlidePanel />
        <AddToCartNotification />
        <CookieConsentBanner />
      </div>
    );
  }

  // ============================================================
  // Golden Template Layout
  // ============================================================
  if (isGolden) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        {maintenanceBanner}
        <GoldenHeader />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTemplatePage('golden')}
            </motion.div>
          </AnimatePresence>
        </main>
        {!hideFooter && <GoldenFooter />}
        <CartSlidePanel />
        <AddToCartNotification />
        <CookieConsentBanner />
      </div>
    );
  }

  // ============================================================
  // Luxuria Template Layout
  // ============================================================
  if (isLuxuria) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        {maintenanceBanner}
        <LuxuriaHeader />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTemplatePage('luxuria')}
            </motion.div>
          </AnimatePresence>
        </main>
        {!hideFooter && <LuxuriaFooter />}
        <CartSlidePanel />
        <AddToCartNotification />
        <CookieConsentBanner />
      </div>
    );
  }

  // ============================================================
  // Default Template Layout
  // ============================================================
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {maintenanceBanner}
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderDefaultPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      {!hideFooter && <Footer />}
      <CartSlidePanel />
      <AddToCartNotification />
      <CookieConsentBanner />
    </div>
  );
}
