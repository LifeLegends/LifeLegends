'use client';

import { useRef, useState } from 'react';
import { marked } from 'marked';
import styles from './MarkdownEditor.module.css';

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface ToolbarAction {
  label: string;
  wrap: [string, string];
  block?: boolean;
}

const ACTIONS: ToolbarAction[] = [
  { label: 'H2', wrap: ['## ', ''], block: true },
  { label: 'H3', wrap: ['### ', ''], block: true },
  { label: 'Bold', wrap: ['**', '**'] },
  { label: 'Italic', wrap: ['_', '_'] },
  { label: 'Quote', wrap: ['> ', ''], block: true },
  { label: 'List', wrap: ['- ', ''], block: true },
  { label: 'Image', wrap: ['![alt text](', ')'] },
];

/**
 * MarkdownEditor — the "Full Biography" rich content editor. Stores real
 * Markdown (not HTML), which supports headings, paragraphs, bold/italic,
 * bullet lists, blockquotes, and images natively and safely, with a live
 * preview rendered via `marked` — the same renderer used on the public
 * biography page, so what the admin sees here is what visitors will see.
 */
export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function applyAction(action: ToolbarAction) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const [before, after] = action.wrap;

    const insertion = action.block && start > 0 && value[start - 1] !== '\n'
      ? `\n${before}${selected}${after}`
      : `${before}${selected}${after}`;

    const next = value.slice(0, start) + insertion + value.slice(end);
    onChange(next);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPos = start + insertion.length - after.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.actions}>
          {ACTIONS.map((action) => (
            <button key={action.label} type="button" className={styles.actionBtn} onClick={() => applyAction(action)}>
              {action.label}
            </button>
          ))}
        </div>
        <div className={styles.tabs}>
          <button type="button" className={tab === 'write' ? styles.tabActive : styles.tab} onClick={() => setTab('write')}>Write</button>
          <button type="button" className={tab === 'preview' ? styles.tabActive : styles.tab} onClick={() => setTab('preview')}>Preview</button>
        </div>
      </div>

      {tab === 'write' ? (
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={16}
        />
      ) : (
        <div
          className={styles.preview}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: value.trim() ? marked.parse(value) as string : '<p class="empty">Nothing to preview yet.</p>' }}
        />
      )}

      <p className={styles.hint}>Supports Markdown: ## headings, **bold**, _italic_, &gt; quotes, - lists, and ![alt](image-url) images.</p>
    </div>
  );
}

export default MarkdownEditor;
