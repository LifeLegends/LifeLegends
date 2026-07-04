/**
 * Central font configuration.
 *
 * Fraunces  → display/headline face (serif, matches the reference's large
 *             cinematic headlines). Free, SIL OFL, via next/font/google.
 * Inter     → stand-in for "General Sans" from the SDD. Also free/OFL.
 *             Swap for General Sans (Fontshare, self-hosted) later by
 *             replacing this single file — nothing else references
 *             font names directly, only the CSS variables below.
 *
 * Both are loaded with `display: 'swap'` and exposed as CSS variables
 * consumed by styles/tokens.css (--font-display / --font-body).
 */

import { Fraunces, Inter } from 'next/font/google';

export const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const generalSans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-general-sans',
  display: 'swap',
});

/** Combine into a single className string for <html>. */
export const fontVariables = `${fraunces.variable} ${generalSans.variable}`;
