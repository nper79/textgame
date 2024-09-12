import { NextResponse } from "next/server";
import { translateText } from '@/app/lib/translation';

export async function POST(request: Request) {
  try {
    const { word, fromLanguage, toLanguage } = await request.json();
    
    console.log('Recebido pedido de tradução:', { word, fromLanguage, toLanguage });

    if (!word || !fromLanguage || !toLanguage) {
      throw new Error('Parâmetros de tradução incompletos');
    }

    const translation = await translateText(word, fromLanguage, toLanguage);
    console.log('Tradução bem-sucedida:', translation);
    return NextResponse.json({ translation });
  } catch (error) {
    console.error('Erro detalhado na tradução:', error);
    return NextResponse.json({ error: 'Falha na tradução: ' + (error as Error).message }, { status: 500 });
  }
}
