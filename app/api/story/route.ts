import { NextRequest, NextResponse } from 'next/server'
import { getStoryData } from '@/lib/storyData'

const cache: Record<string, any> = {}

export async function GET(request: NextRequest) {
  console.log('API route called')
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') || 'default'
  const language = searchParams.get('target') || 'en'
  const nativeLanguage = searchParams.get('native') || 'en'
  const choice = searchParams.get('choice') || ''

  console.log(`Idioma solicitado: ${language}`)

  const cacheKey = `${id}-${language}-${nativeLanguage}-${choice}`

  console.log(`API called with: id=${id}, language=${language}, native=${nativeLanguage}, choice=${choice}`)

  if (cache[cacheKey]) {
    console.log('Returning cached story data for key:', cacheKey)
    return NextResponse.json(cache[cacheKey])
  }

  console.log('Generating new story data')
  try {
    console.log('Calling getStoryData function')
    const storyData = await getStoryData(id, language, nativeLanguage, choice)
    console.log('Story data generated:', storyData)
    
    if (!storyData || !storyData.title || !storyData.summary || !Array.isArray(storyData.options)) {
      throw new Error('Dados da história incompletos ou inválidos')
    }
    
    cache[cacheKey] = storyData
    console.log('Returning new story data')
    return NextResponse.json(storyData)
  } catch (error) {
    console.error('Erro ao gerar história:', error)
    return NextResponse.json({ error: `Erro ao gerar história: ${error.message}` }, { status: 500 })
  }
}