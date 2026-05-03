'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Bell, Package } from 'lucide-react';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface NewOrderNotification {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  itemsCount: number;
  createdAt: string;
  status: string;
}

interface AdminOrderNotificationProps {
  latestOrder: NewOrderNotification | null;
  onDismiss: () => void;
  onViewOrder: () => void;
}

export function AdminOrderNotification({
  latestOrder,
  onDismiss,
  onViewOrder,
}: AdminOrderNotificationProps) {
  const handleClose = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  const handleViewOrder = useCallback(() => {
    onViewOrder();
  }, [onViewOrder]);

  // Auto-close after 8 seconds
  useEffect(() => {
    if (!latestOrder) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 8000);
    return () => clearTimeout(timer);
  }, [latestOrder, onDismiss]);

  // Close on Escape
  useEffect(() => {
    if (!latestOrder) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [latestOrder, onDismiss]);

  const isOpen = !!latestOrder;

  if (!isOpen || !latestOrder) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[100]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Bell className="size-4 text-amber-600" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground uppercase tracking-wide">
                    Nouvelle Commande
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                  aria-label="Fermer"
                >
                  <X className="size-4 text-gray-500" />
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 mx-6" />

              {/* Order info */}
              <div className="px-6 py-4">
                {/* Order icon and number */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-16 sm:size-20 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="size-8 text-amber-600" />
                  </div>

                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">
                      Commande
                    </p>
                    <h3 className="text-lg font-bold text-foreground leading-snug">
                      {latestOrder.orderNumber}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Package className="size-3" />
                      {latestOrder.itemsCount} article{latestOrder.itemsCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Customer info */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Cliente</span>
                    <span className="text-sm font-medium text-foreground truncate ml-4">
                      {latestOrder.customerName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">E-mail</span>
                    <span className="text-xs text-foreground truncate ml-4">
                      {latestOrder.customerEmail}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Date</span>
                    <span className="text-xs text-foreground ml-4">
                      {formatDateTime(latestOrder.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 mx-6" />

              {/* Total */}
              <div className="px-6 py-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Montant de la commande
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {formatCurrency(latestOrder.total)}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="px-6 pb-6 pt-4 space-y-2.5">
                <button
                  onClick={handleViewOrder}
                  className="w-full py-3 bg-foreground text-background text-sm font-semibold rounded-lg hover:bg-foreground/90 transition-colors"
                >
                  VOIR LA COMMANDE
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-white text-foreground text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  FERMER
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
