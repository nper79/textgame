import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  console.log('Recebida requisição POST em /api/generate-scenario')
  try {
    const { storyId, storyTitle, storySummary, storyLanguage, translationLanguage, action, previousScenario } = await request.json()
    console.log('Dados recebidos:', { storyId, storyTitle, storySummary, storyLanguage, translationLanguage, action })

    let prompt = `Create a story scenario for "${storyTitle}" in ${storyLanguage}. `
    if (previousScenario && action) {
      prompt += `Previous scenario: "${previousScenario}". The player chose: "${action}". `
    }
    prompt += `Create a new scenario and 4 new options for the player. The entire response must be in ${storyLanguage}.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a creative storyteller for interactive stories." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = completion.choices[0].message.content.trim()
    console.log("Conteúdo gerado:", content)

    const [scenario, ...optionsRaw] = content.split(/\d+\./).map(part => part.trim()).filter(Boolean)
    const options = optionsRaw.slice(0, 4)

    console.log('Cenário gerado:', scenario)
    console.log('Opções geradas:', options)

    return NextResponse.json({ scenario, options })
  } catch (error) {
    console.error('Erro detalhado ao gerar cenário:', error)
    return NextResponse.json({ error: 'Falha ao gerar cenário. Por favor, tente novamente.' }, { status: 500 })
  }
}