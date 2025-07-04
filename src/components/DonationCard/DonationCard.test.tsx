import { render, screen } from '@testing-library/react';
import DonationCard from './DonationCard';

const mockDonation = {
  id: 'DON_123456',
  donorName: 'João Silva',
  status: 'completed',
  value: 5.0,
  createdAt: '2024-03-15T10:30:00Z',
  eventName: 'Tech Conference 2024',
  orderId: 'ORDER_789'
};

describe('DonationCard', () => {
  it('renderiza as informações da doação corretamente', () => {
    render(<DonationCard donation={mockDonation} />);
    
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('📅 Tech Conference 2024')).toBeInTheDocument();
    expect(screen.getByText('DON_123456')).toBeInTheDocument();
    expect(screen.getByText('ORDER_789')).toBeInTheDocument();
    expect(screen.getByText('R$ 5,00')).toBeInTheDocument();
  });

  it('exibe o status correto com cor apropriada', () => {
    render(<DonationCard donation={mockDonation} />);
    
    const statusBadge = screen.getByText('Concluída').parentElement;
    expect(statusBadge).toHaveStyle('background-color: var(--color-primary)');
  });

  it('exibe as informações de impacto', () => {
    render(<DonationCard donation={mockDonation} />);
    
    expect(screen.getByText('1 árvore plantada')).toBeInTheDocument();
    expect(screen.getByText('165kg CO₂ compensado')).toBeInTheDocument();
    expect(screen.getByText('1 agricultor apoiado')).toBeInTheDocument();
  });

  it('funciona sem informações opcionais', () => {
    const donationWithoutOptionals = {
      id: 'DON_123456',
      donorName: 'Maria Santos',
      status: 'pending',
      value: 10.0,
      createdAt: '2024-03-15T10:30:00Z',
    };

    render(<DonationCard donation={donationWithoutOptionals} />);
    
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.queryByText(/📅/)).not.toBeInTheDocument();
  });
});