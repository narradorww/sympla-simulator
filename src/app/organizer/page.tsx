'use client';

import { useState, useEffect } from 'react';
import { fetchEventImpactSummary, fetchEventQRCode, generateConsentUrl } from '@/utils/api';
import styles from './organizer.module.css';

interface EventImpactSummary {
  eventId: string;
  eventName: string;
  summary: {
    totalTickets: number;
    totalDonations: number;
    engagementRate: string;
    treesPlanted: number;
    co2Compensated: string;
    farmersSupported: number;
    totalDonationValue: string;
  };
  period: {
    startDate: string;
    endDate: string;
  };
}

export default function OrganizerDashboard() {
  const [eventId, setEventId] = useState('EVT-12345');
  const [impactData, setImpactData] = useState<EventImpactSummary | null>(null);
  const [qrCodeSvg, setQrCodeSvg] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEventData = async () => {
    if (!eventId.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const [impact, qrCode] = await Promise.all([
        fetchEventImpactSummary(eventId),
        fetchEventQRCode(eventId, 300)
      ]);

      setImpactData(impact);
      setQrCodeSvg(qrCode);
    } catch (err) {
      setError('Erro ao carregar dados do evento. Verifique se o middleware está rodando.');
      console.error('Erro ao carregar dados do organizador:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventData();
  }, []);

  const handleEventIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventId(e.target.value);
  };

  const consentUrl = generateConsentUrl(eventId);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🎯 Dashboard do Organizador</h1>
        <p className={styles.subtitle}>
          Acompanhe o impacto ambiental do seu evento e gerencie campanhas de plantio
        </p>
      </div>

      <div className={styles.eventSelector}>
        <label htmlFor="eventId" className={styles.label}>
          🎟️ ID do Evento:
        </label>
        <div className={styles.inputGroup}>
          <input
            id="eventId"
            type="text"
            value={eventId}
            onChange={handleEventIdChange}
            className={styles.eventInput}
            placeholder="EVT-12345"
          />
          <button
            onClick={loadEventData}
            disabled={loading || !eventId.trim()}
            className={styles.loadButton}
          >
            {loading ? '🔄' : '📊'} Carregar Dados
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          ⚠️ {error}
          <button onClick={loadEventData} className={styles.retryButton}>
            Tentar novamente
          </button>
        </div>
      )}

      {impactData && (
        <div className={styles.mainContent}>
          {/* Event Info */}
          <div className={styles.eventInfo}>
            <h2 className={styles.eventName}>
              🎪 {impactData.eventName}
            </h2>
            <p className={styles.eventPeriod}>
              📅 {new Date(impactData.period.startDate).toLocaleDateString('pt-BR')} - {new Date(impactData.period.endDate).toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Impact Metrics */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>🎟️</div>
              <div className={styles.metricContent}>
                <h3 className={styles.metricValue}>{impactData.summary.totalTickets}</h3>
                <p className={styles.metricLabel}>Ingressos Vendidos</p>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>🌱</div>
              <div className={styles.metricContent}>
                <h3 className={styles.metricValue}>{impactData.summary.totalDonations}</h3>
                <p className={styles.metricLabel}>Doações Recebidas</p>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>📈</div>
              <div className={styles.metricContent}>
                <h3 className={styles.metricValue}>{impactData.summary.engagementRate}</h3>
                <p className={styles.metricLabel}>Taxa de Engajamento</p>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>🌳</div>
              <div className={styles.metricContent}>
                <h3 className={styles.metricValue}>{impactData.summary.treesPlanted}</h3>
                <p className={styles.metricLabel}>Árvores Plantadas</p>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>🌍</div>
              <div className={styles.metricContent}>
                <h3 className={styles.metricValue}>{impactData.summary.co2Compensated}</h3>
                <p className={styles.metricLabel}>CO₂ Compensado</p>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>👨‍🌾</div>
              <div className={styles.metricContent}>
                <h3 className={styles.metricValue}>{impactData.summary.farmersSupported}</h3>
                <p className={styles.metricLabel}>Agricultores Apoiados</p>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>💰</div>
              <div className={styles.metricContent}>
                <h3 className={styles.metricValue}>{impactData.summary.totalDonationValue}</h3>
                <p className={styles.metricLabel}>Valor Total Doado</p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className={styles.qrSection}>
            <div className={styles.qrCard}>
              <h3 className={styles.qrTitle}>📱 QR Code do Evento</h3>
              <p className={styles.qrDescription}>
                Use este QR Code em materiais promocionais, telões e redes sociais
              </p>
              
              <div className={styles.qrContainer}>
                {qrCodeSvg && (
                  <div 
                    className={styles.qrDisplay}
                    dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                  />
                )}
              </div>

              <div className={styles.qrActions}>
                <button
                  onClick={() => {
                    const blob = new Blob([qrCodeSvg], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `qrcode-${eventId}.svg`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className={styles.downloadButton}
                >
                  📥 Baixar SVG
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(consentUrl);
                    alert('URL copiada para a área de transferência!');
                  }}
                  className={styles.copyButton}
                >
                  🔗 Copiar Link
                </button>
              </div>

              <div className={styles.urlDisplay}>
                <label className={styles.urlLabel}>🌐 URL da Campanha:</label>
                <input
                  type="text"
                  value={consentUrl}
                  readOnly
                  className={styles.urlInput}
                />
              </div>
            </div>
          </div>

          {/* Marketing Tips */}
          <div className={styles.tipsSection}>
            <h3 className={styles.tipsTitle}>💡 Dicas de Marketing</h3>
            <div className={styles.tipsGrid}>
              <div className={styles.tipCard}>
                <div className={styles.tipIcon}>📱</div>
                <h4 className={styles.tipTitle}>Redes Sociais</h4>
                <p className={styles.tipText}>
                  Compartilhe o QR Code no Instagram Stories e posts do LinkedIn mencionando o impacto ambiental.
                </p>
              </div>

              <div className={styles.tipCard}>
                <div className={styles.tipIcon}>📧</div>
                <h4 className={styles.tipTitle}>Email Marketing</h4>
                <p className={styles.tipText}>
                  Inclua o link na confirmação de compra e lembretes pós-evento para maximizar participação.
                </p>
              </div>

              <div className={styles.tipCard}>
                <div className={styles.tipIcon}>🎪</div>
                <h4 className={styles.tipTitle}>Durante o Evento</h4>
                <p className={styles.tipText}>
                  Mostre o QR Code em telões e materiais impressos para capturar o engajamento presencial.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.footerNavigation}>
          <a href="/dashboard" className={styles.navLink}>
            📊 Dashboard Geral
          </a>
          <a href="/checkout" className={styles.navLink}>
            🎟️ Simulador de Checkout
          </a>
        </div>
      </div>
    </div>
  );
}