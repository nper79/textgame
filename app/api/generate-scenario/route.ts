import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateStory(adventureType: string, storyLanguage: string, action?: string, previousScenario?: string) {
  const systemPrompt = `Você é um narrador para aventuras ${adventureType}. Gere cenários detalhados APENAS em ${storyLanguage}. NÃO use nenhum outro idioma. IMPORTANTE: Use espaçamento adequado entre palavras e pontuação. Cada frase deve ser clara e legível. Escreva com no máximo 100 palavras.

REGRAS ESTRITAS:
- Forneça uma descrição concisa e envolvente da situação atual.
- NÃO inclua opções, ações ou escolhas nesta resposta.
- NÃO inclua diálogos diretos ou citações.
- NÃO use prefixos como "Novo cenário:" ou similares.
- O texto deve ser coerente e completo, descrevendo o ambiente e a situação de forma sucinta.
- Concentre-se na narrativa e descrição do cenário, não em possíveis ações do jogador.
- Comprimento máximo: 100 palavras.
- IMPORTANTE: Mantenha o tom cyberpunk com elementos como tecnologia avançada, realidade virtual, implantes cibernéticos, megacorporações, e um ambiente urbano distópico.`;

  const userPrompt = action && previousScenario
    ? `Based on the previous scenario: "${previousScenario}", the player chose: "${action}". Continue the story by describing the result of this action and the new scenario in detail. Remember, do not include any options or actions in your response.`
    : `Start a new ${adventureType} adventure with an initial scenario. Provide a rich, detailed description of the setting and situation. Remember, do not include any options or actions in your response.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 150, // Ajustado para aproximadamente 100 palavras
  });

  return completion.choices[0].message.content.trim();
}

async function generateOptions(scenario: string, adventureType: string, storyLanguage: string) {
  const systemPrompt = `You are generating options for a ${adventureType} adventure. Based on the provided scenario, create EXACTLY 4 distinct and interesting actions that the player can take. Use ONLY ${storyLanguage}.

STRICT RULES:
- Provide EXACTLY 4 options, no more, no less.
- Each option should be a direct and concise action that the player can take.
- Each option should be a maximum of 20 words.
- Options MUST be relevant to the described scenario.
- DO NOT include elements that were not mentioned in the scenario.
- DO NOT include any additional narrative or description in the options.
- DO NOT include dialogues or quotations in the options.
- DO NOT start options with numbers or hyphens.
- DO NOT repeat information from the scenario in the options.

RESPONSE FORMAT (FOLLOW THIS EXAMPLE STRICTLY):
Option 1
Option 2
Option 3
Option 4`;

  const userPrompt = `Given this scenario: "${scenario}", provide EXACTLY 4 concise and relevant actions that the player can take.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  return completion.choices[0].message.content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

export async function POST(request: Request) {
  try {
    const { storyId, storyLanguage, action, previousScenario } = await request.json();

    const adventureType = storyId === 'enchanted-forest' ? 'magical forest' : 'cyberpunk';

    const scenario = await generateStory(adventureType, storyLanguage, action, previousScenario);
    const options = await generateOptions(scenario, adventureType, storyLanguage);

    return NextResponse.json({ scenario, options });
  } catch (error) {
    console.error('Erro ao gerar cenário:', error);
    return NextResponse.json({ error: 'Falha ao gerar cenário' }, { status: 500 });
  }
}