'use client';

import { useState } from 'react';
import styles from './PayloadViewer.module.css';

interface PayloadViewerProps {
  title: string;
  data: any;
  type?: 'request' | 'response' | 'webhook';
}

export default function PayloadViewer({ title, data, type = 'request' }: PayloadViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'webhook':
        return '🪝';
      case 'response':
        return '📤';
      default:
        return '📥';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'webhook':
        return 'var(--color-secondary)';
      case 'response':
        return 'var(--color-primary)';
      default:
        return 'var(--color-gray-600)';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <span 
            className={styles.typeIcon}
            style={{ color: getTypeColor() }}
          >
            {getTypeIcon()}
          </span>
          <h3 className={styles.title}>{title}</h3>
          <span 
            className={styles.typeBadge}
            style={{ backgroundColor: getTypeColor() }}
          >
            {type.toUpperCase()}
          </span>
        </div>
        
        <div className={styles.actions}>
          <button
            onClick={handleCopy}
            className={`${styles.actionButton} ${copied ? styles.copied : ''}`}
            title="Copiar JSON"
          >
            {copied ? '✅' : '📋'}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.actionButton}
            title={isExpanded ? 'Recolher' : 'Expandir'}
          >
            {isExpanded ? '🔼' : '🔽'}
            {isExpanded ? 'Recolher' : 'Expandir'}
          </button>
        </div>
      </div>

      <div className={`${styles.content} ${isExpanded ? styles.expanded : ''}`}>
        <div className={styles.summary}>
          {data && typeof data === 'object' && (
            <div className={styles.summaryGrid}>
              {data.event && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Evento:</span>
                  <span className={styles.summaryValue}>{data.event}</span>
                </div>
              )}
              {data.timestamp && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Timestamp:</span>
                  <span className={styles.summaryValue}>
                    {new Date(data.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
              {data.data?.order_identifier && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Order ID:</span>
                  <span className={styles.summaryValue}>{data.data.order_identifier}</span>
                </div>
              )}
              {data.donationId && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Donation ID:</span>
                  <span className={styles.summaryValue}>{data.donationId}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {isExpanded && (
          <div className={styles.jsonContainer}>
            <pre className={styles.jsonContent}>
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}