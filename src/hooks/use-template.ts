'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/use-store';

export function useTemplate() {
  const activeTemplate = useStore((s) => s.activeTemplate);
  const isGold = activeTemplate === 'gold';
  const isGolden = activeTemplate === 'golden';
  const isLuxuria = activeTemplate === 'luxuria';
  const setActiveTemplate = useStore((s) => s.setActiveTemplate);

  // Fetch template setting from API on mount
  useEffect(() => {
    async function fetchTemplate() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.settings?.activeTemplate) {
          setActiveTemplate(data.settings.activeTemplate);
        }
      } catch (e) {
        console.error('Failed to fetch template:', e);
      }
    }
    fetchTemplate();
  }, [setActiveTemplate]);

  return { activeTemplate, isGold, isGolden, isLuxuria, setActiveTemplate };
}
