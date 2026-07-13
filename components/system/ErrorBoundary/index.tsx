import styles from './ErrorBoundary.module.css';

/**
 * ErrorBoundary
 * Category: system
 * Status: SCAFFOLD ONLY — structure + typed props, no markup/animation yet.
 * Implemented in Phase 2+ per the approved SDD component inventory (§4).
 */

export interface ErrorBoundaryProps {
  className?: string;
}

export function ErrorBoundary({ className }: ErrorBoundaryProps) {
  return null;
}

export default ErrorBoundary;
