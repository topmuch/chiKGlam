'use client';

import { useStore } from '@/store/use-store';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
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

export default function Page() {
  const { currentPage, selectedCategory, selectedProduct } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
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
      default:
        return <HomePage />;
    }
  };

  const hideFooter = currentPage === 'checkout' || currentPage === 'customer-dashboard' || currentPage === 'admin-dashboard';

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
            {renderPage()}
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
