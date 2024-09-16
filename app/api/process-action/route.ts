import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function preprocessText(text: string) {
  return text
    .replace(/(\w{15})(\w)/g, '$1 $2')
    .replace(/([.,!?;:])(\w)/g, '$1 $2')
    .replace(/(\w)([A-Z])/g, '$1 $2')
    .trim()
}

export async function POST(request: Request) {
  try {
    const { action, storyId, storyLanguage, previousScenario } = await request.json();

    const storyPrompt = storyPrompts[storyId] || 'You are a storyteller for an adventure game.';

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `${storyPrompt} Continue the story based on the player's action. Provide a new scenario and 4 new options for the player. Respond in ${storyLanguage}.`
        },
        {
          role: "user",
          content: `Previous scenario: ${previousScenario}\n\nThe player chose: ${action}`
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const content = response.choices[0].message.content;
    const [scenario, ...options] = content.split('\n').filter(line => line.trim() !== '');

    return NextResponse.json({ scenario, options });
  } catch (error) {
    console.error('Erro ao processar ação:', error);
    return NextResponse.json({ error: 'Falha ao processar ação' }, { status: 500 });
  }
}

