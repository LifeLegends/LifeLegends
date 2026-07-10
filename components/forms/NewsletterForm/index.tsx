'use client';

import { useState, type FormEvent } from 'react';
import styles from './NewsletterForm.module.css';

/**
 * NewsletterForm — posts to /api/newsletter (Phase 1 route handler).
 * Handles loading/success/error states explicitly rather than assuming
 * the request succeeds, per production error-handling requirements.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className={styles.panel}>
      <h3>Get the stories that inspire generations, delivered monthly.</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          required
          placeholder="Enter your email"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading' || status === 'success'}
        />
        <button type="submit" className={styles.btn} disabled={status === 'loading' || status === 'success'}>
          <span>
            {status === 'loading' && 'Sending…'}
            {status === 'success' && 'Subscribed ✓'}
            {(status === 'idle' || status === 'error') && 'Subscribe'}
          </span>
        </button>
      </form>
      {status === 'error' && <p className={styles.error}>Something went wrong — please try again.</p>}
    </div>
  );
}

export default NewsletterForm;
