import { WebhookPayload, DashboardData } from '@/types';

const MIDDLEWARE_URL = process.env.NEXT_PUBLIC_MIDDLEWARE_URL || 'http://localhost:3001';

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