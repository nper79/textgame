import { NextRequest, NextResponse } from 'next/server'
import { getStoryData } from '@/lib/storyData'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') || 'default'
  const language = searchParams.get('language') || 'en'
  const choice = searchParams.get('choice') || ''

  try {
    const storyData = await getStoryData(id, language, choice)
    return NextResponse.json(storyData)
  } catch (error) {
    console.error('Erro ao gerar história:', error)
    return NextResponse.json({ error: 'Erro ao gerar história' }, { status: 500 })
  }
}