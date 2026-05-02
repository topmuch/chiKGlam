'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, ShoppingCart } from 'lucide-react';

interface AddToCartNotificationProps {
  show: boolean;
  productName?: string;
  onClose: () => void;
}

export default function AddToCartNotification({
  show,
  productName = 'Article',
  onClose,
}: AddToCartNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-lg bg-white px-5 py-4 shadow-2xl border border-gray-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#bc8752]">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-gray-900">Ajouté au panier !</p>
            <p className="text-xs text-gray-500">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-2 rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
