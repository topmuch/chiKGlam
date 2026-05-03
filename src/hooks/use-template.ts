'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/use-store';

export function useTemplate() {
  const activeTemplate = useStore((s) => s.activeTemplate);
  const isGolden = activeTemplate === 'golden';
  const isLuxuria = activeTemplate === 'luxuria';
  const isGlamshop = activeTemplate === 'glamshop';
  const setActiveTemplate = useStore((s) => s.setActiveTemplate);

  const [isReady, setIsReady] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Read localStorage directly (synchronous) to ensure template is available
    // before marking as ready. This prevents flash of default template when
    // Zustand persist hasn't hydrated yet.
    try {
      const cached = localStorage.getItem('activeTemplate');
      if (cached && cached !== activeTemplate) {
        setActiveTemplate(cached);
      }
    } catch {
      // localStorage not available
    }

    // Mark ready on next tick so setActiveTemplate takes effect first
    requestAnimationFrame(() => {
      setIsReady(true);
    });

    // Fetch from API as source of truth and update
    async function fetchTemplate() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.settings?.activeTemplate) {
          setActiveTemplate(data.settings.activeTemplate);
          try {
            localStorage.setItem('activeTemplate', data.settings.activeTemplate);
          } catch {
            // ignore
          }
        }
      } catch {
        // If API fails, keep whatever we had from localStorage
      }
    }
    fetchTemplate();
  }, [activeTemplate, setActiveTemplate]);

  return { activeTemplate, isGold: false, isGolden, isLuxuria, isGlamshop, isReady, setActiveTemplate };
}
