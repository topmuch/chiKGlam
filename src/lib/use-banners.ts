'use client';

import { useState, useEffect } from 'react';

export interface BannerData {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
  promoProductIds: string;
  promoStartDate: string | null;
  promoEndDate: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetches active banners from the database by type.
 * Falls back to static data if the API is unavailable.
 */
export function useBanners(type: string) {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`/api/banners?type=${type}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.banners)) {
          const active = data.banners.filter((b: BannerData) => b.isActive);
          setBanners(active);
        }
      } catch {
      }
      setLoading(false);
    };
    fetchBanners();
  }, [type]);

  return { banners, loading };
}
