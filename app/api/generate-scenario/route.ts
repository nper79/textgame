import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { storyId, language, action, previousScenario, clickedWords } = await request.json()

    const clickedWordsPrompt = clickedWords.length > 0 
      ? `É MUITO IMPORTANTE usar as seguintes palavras na próxima parte da história, se possível: ${clickedWords.join(', ')}. 
         Tente usar pelo menos 3 dessas palavras de forma natural e relevante no contexto da história.`
      : ''

    const prompt = `Continue a história baseada no cenário anterior e na ação do jogador.
    Cenário anterior: "${previousScenario}"
    Ação do jogador: "${action}"
    ${clickedWordsPrompt}
    Forneça um novo cenário de aproximadamente 150 palavras e 4 novas opções para o jogador. 
    Responda em ${language}.
    LEMBRE-SE: É crucial incorporar as palavras fornecidas na história de forma natural e frequente.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um narrador criativo para um jogo de aventura interativo. Sua tarefa é criar histórias envolventes e incorporar palavras específicas quando solicitado." },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 500,
    })

    const content = completion.choices[0].message.content
    const [scenario, ...options] = content.split('\n').filter(line => line.trim() !== '')

    return NextResponse.json({ scenario, options })
  } catch (error) {
    console.error('Erro ao gerar cenário:', error)
    return NextResponse.json({ error: 'Falha ao gerar cenário' }, { status: 500 })
  }
}