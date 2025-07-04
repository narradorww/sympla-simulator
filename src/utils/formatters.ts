export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateString: string): string {
  if (!dateString) {
    return 'Data inválida';
  }
  
  const date = new Date(dateString);
  
  // Verifica se a data é válida
  if (isNaN(date.getTime())) {
    console.error('Data inválida recebida:', dateString);
    return 'Data inválida';
  }
  
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'planted':
      return 'var(--color-primary)';
    case 'pending_planting':
    case 'pending_user_action':
      return 'var(--color-secondary)';
    case 'failed':
    case 'declined':
      return '#dc2626';
    default:
      return 'var(--color-gray-600)';
  }
}

export function getStatusIcon(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'planted':
      return '🌳';
    case 'pending_planting':
    case 'pending_user_action':
      return '🌱';
    case 'failed':
    case 'declined':
      return '❌';
    default:
      return '⏳';
  }
}