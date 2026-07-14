'use client';

import { useState } from 'react';
import type { Fact } from '@/lib/types/domain';
import styles from './BioFacts.module.css';

export interface BioFactsProps {
  facts: Fact[];
}

/** BioFacts — expandable accordion, one open at a time, full keyboard support + aria-expanded. */
export function BioFacts({ facts }: BioFactsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={styles.grid}>
      {facts.map((fact, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={fact.summary}
            className={styles.item}
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            onClick={() => setOpenIndex(isOpen ? null : i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setOpenIndex(isOpen ? null : i);
              }
            }}
          >
            <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
            <div className={styles.body}>
              <p className={styles.summary}>{fact.summary}</p>
              <p className={`${styles.expand} ${isOpen ? styles.expandOpen : ''}`}>{fact.expand}</p>
            </div>
            <svg className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

export default BioFacts;
