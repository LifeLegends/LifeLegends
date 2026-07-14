'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

interface SearchContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearchOverlay() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearchOverlay must be used within SearchProvider');
  return ctx;
}

/**
 * SearchProvider — makes the search overlay's open/close state available
 * app-wide, so the header icon, a ⌘K shortcut, and any future "search for
 * a legend" CTA can all trigger the same overlay instance.
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return <SearchContext.Provider value={{ isOpen, open, close }}>{children}</SearchContext.Provider>;
}
