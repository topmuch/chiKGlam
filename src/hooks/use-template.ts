'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useStore } from '@/store/use-store';

// Global store for template readiness — avoids setState-in-effect lint error
let _isReady = false;
const readyListeners = new Set<() => void>();
function setReady() {
  _isReady = true;
  readyListeners.forEach((fn) => fn());
}
function subscribeToReady(cb: () => void) {
  readyListeners.add(cb);
  return () => readyListeners.delete(cb);
}
function getReadySnapshot() { return _isReady; }

export function useTemplate() {
  const activeTemplate = useStore((s) => s.activeTemplate);
  const isGold = false;
  const isGolden = activeTemplate === 'golden';
  const isLuxuria = activeTemplate === 'luxuria';
  const isGlamshop = activeTemplate === 'glamshop';
  const setActiveTemplate = useStore((s) => s.setActiveTemplate);

  // Use useSyncExternalStore to avoid setState-in-effect
  const isReady = useSyncExternalStore(subscribeToReady, getReadySnapshot, () => false);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // 1) First: restore from localStorage for instant render (no flash)
    try {
      const cached = localStorage.getItem('activeTemplate');
      if (cached && cached !== 'default') {
        setActiveTemplate(cached);
      }
    } catch {
      // localStorage not available
    }
    setReady();

    // 2) Then: fetch from API as source of truth and update
    async function fetchTemplate() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.settings?.activeTemplate) {
          setActiveTemplate(data.settings.activeTemplate);
          // Cache in localStorage for next visit
          try {
            localStorage.setItem('activeTemplate', data.settings.activeTemplate);
          } catch {
            // ignore
          }
        }
      } catch {
        // If API fails, keep whatever we had from localStorage or default
      }
    }
    fetchTemplate();
  }, [setActiveTemplate]);

  return { activeTemplate, isGold, isGolden, isLuxuria, isGlamshop, isReady, setActiveTemplate };
}
