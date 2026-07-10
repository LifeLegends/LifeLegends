'use client';

import { useEffect, useState } from 'react';
import styles from './BioTimelineNav.module.css';

export interface BioTimelineNavProps {
  sections: { id: string; label: string }[];
}

/** BioTimelineNav — sticky scroll-spy nav for the biography page (desktop only, per Design Bible §25). */
export function BioTimelineNav({ sections }: BioTimelineNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -40% 0px' },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className={styles.nav} aria-label="Biography sections">
      {sections.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={`${styles.link} ${activeId === s.id ? styles.active : ''}`} aria-current={activeId === s.id ? 'true' : undefined}>
          {s.label}
        </a>
      ))}
    </nav>
  );
}

export default BioTimelineNav;
