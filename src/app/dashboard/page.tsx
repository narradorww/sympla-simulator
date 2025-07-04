'use client';

import { useState, useEffect } from 'react';
import DonationCard from '@/components/DonationCard/DonationCard';
import PayloadViewer from '@/components/PayloadViewer/PayloadViewer';
import { DashboardData } from '@/types';
import { fetchDashboardData, checkMiddlewareHealth } from '@/utils/api';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [middlewareHealth, setMiddlewareHealth] = useState<{status: string; timestamp: string; environment?: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const loadData = async () => {
    try {
      setError(null);
      const [dashData, healthData] = await Promise.all([
        fetchDashboardData(),
        checkMiddlewareHealth()
      ]);
      
      setDashboardData(dashData);
      setMiddlewareHealth(healthData);
      setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
    } catch (err) {
      setError('Erro ao carregar dados. Verifique se o middleware está rodando.');
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Atualiza a cada 3 segundos
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getOverallStats = () => {
    if (!dashboardData?.donations) return null;

    const donations = dashboardData.donations;
    const completed = donations.filter(d => d.status.toLowerCase().includes('completed')).length;
    const pending = donations.filter(d => d.status.toLowerCase().includes('pending')).length;
    const totalValue = donations.reduce((sum, d) => sum + d.value, 0);

    return { completed, pending, totalValue, total: donations.length };
  };

  const stats = getOverallStats();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            📊 Dashboard Agroforestree
          </h1>
          <p className={styles.subtitle}>
            Acompanhe em tempo real o impacto das integrações com a Sympla
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <button
            onClick={loadData}
            className={styles.refreshButton}
            disabled={loading}
          >
            🔄 Atualizar
          </button>
          
          {lastUpdate && (
            <span className={styles.lastUpdate}>
              Última atualização: {lastUpdate}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          ⚠️ {error}
          <button onClick={loadData} className={styles.retryButton}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* Status do Middleware */}
      {middlewareHealth && (
        <div className={styles.healthCard}>
          <div className={styles.healthHeader}>
            <h3>🟢 Status do Middleware</h3>
            <span className={styles.healthStatus}>Online</span>
          </div>
          <p className={styles.healthMessage}>{middlewareHealth.status}</p>
        </div>
      )}

      {/* Estatísticas Gerais */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🌱</div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.total}</h3>
              <p className={styles.statLabel}>Total de Doações</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🌳</div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.completed}</h3>
              <p className={styles.statLabel}>Concluídas</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏳</div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.pending}</h3>
              <p className={styles.statLabel}>Pendentes</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(stats.totalValue)}
              </h3>
              <p className={styles.statLabel}>Valor Total</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.mainContent}>
        {/* Lista de Doações */}
        <div className={styles.donationsSection}>
          <h2 className={styles.sectionTitle}>
            🌱 Doações Processadas
          </h2>
          
          {dashboardData?.donations && dashboardData.donations.length > 0 ? (
            <div className={styles.donationsGrid}>
              {dashboardData.donations.map((donation) => (
                <DonationCard 
                  key={donation.id} 
                  donation={donation}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🌱</div>
              <h3 className={styles.emptyTitle}>Nenhuma doação ainda</h3>
              <p className={styles.emptyText}>
                Use o simulador de checkout para criar a primeira doação
              </p>
              <a href="/checkout" className={styles.emptyAction}>
                🎟️ Ir para o Simulador
              </a>
            </div>
          )}
        </div>

        {/* Logs em Tempo Real */}
        <div className={styles.logsSection}>
          <h2 className={styles.sectionTitle}>
            📋 Dados do Sistema
          </h2>
          
          <div className={styles.payloadGrid}>
            {dashboardData && (
              <PayloadViewer
                title="Resposta da API de Doações"
                data={dashboardData}
                type="response"
              />
            )}
            
            {middlewareHealth && (
              <PayloadViewer
                title="Health Check do Middleware"
                data={middlewareHealth}
                type="response"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}