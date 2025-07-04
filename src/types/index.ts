export interface OrderData {
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string;
  event_name: string;
  event_id: string;
  total_order_amount: number;
}

export interface WebhookPayload {
  event: 'order.approved' | 'order.created' | 'order.cancelled' | 'order.refunded';
  data: OrderData & {
    order_identifier: string;
    order_status: 'approved' | 'pending' | 'declined';
  };
  timestamp?: string;
}

export interface DonationResponse {
  donationId: string;
  status: 'PENDING_PLANTING' | 'PLANTED' | 'FAILED';
  createdAt: string;
  certificateUrl?: string;
}

export interface DashboardData {
  donations: Array<{
    id: string;
    donorName: string;
    status: string;
    value: number;
    createdAt: string;
  }>;
  total: number;
  timestamp: string;
}