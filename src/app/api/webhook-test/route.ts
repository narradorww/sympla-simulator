import { NextRequest, NextResponse } from 'next/server';

const MIDDLEWARE_URL = process.env.MIDDLEWARE_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Adiciona timestamp se não existir
    if (!payload.timestamp) {
      payload.timestamp = new Date().toISOString();
    }

    // Simula a assinatura que o Sympla enviaria
    const signature = 'sha256=development-signature';

    // Envia para o middleware
    const response = await fetch(`${MIDDLEWARE_URL}/webhooks/sympla`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sympla-Signature': signature,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Middleware responded with status: ${response.status}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Webhook enviado com sucesso para o middleware',
      middlewareResponse: result,
      payload,
    });

  } catch (error) {
    console.error('Erro ao processar webhook de teste:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao enviar webhook para o middleware',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}