import { sendWebhookToMiddleware, fetchDashboardData } from './api';

// Mock do fetch global
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('API Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendWebhookToMiddleware', () => {
    it('envia webhook com dados corretos', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const payload = {
        event: 'order.approved' as const,
        data: {
          order_identifier: 'ORDER_123',
          event_id: 'EVT_456',
          event_name: 'Test Event',
          total_order_amount: 100,
          buyer_first_name: 'João',
          buyer_last_name: 'Silva',
          buyer_email: 'joao@test.com',
          order_status: 'approved' as const,
        },
      };

      await sendWebhookToMiddleware(payload);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/webhooks/sympla',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Sympla-Signature': 'sha256=test-signature-for-development',
          }),
          body: JSON.stringify(payload),
        })
      );
    });

    it('lança erro quando response não é ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const payload = {
        event: 'order.approved' as const,
        data: {
          order_identifier: 'ORDER_123',
          event_id: 'EVT_456',
          event_name: 'Test Event',
          total_order_amount: 100,
          buyer_first_name: 'João',
          buyer_last_name: 'Silva',
          buyer_email: 'joao@test.com',
          order_status: 'approved' as const,
        },
      };

      await expect(sendWebhookToMiddleware(payload)).rejects.toThrow(
        'HTTP error! status: 500'
      );
    });
  });

  describe('fetchDashboardData', () => {
    it('busca dados do dashboard com sucesso', async () => {
      const mockData = {
        donations: [
          {
            id: 'DON_123',
            donorName: 'João Silva',
            status: 'completed',
            value: 5.0,
            createdAt: '2024-03-15T10:30:00Z',
          },
        ],
        total: 1,
        timestamp: '2024-03-15T10:30:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchDashboardData();

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/donations');
    });
  });
});