import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutForm from './CheckoutForm';
import { sendWebhookToMiddleware } from '@/utils/api';

// Mock da função de API
jest.mock('@/utils/api', () => ({
  sendWebhookToMiddleware: jest.fn(),
}));

const mockSendWebhook = sendWebhookToMiddleware as jest.MockedFunction<typeof sendWebhookToMiddleware>;

describe('CheckoutForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o formulário corretamente', () => {
    render(<CheckoutForm />);
    
    expect(screen.getByText('🎟️ Sympla Checkout Simulator')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /simular compra aprovada/i })).toBeInTheDocument();
  });

  it('atualiza os campos do formulário', () => {
    render(<CheckoutForm />);
    
    const nomeInput = screen.getByLabelText('Nome') as HTMLInputElement;
    fireEvent.change(nomeInput, { target: { value: 'Maria' } });
    
    expect(nomeInput.value).toBe('Maria');
  });

  it('envia webhook com sucesso', async () => {
    mockSendWebhook.mockResolvedValueOnce({});
    const onWebhookSent = jest.fn();
    
    render(<CheckoutForm onWebhookSent={onWebhookSent} />);
    
    const submitButton = screen.getByRole('button', { name: /simular compra aprovada/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSendWebhook).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'order.approved',
          data: expect.objectContaining({
            buyer_first_name: 'João',
            order_status: 'approved'
          })
        })
      );
    });
    
    expect(screen.getByText(/webhook enviado com sucesso/i)).toBeInTheDocument();
    expect(onWebhookSent).toHaveBeenCalled();
  });

  it('exibe erro quando webhook falha', async () => {
    mockSendWebhook.mockRejectedValueOnce(new Error('Network error'));
    
    render(<CheckoutForm />);
    
    const submitButton = screen.getByRole('button', { name: /simular compra aprovada/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/erro ao simular webhook/i)).toBeInTheDocument();
    });
  });

  it('desabilita o botão durante o loading', async () => {
    mockSendWebhook.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<CheckoutForm />);
    
    const submitButton = screen.getByRole('button', { name: /simular compra aprovada/i });
    fireEvent.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Processando...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});