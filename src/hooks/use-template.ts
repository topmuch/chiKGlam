'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/use-store';

export function useTemplate() {
  const activeTemplate = useStore((s) => s.activeTemplate);
  // isGold is deprecated — Golden template uses separate GoldenHeader/GoldenFooter
  // Kept for backward compatibility with default template components
  const isGold = false;
  const isGolden = activeTemplate === 'golden';
  const isLuxuria = activeTemplate === 'luxuria';
  const isGlamshop = activeTemplate === 'glamshop';
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
      } catch {
      }
    }
    fetchTemplate();
  }, [setActiveTemplate]);

  return { activeTemplate, isGold, isGolden, isLuxuria, isGlamshop, setActiveTemplate };
}
