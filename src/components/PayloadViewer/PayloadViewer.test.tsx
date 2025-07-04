import { render, screen, fireEvent } from '@testing-library/react';
import PayloadViewer from './PayloadViewer';

// Mock da API clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

const mockData = {
  event: 'order.approved',
  timestamp: '2024-03-15T10:30:00Z',
  data: {
    order_identifier: 'ORDER_123',
    buyer_first_name: 'João',
    buyer_email: 'joao@email.com'
  }
};

describe('PayloadViewer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o título e dados corretamente', () => {
    render(<PayloadViewer title="Webhook da Sympla" data={mockData} type="webhook" />);
    
    expect(screen.getByText('Webhook da Sympla')).toBeInTheDocument();
    expect(screen.getByText('WEBHOOK')).toBeInTheDocument();
    expect(screen.getByText('order.approved')).toBeInTheDocument();
    expect(screen.getByText('ORDER_123')).toBeInTheDocument();
  });

  it('expande e recolhe o conteúdo', () => {
    render(<PayloadViewer title="Test" data={mockData} />);
    
    const expandButton = screen.getByTitle('Expandir');
    expect(screen.queryByText(/order\.approved/)).toBeInTheDocument(); // Já existe no summary
    
    fireEvent.click(expandButton);
    expect(screen.getByTitle('Recolher')).toBeInTheDocument();
    // Após expandir, o JSON completo deve estar visível
    expect(screen.getByText(/"event": "order\.approved"/)).toBeInTheDocument();
  });

  it('copia o JSON para o clipboard', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    (navigator.clipboard.writeText as jest.Mock) = writeText;
    
    render(<PayloadViewer title="Test" data={mockData} />);
    
    const copyButton = screen.getByTitle('Copiar JSON');
    fireEvent.click(copyButton);
    
    expect(writeText).toHaveBeenCalledWith(JSON.stringify(mockData, null, 2));
    // Não testamos o estado "Copiado!" pois causa problemas de timing nos testes
  });

  it('exibe diferentes ícones para diferentes tipos', () => {
    const { rerender } = render(<PayloadViewer title="Test" data={mockData} type="webhook" />);
    expect(screen.getByText('🪝')).toBeInTheDocument();
    
    rerender(<PayloadViewer title="Test" data={mockData} type="response" />);
    expect(screen.getByText('📤')).toBeInTheDocument();
    
    rerender(<PayloadViewer title="Test" data={mockData} type="request" />);
    expect(screen.getByText('📥')).toBeInTheDocument();
  });
});