import { NextResponse } from 'next/server';
import { getStoryData } from '@/app/lib/StoryData';

export async function POST(request: Request) {
  try {
    console.log('Iniciando processamento da requisição POST');
    const body = await request.json();
    console.log('Corpo da requisição:', body);

    const { id, language, nativeLanguage, choice, previousSummary } = body;

    console.log(`Chamando getStoryData com id ou slug: ${id}, language: ${language}, nativeLanguage: ${nativeLanguage}`);
    const storyData = await getStoryData(id, language, nativeLanguage, choice, previousSummary);
    console.log('Dados da história obtidos:', storyData);

    return NextResponse.json(storyData);
  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    return NextResponse.json({ error: 'Erro interno do servidor', details: error.message }, { status: 500 });
  }
}