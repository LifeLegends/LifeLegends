import type { Source } from '@/lib/types/domain';
import styles from './BioSources.module.css';

export interface BioSourcesProps {
  sources: Source[];
}

export function BioSources({ sources }: BioSourcesProps) {
  return (
    <ul className={styles.list}>
      {sources.map((source) => (
        <li key={source.name}>
          <span className={styles.name}>{source.name}</span>
          <span>{source.description}</span>
        </li>
      ))}
    </ul>
  );
}

export default BioSources;
