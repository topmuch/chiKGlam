'use client';

import { useStore } from '@/store/use-store';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTemplate } from '@/hooks/use-template';

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
  const { currentPage, selectedCategory, selectedProduct } = useStore();
  const { isLuxuria, isGolden, isGlamshop } = useTemplate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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

  // ============================================================
  // Glamshop Template Layout
  // ============================================================
  if (isGlamshop) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
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
