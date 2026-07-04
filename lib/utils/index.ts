import { clsx, type ClassValue } from 'clsx';

/** Merge conditional class names — used across every component. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** URL-safe slug from a legend/category name. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** "Jan 1856" style era label from a year. */
export function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `${year}`;
}

/** Reading time estimate for EstimatedReadTime — 200 wpm average. */
export function estimateReadingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Clamp a number between min/max — used by scroll-progress calculations. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Format a large count like 700 -> "700+", 1250 -> "1.2K+". */
export function formatStatValue(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}K+`;
  return `${value}+`;
}
