import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { word, source, target } = await request.json()

  console.log('Variáveis de ambiente:', process.env)
  console.log('NODE_ENV:', process.env.NODE_ENV)

  let apiKey = process.env.GOOGLE_TRANSLATE_API_KEY

  if (!apiKey) {
    console.error('API key não encontrada em process.env.GOOGLE_TRANSLATE_API_KEY')
    apiKey = process.env['GOOGLE_TRANSLATE_API_KEY']
    console.log('Tentativa alternativa de leitura da API key:', apiKey ? 'Encontrada' : 'Não encontrada')
  }

  if (!apiKey) {
    console.error('API key não encontrada')
    return NextResponse.json({ error: 'Configuração de API inválida' }, { status: 500 })
  }

  console.log('API Key:', apiKey.substring(0, 5) + '...')  // Mostra apenas os primeiros 5 caracteres por segurança
  console.log('Request:', { word, source, target })

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: word,
          source: source,
          target: target,
          format: 'text',
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Google Translate API Error:', errorData)
      return NextResponse.json({ error: 'Falha na tradução' }, { status: response.status })
    }

    const data = await response.json()
    const translation = data.data.translations[0].translatedText

    return NextResponse.json({ translation })
  } catch (error) {
    console.error('Erro ao traduzir:', error)
    return NextResponse.json({ error: 'Falha na tradução' }, { status: 500 })
  }
}