import { NextRequest, NextResponse } from 'next/server'
import { getStoryData } from '@/lib/StoryData'

export async function POST(request: NextRequest) {
  console.log('Rota da API chamada')
  const { id, language, nativeLanguage, choice, previousSummary } = await request.json()
  console.log(`API chamada com: id=${id}, language=${language}, native=${nativeLanguage}, choice=${choice}`)

  try {
    console.log('Chamando função getStoryData')
    const storyData = await getStoryData(id, language, nativeLanguage, choice, previousSummary)
    console.log('Dados da história gerados:', storyData)
    
    if (!storyData || !storyData.summary || !Array.isArray(storyData.options) || storyData.options.length === 0) {
      throw new Error('Dados da história incompletos ou inválidos')
    }
    
    console.log('Retornando dados da história')
    return NextResponse.json(storyData)
  } catch (error) {
    console.error('Erro ao gerar história:', error)
    return NextResponse.json({ error: `Erro ao gerar história: ${error.message}` }, { status: 500 })
  }
}