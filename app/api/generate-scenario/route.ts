import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log('Recebida requisição POST em /api/generate-scenario')
  try {
    const { storyId, storyTitle, storySummary, storyLanguage, action, previousScenario } = await request.json()
    console.log('Dados recebidos:', { storyId, storyTitle, storySummary, storyLanguage, action })

    let prompt = `Continue a história "${storyTitle}" em ${storyLanguage}. `
    if (previousScenario && action) {
      prompt += `Cenário anterior: "${previousScenario}". O jogador escolheu: "${action}". `
    }
    prompt += `Crie um novo cenário e 4 novas opções para o jogador.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um narrador criativo de histórias interativas." },
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