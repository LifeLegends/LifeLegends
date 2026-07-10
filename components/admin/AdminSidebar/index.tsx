'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { signOutAction } from '@/lib/supabase/auth-actions';
import styles from './AdminSidebar.module.css';

const LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/biographies', label: 'Biographies' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/media', label: 'Media Library' },
];

export interface AdminSidebarProps {
  userEmail?: string;
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Image src="/brand/logo.png" alt="LifeLegends" width={20} height={20} className={styles.glyph} />
        LIFELEGENDS
      </div>
      <nav>
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.link} ${pathname?.startsWith(link.href) ? styles.active : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className={styles.footer}>
        <div className={styles.who}>
          <div>{userEmail ?? 'Admin'}</div>
          <div className={styles.role}>Administrator</div>
        </div>
        <form action={signOutAction}>
          <button type="submit" className={styles.logoutBtn}>Sign out</button>
        </form>
      </div>
    </aside>
  );
}

export default AdminSidebar;
