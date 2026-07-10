import type { ReactNode } from 'react';
import styles from './CardGrid.module.css';

export interface CardGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

/** CardGrid — shared responsive grid wrapper (4 → 2 → 1 col) used by every card section. */
export function CardGrid({ children, columns = 4 }: CardGridProps) {
  return <div className={`${styles.grid} ${styles[`cols${columns}`]}`}>{children}</div>;
}

export default CardGrid;
