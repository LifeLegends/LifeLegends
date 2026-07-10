'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useSearchOverlay } from '@/lib/providers/SearchProvider';
import styles from './SiteHeader.module.css';

/**
 * SiteHeader — floating glass pill navigation.
 * Ported 1:1 from the approved lifelegends-homepage.html header, with the
 * mobile menu now driven by React state instead of manual DOM classList
 * toggling, and proper aria-expanded wiring (Polish Sprint fix carried over).
 */

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/legends', label: 'Biographies' },
  { href: '/about', label: 'About' },
];

export interface SiteHeaderProps {
  activePath?: string;
}

export function SiteHeader({ activePath = '/' }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: openSearch } = useSearchOverlay();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={cn(styles.header, scrolled && styles.scrolled)}>
        <Link href="/" className={styles.logo}>
          <Image src="/brand/logo.png" alt="LifeLegends" width={28} height={28} className={styles.glyph} priority />
          LIFELEGENDS
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(styles.navLink, activePath === link.href && styles.navLinkActive)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.headerRight}>
          <button type="button" className={styles.iconBtn} aria-label="Search" aria-haspopup="dialog" onClick={openSearch}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button
            type="button"
            className={cn(styles.iconBtn, styles.mobileToggle)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </header>

      <div className={cn(styles.mobileMenu, mobileOpen && styles.mobileMenuOpen)} role="dialog" aria-modal="true" aria-hidden={!mobileOpen}>
        <button type="button" className={styles.closeX} onClick={() => setMobileOpen(false)}>
          Close ✕
        </button>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}

export default SiteHeader;

