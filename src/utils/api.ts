import { WebhookPayload, DashboardData } from '@/types';

const MIDDLEWARE_URL = process.env.NEXT_PUBLIC_MIDDLEWARE_URL || 'http://localhost:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'agroforestree-api-key-demo';

// Função para gerar assinatura HMAC válida
async function generateSignature(payload: string): Promise<string> {
  const secret = process.env.NEXT_PUBLIC_WEBHOOK_SECRET || 'test-webhook-secret-123';
  
  console.log('🔐 Generating signature with secret:', secret);
  console.log('📄 Payload:', payload);
  
  // Usar Web Crypto API para gerar HMAC
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const dataBuffer = encoder.encode(payload);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  const finalSignature = `sha256=${hashHex}`;
  console.log('✅ Generated signature:', finalSignature);
  
  return finalSignature;
}

export async function sendWebhookToMiddleware(payload: WebhookPayload): Promise<void> {
  const payloadString = JSON.stringify(payload);
  const signature = await generateSignature(payloadString);
  
  const response = await fetch(`${MIDDLEWARE_URL}/webhooks/sympla`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Sympla-Signature': signature,
    },
    body: payloadString,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch(`${MIDDLEWARE_URL}/api/donations`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export async function checkMiddlewareHealth(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch(`${MIDDLEWARE_URL}/health`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Busca métricas de impacto por evento (para organizadores)
export async function fetchEventImpactSummary(eventId: string): Promise<{
  eventId: string;
  eventName: string;
  summary: {
    totalTickets: number;
    totalDonations: number;
    engagementRate: string;
    treesPlanted: number;
    co2Compensated: string;
    farmersSupported: number;
    totalDonationValue: string;
  };
  period: {
    startDate: string;
    endDate: string;
  };
}> {
  const response = await fetch(`${MIDDLEWARE_URL}/events/${eventId}/impact-summary`, {
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Gera QR Code para evento
export async function fetchEventQRCode(eventId: string, size: number = 400): Promise<string> {
  const response = await fetch(`${MIDDLEWARE_URL}/events/${eventId}/qrcode?size=${size}&format=svg`, {
    headers: {
      'X-API-Key': API_KEY
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.text();
}

// Simula acesso à página de consentimento do usuário
export function generateConsentUrl(eventId: string): string {
  const donationToken = `eyJhbGciOiJIUzI1NiIs_EVENTO_${eventId}_TOKEN`;
  return `${MIDDLEWARE_URL}/donation/initiate?token=${donationToken}`;
}

// Simula consentimento e doação do usuário
export async function simulateUserConsent(eventId: string): Promise<{redirectUrl: string; status: number; headers: Record<string, string>}> {
  const donationToken = `eyJhbGciOiJIUzI1NiIs_EVENTO_${eventId}_TOKEN`;
  
  const response = await fetch(`${MIDDLEWARE_URL}/donation/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      token: donationToken,
      consent: 'on'
    })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return {
    redirectUrl: response.url,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries())
  };
}