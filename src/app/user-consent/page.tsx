'use client';

import { useState } from 'react';
import { simulateUserConsent, generateConsentUrl } from '@/utils/api';
import styles from './user-consent.module.css';

export default function UserConsentSimulator() {
  const [eventId, setEventId] = useState('EVT-12345');
  const [consentResult, setConsentResult] = useState<{redirectUrl: string; status: number; headers: Record<string, string>} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulateConsent = async () => {
    if (!eventId.trim()) return;

    setLoading(true);
    setError(null);
    setConsentResult(null);

    try {
      const result = await simulateUserConsent(eventId);
      setConsentResult(result);
    } catch (err) {
      setError('Erro ao simular consentimento. Verifique se o middleware está rodando.');
      console.error('Erro ao simular consentimento:', err);
    } finally {
      setLoading(false);
    }
  };

  const consentUrl = generateConsentUrl(eventId);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>👤 Simulador de Consentimento do Usuário</h1>
          <p className={styles.subtitle}>
            Simule o fluxo completo de consentimento LGPD que o usuário final vivenciará
          </p>
        </div>

        <div className={styles.mainContent}>
          {/* Event Configuration */}
          <div className={styles.configSection}>
            <h2 className={styles.sectionTitle}>⚙️ Configuração do Evento</h2>
            
            <div className={styles.inputGroup}>
              <label htmlFor="eventId" className={styles.label}>
                🎟️ ID do Evento:
              </label>
              <input
                id="eventId"
                type="text"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className={styles.eventInput}
                placeholder="EVT-12345"
              />
            </div>

            <div className={styles.urlPreview}>
              <label className={styles.label}>🌐 URL de Consentimento:</label>
              <div className={styles.urlDisplay}>
                <input
                  type="text"
                  value={consentUrl}
                  readOnly
                  className={styles.urlInput}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(consentUrl);
                    alert('URL copiada!');
                  }}
                  className={styles.copyButton}
                >
                  📋 Copiar
                </button>
              </div>
            </div>
          </div>

          {/* Simulation Controls */}
          <div className={styles.simulationSection}>
            <h2 className={styles.sectionTitle}>🎬 Simulação do Fluxo</h2>
            
            <div className={styles.flowSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Usuário compra ingresso</h3>
                  <p className={styles.stepDescription}>
                    Após finalizar a compra na Sympla, o usuário recebe link/QR Code
                  </p>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Acessa página de consentimento</h3>
                  <p className={styles.stepDescription}>
                    Clica no link e vê informações sobre plantio e impacto ambiental
                  </p>
                  <a
                    href={consentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.testLink}
                  >
                    🔗 Abrir página real
                  </a>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Dá consentimento explícito</h3>
                  <p className={styles.stepDescription}>
                    Marca checkbox de acordo com LGPD e confirma plantio
                  </p>
                  <button
                    onClick={handleSimulateConsent}
                    disabled={loading || !eventId.trim()}
                    className={styles.simulateButton}
                  >
                    {loading ? '🔄 Simulando...' : '🌱 Simular Consentimento'}
                  </button>
                </div>
              </div>

              {consentResult && (
                <div className={styles.step}>
                  <div className={styles.stepNumber}>✅</div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>Doação executada com sucesso!</h3>
                    <p className={styles.stepDescription}>
                      Usuário é redirecionado para página de confirmação
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          {error && (
            <div className={styles.errorSection}>
              <h3 className={styles.errorTitle}>❌ Erro na Simulação</h3>
              <p className={styles.errorMessage}>{error}</p>
              <button onClick={handleSimulateConsent} className={styles.retryButton}>
                🔄 Tentar Novamente
              </button>
            </div>
          )}

          {consentResult && (
            <div className={styles.resultSection}>
              <h2 className={styles.sectionTitle}>📊 Resultado da Simulação</h2>
              
              <div className={styles.resultCard}>
                <div className={styles.resultHeader}>
                  <div className={styles.resultIcon}>✅</div>
                  <div>
                    <h3 className={styles.resultTitle}>Consentimento Processado</h3>
                    <p className={styles.resultStatus}>Status: {consentResult.status}</p>
                  </div>
                </div>

                <div className={styles.resultDetails}>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>🔗 URL de Redirecionamento:</span>
                    <span className={styles.resultValue}>{consentResult.redirectUrl}</span>
                  </div>
                  
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>📄 Headers de Resposta:</span>
                    <pre className={styles.resultCode}>
                      {JSON.stringify(consentResult.headers, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className={styles.resultActions}>
                  <a
                    href={consentResult.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.visitButton}
                  >
                    🌳 Ver Página de Sucesso
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* LGPD Compliance Info */}
          <div className={styles.complianceSection}>
            <h2 className={styles.sectionTitle}>🔒 Conformidade LGPD</h2>
            
            <div className={styles.complianceGrid}>
              <div className={styles.complianceCard}>
                <div className={styles.complianceIcon}>✅</div>
                <h3 className={styles.complianceTitle}>Consentimento Explícito</h3>
                <p className={styles.complianceText}>
                  Usuário deve marcar checkbox confirmando que autoriza o plantio
                </p>
              </div>

              <div className={styles.complianceCard}>
                <div className={styles.complianceIcon}>📋</div>
                <h3 className={styles.complianceTitle}>Finalidade Específica</h3>
                <p className={styles.complianceText}>
                  Dados usados exclusivamente para plantio e emissão de certificado
                </p>
              </div>

              <div className={styles.complianceCard}>
                <div className={styles.complianceIcon}>🚫</div>
                <h3 className={styles.complianceTitle}>Possibilidade de Recusa</h3>
                <p className={styles.complianceText}>
                  Usuário pode declinar sem qualquer prejuízo no evento
                </p>
              </div>

              <div className={styles.complianceCard}>
                <div className={styles.complianceIcon}>🔐</div>
                <h3 className={styles.complianceTitle}>Transparência</h3>
                <p className={styles.complianceText}>
                  Informações claras sobre uso dos dados e impacto ambiental
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerNavigation}>
            <a href="/dashboard" className={styles.navLink}>
              📊 Dashboard Geral
            </a>
            <a href="/organizer" className={styles.navLink}>
              🎯 Dashboard Organizador
            </a>
            <a href="/checkout" className={styles.navLink}>
              🎟️ Simulador Checkout
            </a>
          </div>
        </div>
      </div>
    </>
  );
}