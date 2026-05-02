'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types';

interface UseProductsOptions {
  category?: string;
  sort?: string;
  limit?: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

// Fetch products from the database API
export function useProducts(options: UseProductsOptions = {}) {
  return useQuery<ProductsResponse, Error, Product[]>({
    queryKey: ['products', options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options.category) params.set('category', options.category);
      if (options.sort) params.set('sort', options.sort);
      if (options.limit) params.set('limit', options.limit.toString());
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return data;
    },
    select: (data) => data.products,
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
}

// Fetch trending products (random)
export function useTrendingProducts() {
  return useProducts({ sort: 'random', limit: 8 });
}

// Fetch newest arrivals (Makeup only)
export function useNewArrivals() {
  return useProducts({ category: 'Makeup', sort: 'newest', limit: 8 });
}

// Fetch products by category
export function useProductsByCategory(category: string) {
  return useProducts({ category, sort: 'featured' });
}

// Fetch bestsellers
export function useBestsellers() {
  return useProducts({ sort: 'bestselling', limit: 10 });
}

// Helper to manually refetch all product queries
export function useRefetchProducts() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };
}
