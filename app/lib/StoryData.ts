import { getStoryById, stories } from '@/data/storyPrompts';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RULES = `
# RULES
* Stay in character
* Story responses should be relatively short—we want a tight feedback loop between you and the user.
* Always create and present 4 short, distinct options for the user at the end of your response, separated by newlines.
* Occasionally, you may ask open-ended questions that don't require 4 options.
* Be concise, witty, and funny.
* Ensure the game story aligns with the provided game description and tagline.
* Continue this game interactively with the user.
* Keep track of any important metrics for this game.
* Make the game enjoyable but not too easy.
* Offer the user big decisions with dramatic consequences (both positive and negative).
* Proceed step by step, and always present four options as the last part of your response.
* Begin each option with 1, 2, 3, or 4, followed by a period and a space.
* Add a newline ("\\n") after each option.
* Present only one set of 4 options per response; never include more than one set.
* Do not include anything after the options.
* Avoid phrases like "What do you want to do?" when presenting options.

# EXAMPLE FORMAT
Interactive story goes here.

1. Option 1.\\n
2. Option 2.\\n
3. Option 3.\\n
4. Option 4.\\n

Please follow these instructions carefully to generate responses with the desired format for GPT-3.5.
`;

export async function getStoryData(
  idOrSlug: string,
  language: string,
  nativeLanguage: string,
  previousChoice?: string,
  previousSummary?: string
) {
  console.log(`getStoryData chamado com id ou slug: ${idOrSlug}, language: ${language}, nativeLanguage: ${nativeLanguage}`);
  console.log('Todas as histórias disponíveis:', stories.map(p => ({ id: p.id, slug: p.slug, title: p.title })));

  const storyPrompt = getStoryById(idOrSlug);
  if (!storyPrompt) {
    console.error(`História não encontrada para o id ou slug: ${idOrSlug}`);
    throw new Error(`História não encontrada para o id ou slug: ${idOrSlug}`);
  }

  console.log('História encontrada:', { id: storyPrompt.id, slug: storyPrompt.slug, title: storyPrompt.title });

  const languageMap: { [key: string]: string } = {
    en: 'English',
    de: 'German',
    es: 'Spanish',
    fr: 'French',
    pt: 'Portuguese',
    cs: 'Czech'
  };

  const mappedLanguage = languageMap[language] || 'English';

  let promptContent = '';

  if (!previousSummary) {
    promptContent = `${storyPrompt.initialPrompt} Generate the entire story and options in ${mappedLanguage}. 
    Provide a short story summary followed by exactly 4 numbered options, each on a new line. 
    Do not include any additional text after the options. ${RULES}`;
  } else {
    promptContent = `${storyPrompt.continuationPrompt} The story so far (in ${mappedLanguage}):

"${previousSummary}"

The player chose (in ${mappedLanguage}): "${previousChoice}"

Continue the story in ${mappedLanguage}, providing a short summary of the next part followed by exactly 4 numbered options, each on a new line. 
Do not switch languages. Keep everything in ${mappedLanguage}.
Do not include any additional text after the options. ${RULES}`;
  }

  const storyCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: promptContent }],
    temperature: 0.7, // Ajustando a temperatura para um valor intermediário
  });

  const storyContent = storyCompletion.choices[0].message.content;

  // Função para detectar o idioma (simplificada, você pode usar uma biblioteca mais robusta se necessário)
  const detectLanguage = (text: string): string => {
    const languagePatterns = {
      es: /[áéíóúñ¿¡]/i,
      en: /\b(the|and|is|in|to)\b/i,
      // Adicione padrões para outros idiomas conforme necessário
    };

    for (const [lang, pattern] of Object.entries(languagePatterns)) {
      if (pattern.test(text)) return lang;
    }
    return 'unknown';
  };

  const detectedLanguage = detectLanguage(storyContent);
  if (detectedLanguage !== language) {
    console.warn(`Idioma detectado (${detectedLanguage}) não corresponde ao idioma solicitado (${language}). Regenerando...`);
    return getStoryData(idOrSlug, language, nativeLanguage, previousChoice, previousSummary);
  }

  // Separar o conteúdo em resumo e opções
  const parts = storyContent.split('\n\n');
  const summary = parts[0].trim();
  const optionsText = parts[parts.length - 1];
  
  // Extrair as opções
  const options = optionsText.split('\n')
    .filter(line => /^\d+\./.test(line))
    .map(line => line.replace(/^\d+\.\s*/, '').trim().replace(/\\n$/, ''));

  console.log('Dados da história gerados:', { id: storyPrompt.id, slug: storyPrompt.slug, title: storyPrompt.title, summary, options });

  return {
    id: storyPrompt.id,
    slug: storyPrompt.slug,
    title: storyPrompt.title,
    summary,
    options,
  };
}