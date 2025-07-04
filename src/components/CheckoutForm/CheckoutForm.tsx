'use client';

import { useState } from 'react';
import { OrderData, WebhookPayload } from '@/types';
import { sendWebhookToMiddleware } from '@/utils/api';
import styles from './CheckoutForm.module.css';

interface CheckoutFormProps {
  onWebhookSent?: (payload: WebhookPayload) => void;
}

export default function CheckoutForm({ onWebhookSent }: CheckoutFormProps) {
  const [orderData, setOrderData] = useState<OrderData>({
    buyer_first_name: 'João',
    buyer_last_name: 'Silva',
    buyer_email: 'joao@email.com',
    event_name: 'Tech Conference 2024',
    event_id: 'EVT_123456',
    total_order_amount: 150.00
  });

  const [loading, setLoading] = useState(false);
  const [webhookSent, setWebhookSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof OrderData, value: string | number) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const simulateOrderApproval = async () => {
    setLoading(true);
    setError(null);

    try {
      const webhookPayload: WebhookPayload = {
        event: 'order.approved',
        data: {
          ...orderData,
          order_identifier: `ORDER_${Date.now()}`,
          order_status: 'approved'
        },
        timestamp: new Date().toISOString()
      };

      await sendWebhookToMiddleware(webhookPayload);
      setWebhookSent(true);
      onWebhookSent?.(webhookPayload);

      // Reset após 3 segundos
      setTimeout(() => setWebhookSent(false), 3000);
      
    } catch (err) {
      setError('Erro ao simular webhook. Verifique se o middleware está rodando.');
      console.error('Erro ao simular webhook:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          🎟️ Sympla Checkout Simulator
        </h1>
        <p className={styles.subtitle}>
          Simule uma compra na Sympla para testar a integração com a Agroforestree
        </p>
      </div>

      <div className={styles.formCard}>
        <h2 className={styles.cardTitle}>
          📝 Dados do Pedido
        </h2>
        
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="buyer_first_name" className={styles.label}>Nome</label>
            <input
              id="buyer_first_name"
              type="text"
              value={orderData.buyer_first_name}
              onChange={(e) => handleInputChange('buyer_first_name', e.target.value)}
              className={styles.input}
              placeholder="João"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="buyer_last_name" className={styles.label}>Sobrenome</label>
            <input
              id="buyer_last_name"
              type="text"
              value={orderData.buyer_last_name}
              onChange={(e) => handleInputChange('buyer_last_name', e.target.value)}
              className={styles.input}
              placeholder="Silva"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="buyer_email" className={styles.label}>E-mail</label>
            <input
              id="buyer_email"
              type="email"
              value={orderData.buyer_email}
              onChange={(e) => handleInputChange('buyer_email', e.target.value)}
              className={styles.input}
              placeholder="joao@email.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="event_name" className={styles.label}>Nome do Evento</label>
            <input
              id="event_name"
              type="text"
              value={orderData.event_name}
              onChange={(e) => handleInputChange('event_name', e.target.value)}
              className={styles.input}
              placeholder="Tech Conference 2024"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="event_id" className={styles.label}>ID do Evento</label>
            <input
              id="event_id"
              type="text"
              value={orderData.event_id}
              onChange={(e) => handleInputChange('event_id', e.target.value)}
              className={styles.input}
              placeholder="EVT_123456"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="total_order_amount" className={styles.label}>Valor Total (R$)</label>
            <input
              id="total_order_amount"
              type="number"
              step="0.01"
              value={orderData.total_order_amount}
              onChange={(e) => handleInputChange('total_order_amount', parseFloat(e.target.value))}
              className={styles.input}
              placeholder="150.00"
            />
          </div>
        </div>

        <div className={styles.impactCard}>
          <div className={styles.impactHeader}>
            <span className={styles.impactIcon}>🌱</span>
            <h3 className={styles.impactTitle}>Impacto Agroflorestal</h3>
          </div>
          <p className={styles.impactText}>
            Ao finalizar esta compra, uma árvore será plantada em sistemas agroflorestais, 
            apoiando pequenos agricultores e regenerando o planeta.
          </p>
          <div className={styles.impactStats}>
            <span className={styles.stat}>1 árvore plantada</span>
            <span className={styles.stat}>165kg CO₂ compensado</span>
            <span className={styles.stat}>1 agricultor apoiado</span>
          </div>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            ⚠️ {error}
          </div>
        )}

        {webhookSent && (
          <div className={styles.successAlert}>
            ✅ Webhook enviado com sucesso! Verifique o dashboard para ver o resultado.
          </div>
        )}

        <button
          onClick={simulateOrderApproval}
          disabled={loading}
          className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
        >
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              Processando...
            </>
          ) : (
            <>
              🚀 Simular Compra Aprovada
            </>
          )}
        </button>
      </div>
    </div>
  );
}