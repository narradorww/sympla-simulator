'use client';

import { useState } from 'react';
import styles from './PayloadViewer.module.css';

interface PayloadViewerProps {
  title: string;
  data: unknown;
  type?: 'request' | 'response' | 'webhook';
}

export default function PayloadViewer({ title, data, type = 'request' }: PayloadViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatJson = (obj: unknown): string => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatJson(data));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Erro ao copiar');
    }
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'request': return '📤';
      case 'response': return '📥';
      case 'webhook': return '🔗';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'request': return 'var(--color-secondary)';
      case 'response': return 'var(--color-primary)';
      case 'webhook': return '#7c3aed';
      default: return 'var(--color-gray-600)';
    }
  };

  return (
    <div className={styles.container}>
      <div 
        className={styles.header}
        style={{ borderLeftColor: getTypeColor(type) }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.headerContent}>
          <span className={styles.icon}>{getTypeIcon(type)}</span>
          <span className={styles.title}>{title}</span>
          <span className={styles.type}>{type.toUpperCase()}</span>
        </div>
        <div className={styles.actions}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className={styles.copyButton}
            title="Copiar JSON"
          >
            {copied ? '✅' : '📋'}
          </button>
          <span className={styles.expandIcon}>
            {isExpanded ? '📁' : '📂'}
          </span>
        </div>
      </div>

      <div className={`${styles.content} ${isExpanded ? styles.expanded : ''}`}>
        <div className={styles.jsonContainer}>
          <pre className={styles.jsonContent}>
            <code>{formatJson(data)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}