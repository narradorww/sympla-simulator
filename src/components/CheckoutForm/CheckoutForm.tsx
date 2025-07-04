'use client';

import { useState, useEffect } from 'react';
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
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [approvedOrders, setApprovedOrders] = useState<Array<{id: string, timestamp: string, eventName: string}>>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  // Carregar dados do localStorage ao montar o componente
  useEffect(() => {
    const savedLastOrderId = localStorage.getItem('sympla-simulator-last-order');
    const savedApprovedOrders = localStorage.getItem('sympla-simulator-approved-orders');
    
    if (savedLastOrderId) {
      setLastOrderId(savedLastOrderId);
    }
    
    if (savedApprovedOrders) {
      try {
        const orders = JSON.parse(savedApprovedOrders);
        setApprovedOrders(orders);
        // Se não há ordem selecionada, usar a mais recente
        if (orders.length > 0 && !selectedOrderId) {
          setSelectedOrderId(orders[orders.length - 1].id);
        }
      } catch (error) {
        console.error('Erro ao carregar pedidos do localStorage:', error);
      }
    }
  }, [selectedOrderId]);

  const handleInputChange = (field: keyof OrderData, value: string | number) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const simulateWebhook = async (eventType: WebhookPayload['event']) => {
    setLoading(true);
    setError(null);

    try {
      // Para cancelamentos e reembolsos, usar o order_id selecionado ou criar novo
      const orderId = (eventType === 'order.cancelled' || eventType === 'order.refunded') && selectedOrderId
        ? selectedOrderId
        : `ORDER_${Date.now()}`;

      const webhookPayload: WebhookPayload = {
        event: eventType,
        data: {
          ...orderData,
          order_identifier: orderId,
          order_status: eventType === 'order.approved' ? 'approved' : 'pending'
        },
        timestamp: new Date().toISOString()
      };

      await sendWebhookToMiddleware(webhookPayload);
      setWebhookSent(true);
      onWebhookSent?.(webhookPayload);

      // Salvar order_id para cancelamentos futuros
      if (eventType === 'order.approved') {
        setLastOrderId(orderId);
        
        // Adicionar à lista de pedidos aprovados
        const newOrder = {
          id: orderId,
          timestamp: new Date().toISOString(),
          eventName: orderData.event_name
        };
        
        const updatedOrders = [...approvedOrders, newOrder];
        setApprovedOrders(updatedOrders);
        setSelectedOrderId(orderId);
        
        // Salvar no localStorage
        localStorage.setItem('sympla-simulator-last-order', orderId);
        localStorage.setItem('sympla-simulator-approved-orders', JSON.stringify(updatedOrders));
      }

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

        <div className={styles.buttonGroup}>
          <button
            onClick={() => simulateWebhook('order.approved')}
            disabled={loading}
            className={`${styles.submitButton} ${styles.approveButton} ${loading ? styles.loading : ''}`}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Processando...
              </>
            ) : (
              <>
                ✅ Simular Compra Aprovada
              </>
            )}
          </button>

          <button
            onClick={() => simulateWebhook('order.cancelled')}
            disabled={loading || approvedOrders.length === 0}
            className={`${styles.submitButton} ${styles.cancelButton} ${loading ? styles.loading : ''}`}
            title={approvedOrders.length === 0 ? 'Primeiro faça uma compra aprovada' : ''}
          >
            ❌ Simular Cancelamento
          </button>

          <button
            onClick={() => simulateWebhook('order.refunded')}
            disabled={loading || approvedOrders.length === 0}
            className={`${styles.submitButton} ${styles.refundButton} ${loading ? styles.loading : ''}`}
            title={approvedOrders.length === 0 ? 'Primeiro faça uma compra aprovada' : ''}
          >
            💰 Simular Reembolso
          </button>
        </div>

        {approvedOrders.length > 0 && (
          <div className={styles.orderSelection}>
            <label htmlFor="orderSelect" className={styles.orderLabel}>
              Pedido para cancelar/reembolsar:
            </label>
            <select
              id="orderSelect"
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className={styles.orderSelect}
            >
              {approvedOrders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.id} - {order.eventName} ({new Date(order.timestamp).toLocaleString('pt-BR')})
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                localStorage.removeItem('sympla-simulator-last-order');
                localStorage.removeItem('sympla-simulator-approved-orders');
                setApprovedOrders([]);
                setSelectedOrderId('');
                setLastOrderId(null);
              }}
              className={styles.clearButton}
              title="Limpar histórico de pedidos"
            >
              🗑️ Limpar Histórico
            </button>
          </div>
        )}

        {lastOrderId && (
          <div className={styles.orderInfo}>
            <span className={styles.orderLabel}>Último pedido criado:</span>
            <code className={styles.orderId}>{lastOrderId}</code>
          </div>
        )}
      </div>
    </div>
  );
}