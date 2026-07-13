import Link from 'next/link';
import Image from 'next/image';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import styles from './SiteFooter.module.css';

/**
 * SiteFooter — ported from the approved HTML prototype's footer markup.
 * Server Component (no interactivity of its own beyond the embedded
 * NewsletterForm, which is its own client component).
 */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.newsletterWrap}>
        <NewsletterForm />
      </div>

      <div className={styles.grid}>
        <div className={styles.brandCol}>
          <div className={styles.logo}>
            <Image src="/brand/logo.png" alt="LifeLegends" width={22} height={22} className={styles.glyph} />
            LIFELEGENDS
          </div>
          <p>Honoring the lives that inspire generations, one story at a time.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link href="/legends">Biographies</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/#timeline">Timeline</Link></li>
          </ul>
        </div>
        <div>
          <h4>Information</h4>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li><Link href="/contact">Help Center</Link></li>
            <li><Link href="/contact">Suggest a Legend</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} LifeLegends. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default SiteFooter;
