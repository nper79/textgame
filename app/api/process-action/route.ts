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
    const { action, adventureType, storyLanguage } = await request.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a storyteller for a ${adventureType} adventure game. Continue the story based on the player's action. Provide a new scenario and 4 new options for the player. Respond in ${storyLanguage}.`
        },
        {
          role: "user",
          content: `The player chose: ${action}`
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const content = response.choices[0].message.content;
    const [scenario, ...options] = content.split('\n').filter(line => line.trim() !== '');

    const preprocessedScenario = preprocessText(scenario);
    const preprocessedOptions = options.map(preprocessText);

    return NextResponse.json({ scenario: preprocessedScenario, options: preprocessedOptions });
  } catch (error) {
    console.error('Erro ao processar ação:', error);
    return NextResponse.json({ error: 'Falha ao processar ação' }, { status: 500 });
  }
}

