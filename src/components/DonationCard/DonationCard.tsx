import { formatDate, formatCurrency, getStatusColor, getStatusIcon } from '@/utils/formatters';
import styles from './DonationCard.module.css';

interface DonationCardProps {
  donation: {
    id: string;
    donorName: string;
    status: string;
    value: number;
    createdAt: string;
    eventName?: string;
    orderId?: string;
  };
}

export default function DonationCard({ donation }: DonationCardProps) {
  const statusColor = getStatusColor(donation.status);
  const statusIcon = getStatusIcon(donation.status);

  const getStatusText = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Concluída';
      case 'planted':
        return 'Árvore Plantada';
      case 'pending_planting':
        return 'Aguardando Plantio';
      case 'pending_user_action':
        return 'Aguardando Ação';
      case 'failed':
        return 'Falhou';
      case 'declined':
        return 'Recusada';
      default:
        return status;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.donorInfo}>
          <h3 className={styles.donorName}>{donation.donorName}</h3>
          {donation.eventName && (
            <p className={styles.eventName}>📅 {donation.eventName}</p>
          )}
        </div>
        <div 
          className={styles.statusBadge}
          style={{ backgroundColor: statusColor }}
        >
          <span className={styles.statusIcon}>{statusIcon}</span>
          <span className={styles.statusText}>{getStatusText(donation.status)}</span>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>ID da Doação:</span>
          <span className={styles.detailValue}>{donation.id}</span>
        </div>
        
        {donation.orderId && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Pedido Sympla:</span>
            <span className={styles.detailValue}>{donation.orderId}</span>
          </div>
        )}
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Valor:</span>
          <span className={styles.detailValue}>{formatCurrency(donation.value)}</span>
        </div>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Criado em:</span>
          <span className={styles.detailValue}>{formatDate(donation.createdAt)}</span>
        </div>
      </div>

      <div className={styles.impact}>
        <div className={styles.impactItem}>
          <span className={styles.impactIcon}>🌱</span>
          <span className={styles.impactText}>1 árvore plantada</span>
        </div>
        <div className={styles.impactItem}>
          <span className={styles.impactIcon}>🌍</span>
          <span className={styles.impactText}>165kg CO₂ compensado</span>
        </div>
        <div className={styles.impactItem}>
          <span className={styles.impactIcon}>👨‍🌾</span>
          <span className={styles.impactText}>1 agricultor apoiado</span>
        </div>
      </div>
    </div>
  );
}