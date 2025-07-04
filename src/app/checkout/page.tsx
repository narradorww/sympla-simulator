'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutForm from '@/components/CheckoutForm/CheckoutForm';
import PayloadViewer from '@/components/PayloadViewer/PayloadViewer';
import { WebhookPayload } from '@/types';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const [lastWebhook, setLastWebhook] = useState<WebhookPayload | null>(null);
  const router = useRouter();

  const handleWebhookSent = (payload: WebhookPayload) => {
    setLastWebhook(payload);
    
    // Redireciona para o dashboard após 2 segundos
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <button 
          onClick={() => router.push('/dashboard')}
          className={styles.navButton}
        >
          📊 Ver Dashboard
        </button>
      </div>

      <div className={styles.content}>
        <CheckoutForm onWebhookSent={handleWebhookSent} />
        
        {lastWebhook && (
          <div className={styles.webhookResult}>
            <PayloadViewer
              title="Último Webhook Enviado"
              data={lastWebhook}
              type="webhook"
            />
            
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✅</div>
              <div>
                <h3 className={styles.successTitle}>Webhook Enviado!</h3>
                <p className={styles.successText}>
                  Redirecionando para o dashboard em alguns segundos...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>🌱 Sobre a Integração</h4>
            <p className={styles.footerText}>
              Esta é uma prova de conceito da integração entre Sympla e Agroforestree. 
              Cada compra simulada aqui resultará no plantio de uma árvore real em 
              sistemas agroflorestais.
            </p>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>🔧 Componentes Técnicos</h4>
            <ul className={styles.footerList}>
              <li>Middleware Node.js/TypeScript</li>
              <li>Simulador Next.js</li>
              <li>API Agroforestree</li>
              <li>Webhooks Sympla</li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>📈 Impacto Esperado</h4>
            <div className={styles.impactGrid}>
              <div className={styles.impactItem}>
                <span className={styles.impactNumber}>1</span>
                <span className={styles.impactLabel}>Árvore por ingresso</span>
              </div>
              <div className={styles.impactItem}>
                <span className={styles.impactNumber}>165kg</span>
                <span className={styles.impactLabel}>CO₂ compensado</span>
              </div>
              <div className={styles.impactItem}>
                <span className={styles.impactNumber}>20+</span>
                <span className={styles.impactLabel}>Anos de impacto</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}