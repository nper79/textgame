import openai from './openai'

export async function getStoryData(id: string, language: string, previousChoice?: string) {
  console.log(`Gerando história para id: ${id}, idioma: ${language}, escolha anterior: ${previousChoice}`)

  try {
    let prompt = `Crie uma história curta de aventura em ${language}.`
    
    if (previousChoice) {
      prompt += ` Continue a história baseando-se na seguinte escolha do usuário: "${previousChoice}".`
    }
    
    prompt += ` A história deve ter um título, um parágrafo de resumo e quatro opções de continuação para o leitor escolher. Formate a resposta como um objeto JSON com as chaves: title, summary, options (um array de strings).`

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })

    const storyData = JSON.parse(response.choices[0].message.content || '{}')
    console.log('Dados da história gerados:', storyData)

    return {
      id,
      ...storyData,
      backgroundImage: '/images/enchanted-forest.jpg', // Você pode gerar isso dinamicamente também
    }
  } catch (error) {
    console.error('Erro ao gerar história:', error)
    throw error
  }
}