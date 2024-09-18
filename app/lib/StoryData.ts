import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getStoryData(
  id: string,
  language: string,
  nativeLanguage: string,
  previousChoice?: string,
  previousSummary?: string
) {
  console.log(
    `Iniciando geração de história para id: ${id}, idioma: ${language}, idioma nativo: ${nativeLanguage}, escolha anterior: ${previousChoice}`
  );

  const languageMap: { [key: string]: string } = {
    en: 'English',
    de: 'German',
    es: 'Spanish',
    fr: 'French',
    pt: 'Portuguese',
  };

  const mappedLanguage = languageMap[language] || 'English';

  let storyPrompt = '';

  if (!previousSummary) {
    storyPrompt = `Gere uma breve história de aventura em ${mappedLanguage}. A história deve ter um título e um resumo curto. IMPORTANTE: A resposta inteira, incluindo o título e o resumo, DEVE ser em ${mappedLanguage}.`;
  } else {
    storyPrompt = `Continue a seguinte história em ${mappedLanguage}, levando em conta a escolha do jogador. A história até agora é:

"${previousSummary}"

O jogador escolheu: "${previousChoice}"

Continue a história, fornecendo a próxima parte da narrativa. IMPORTANTE: A resposta inteira DEVE ser em ${mappedLanguage}.`;
  }

  const storyCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: storyPrompt }],
  });

  const storyContent = storyCompletion.choices[0].message.content;

  let title = '';
  let summary = '';

  if (!previousSummary) {
    [title, summary] = storyContent.split('\n\n');
  } else {
    title = '';
    summary = storyContent.trim();
  }

  const optionsPrompt = `Com base na história até agora em ${mappedLanguage}:

"${previousSummary ? previousSummary + '\n\n' + summary : summary}"

Gere 4 opções diferentes para o jogador escolher para continuar a história. Cada opção deve ser uma frase curta. IMPORTANTE: Todas as opções DEVEM ser em ${mappedLanguage}. **Não inclua numeração ou marcadores; forneça apenas as opções como frases simples separadas por novas linhas.**`;

  const optionsCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: optionsPrompt }],
  });

  const optionsText = optionsCompletion.choices[0].message.content;
  const options = optionsText
    .split('\n')
    .map((opt) => opt.trim())
    .filter((opt) => opt !== '')
    .map((opt) => opt.replace(/^(Opção\s*\d+:?\s*)/, ''));

  console.log(`Geração de história concluída para id: ${id}`);
  console.log(`Título Gerado: ${title}`);
  console.log(`Resumo Gerado: ${summary}`);
  console.log(`Opções Geradas: ${options.join(', ')}`);

  return {
    id,
    title: title ? title.replace(/^(Title:|Título:)\s*/i, '') : undefined,
    summary,
    options,
  };
}