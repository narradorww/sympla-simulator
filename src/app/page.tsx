import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            🌱 Integração Agroforestree × Sympla
          </h1>
          <p className={styles.heroSubtitle}>
            Prova de conceito para plantio de árvores automático em eventos da Sympla
          </p>
          <p className={styles.heroDescription}>
            Esta aplicação demonstra como cada ingresso vendido na Sympla pode 
            automaticamente resultar no plantio de uma árvore em sistemas agroflorestais, 
            apoiando pequenos agricultores e regenerando o planeta.
          </p>
          
          <div className={styles.heroActions}>
            <Link href="/checkout" className={styles.primaryButton}>
              🎟️ Simular Checkout Sympla
            </Link>
            <Link href="/dashboard" className={styles.secondaryButton}>
              📊 Ver Dashboard
            </Link>
            <Link href="/organizer" className={styles.secondaryButton}>
              🎯 Dashboard Organizador
            </Link>
            <Link href="/user-consent" className={styles.secondaryButton}>
              👤 Simular Consentimento
            </Link>
          </div>
        </div>
        
        <div className={styles.heroVisual}>
          <div className={styles.floatingCard}>
            <h3 className={styles.cardTitle}>💡 Como Funciona</h3>
            <div className={styles.steps}>
              <div className={styles.step}>
                <span className={styles.stepNumber}>1</span>
                <span className={styles.stepText}>Cliente compra ingresso na Sympla</span>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>2</span>
                <span className={styles.stepText}>Webhook dispara para middleware</span>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>3</span>
                <span className={styles.stepText}>API Agroforestree registra doação</span>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>4</span>
                <span className={styles.stepText}>Árvore plantada em agrofloresta</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🔗</div>
          <h3 className={styles.featureTitle}>Integração Automática</h3>
          <p className={styles.featureText}>
            Webhook em tempo real conecta vendas da Sympla com plantio de árvores
          </p>
        </div>
        
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🌍</div>
          <h3 className={styles.featureTitle}>Impacto Real</h3>
          <p className={styles.featureText}>
            Cada árvore planta em agrofloresta sequestra 165kg de CO₂ em 20 anos
          </p>
        </div>
        
        <div className={styles.feature}>
          <div className={styles.featureIcon}>👨‍🌾</div>
          <h3 className={styles.featureTitle}>Apoio ao Agricultor</h3>
          <p className={styles.featureText}>
            Recursos diretos para pequenos agricultores familiares
          </p>
        </div>
        
        <div className={styles.feature}>
          <div className={styles.featureIcon}>📊</div>
          <h3 className={styles.featureTitle}>Rastreabilidade</h3>
          <p className={styles.featureText}>
            Dashboard em tempo real com dados de todas as doações
          </p>
        </div>
      </div>

      <div className={styles.tech}>
        <h2 className={styles.techTitle}>🔧 Stack Tecnológica</h2>
        <div className={styles.techGrid}>
          <div className={styles.techCard}>
            <h4>Backend (Middleware)</h4>
            <ul>
              <li>Node.js + TypeScript</li>
              <li>Express.js</li>
              <li>Validação HMAC</li>
              <li>Testes com Jest</li>
            </ul>
          </div>
          <div className={styles.techCard}>
            <h4>Frontend (Simulador)</h4>
            <ul>
              <li>Next.js 14 + TypeScript</li>
              <li>CSS Modules</li>
              <li>Testing Library</li>
              <li>Design responsivo</li>
            </ul>
          </div>
          <div className={styles.techCard}>
            <h4>Integração</h4>
            <ul>
              <li>Webhooks Sympla</li>
              <li>API REST Agroforestree</li>
              <li>Tokens JWT seguros</li>
              <li>Conformidade LGPD</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
