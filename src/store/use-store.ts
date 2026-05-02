import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PageType, Product, User } from '@/types';

interface StoreState {
  currentPage: PageType;
  selectedCategory: string | null;
  selectedProduct: Product | null;
  selectedBlogSlug: string | null;
  previousPage: PageType;
  currentUser: User | null;
  activeTemplate: string;
  navigateTo: (page: PageType, data?: any) => void;
  goBack: () => void;
  setUser: (user: User | null) => void;
  setActiveTemplate: (template: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      currentPage: 'home',
      selectedCategory: null,
      selectedProduct: null,
      selectedBlogSlug: null,
      previousPage: 'home',
      currentUser: null,
      activeTemplate: 'default',
      navigateTo: (page, data) => set((state) => ({
        currentPage: page,
        selectedCategory: data?.category || null,
        selectedProduct: data?.product || null,
        selectedBlogSlug: data?.slug || null,
        previousPage: state.currentPage,
      })),
      goBack: () => set((state) => ({
        currentPage: state.previousPage,
        previousPage: state.currentPage,
      })),
      setUser: (user) => set({ currentUser: user }),
      setActiveTemplate: (template) => set({ activeTemplate: template }),
    }),
    {
      name: 'chicglam-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        activeTemplate: state.activeTemplate,
        currentPage: state.currentPage,
        selectedBlogSlug: state.selectedBlogSlug,
        selectedCategory: state.selectedCategory,
      }),
    }
  )
);
