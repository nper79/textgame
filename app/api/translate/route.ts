import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  const { word, fromLanguage, toLanguage } = await request.json()

  if (!word || !fromLanguage || !toLanguage) {
    return NextResponse.json({ error: 'Parâmetros de tradução incompletos' }, { status: 400 })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `Translate the following ${fromLanguage} word or phrase to ${toLanguage}. Respond only with the translation, nothing else.` },
        { role: "user", content: word }
      ],
      temperature: 0.3,
      max_tokens: 60,
    })

    const translation = completion.choices[0].message.content.trim()
    return NextResponse.json({ translation })
  } catch (error) {
    console.error('Erro na tradução:', error)
    return NextResponse.json({ error: 'Falha ao traduzir' }, { status: 500 })
  }
}