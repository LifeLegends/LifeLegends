import styles from './BioQuoteBlock.module.css';

export interface BioQuoteBlockProps {
  quote: string;
  attribution: string;
}

export function BioQuoteBlock({ quote, attribution }: BioQuoteBlockProps) {
  return (
    <section className={styles.section}>
      <svg width="32" height="24" viewBox="0 0 32 24" fill="none" aria-hidden="true">
        <path d="M0 24V13.5C0 6 4.5 1 12 0L13 4C8 5 5.5 7.5 5 11H12V24H0ZM19 24V13.5C19 6 23.5 1 31 0L32 4C27 5 24.5 7.5 24 11H31V24H19Z" fill="#d4af6a" />
      </svg>
      <blockquote className={styles.quote}>{quote}</blockquote>
      <cite className={styles.cite}>— {attribution}</cite>
    </section>
  );
}

export default BioQuoteBlock;
