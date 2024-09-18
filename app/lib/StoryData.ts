import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getStoryData(id: string, language: string, nativeLanguage: string, previousChoice?: string) {
  console.log(`Iniciando geração de história para id: ${id}, idioma: ${language}, idioma nativo: ${nativeLanguage}, escolha anterior: ${previousChoice}`);

  // Gerar a história
  const storyPrompt = `Generate a brief adventure story in ${language}. The story should have a title and a short summary. IMPORTANT: The entire response, including the title and summary, MUST be in ${language}.`;
  const storyCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: storyPrompt }],
  });

  const storyContent = storyCompletion.choices[0].message.content;
  const [title, summary] = storyContent.split('\n\n');

  // Gerar as opções
  const optionsPrompt = `Based on this story in ${language}:\n\n${summary}\n\nGenerate 4 different options to continue the story. Each option should be a short sentence. IMPORTANT: All options MUST be in ${language}.`;
  const optionsCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: optionsPrompt }],
  });

  const options = optionsCompletion.choices[0].message.content.split('\n');

  console.log(`Finalizando geração de história para id: ${id}`);
  console.log(`Título gerado: ${title}`);
  console.log(`Resumo gerado: ${summary}`);
  console.log(`Opções geradas: ${options.join(', ')}`);

  return {
    id,
    title: title.replace(/^(Title:|Título:)\s*/i, ''),
    summary,
    options,
  };
}