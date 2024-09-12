import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function translateText(text: string, fromLang: string, toLang: string) {
  try {
    console.log(`Traduzindo "${text}" de ${fromLang} para ${toLang}`);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a translator. Translate the following text from ${fromLang} to ${toLang}. Only provide the translation, no explanations.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 60,
    });

    const translation = response.choices[0].message.content?.trim();
    console.log('Tradução OpenAI:', translation);
    return translation || 'Tradução não disponível';
  } catch (error) {
    console.error('Erro ao traduzir com OpenAI:', error);
    throw new Error('Falha na tradução com OpenAI');
  }
}
