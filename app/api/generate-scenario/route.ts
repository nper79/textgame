import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const languageMap: { [key: string]: string } = {
  'en': 'English',
  'de': 'German',
  'es': 'Spanish',
  'fr': 'French',
  'pt': 'Portuguese',
}

export async function POST(request: Request) {
  try {
    const { storyLanguage, storyTitle, storySummary, action, previousScenario } = await request.json()
    console.log('DEBUG - API recebeu:', { storyLanguage, storyTitle })

    const language = languageMap[storyLanguage]
    if (!language) {
      console.error('DEBUG - Idioma não suportado:', storyLanguage)
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 })
    }

    let prompt = `Create a scenario for the story "${storyTitle}" in ${language}. `
    if (previousScenario && action) {
      prompt += `Previous scenario: "${previousScenario}". The player chose: "${action}". `
    }
    prompt += `Create a new scenario (one paragraph) and 4 new options for the player (each option should be a complete sentence). The entire response must be in ${language}. Format the response as JSON with 'scenario' and 'options' fields.`

    console.log('DEBUG - Prompt para OpenAI:', prompt)

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are a creative storyteller for interactive stories. Always respond in ${language}.` },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = completion.choices[0].message.content
    const response = JSON.parse(content)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Erro ao gerar cenário:', error)
    return NextResponse.json({ error: 'Failed to generate scenario' }, { status: 500 })
  }
}