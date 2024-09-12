import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateStory(adventureType: string, storyLanguage: string, action?: string, previousScenario?: string) {
  const systemPrompt = `You are a narrator for ${adventureType} adventures. Generate detailed scenarios ONLY in ${storyLanguage}. DO NOT use any other language. IMPORTANT: Use proper spacing between words and punctuation. Each sentence should be clear and readable. Write it with a maximum of 100 words. 

STRICT RULES:
- Provide a complete and detailed description of the current situation in multiple paragraphs if necessary.
- DO NOT include any options, actions, or choices in this response.
- DO NOT include direct dialogues or quotations.
- DO NOT use prefixes like "New scenario:" or similar.
- DO NOT number or list any options at the end of the scenario.
- The text should be coherent and complete, describing the environment and situation in rich detail.
- Focus on the narrative and description of the scenario, not on possible player actions.
- Maximum length: 500 words.`;

  const userPrompt = action && previousScenario
    ? `Based on the previous scenario: "${previousScenario}", the player chose: "${action}". Continue the story by describing the result of this action and the new scenario in detail. Remember, do not include any options or actions in your response.`
    : `Start a new ${adventureType} adventure with an initial scenario. Provide a rich, detailed description of the setting and situation. Remember, do not include any options or actions in your response.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 1000,
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
    const { adventureType, storyLanguage, action, previousScenario } = await request.json();

    // Generate the new story segment
    const newScenario = await generateStory(adventureType, storyLanguage, action, previousScenario);

    // Generate options based on the new story segment
    let options = await generateOptions(newScenario, adventureType, storyLanguage);

    // Ensure we have exactly 4 options
    if (options.length !== 4) {
      console.error("API did not return exactly 4 options. Falling back to default options.");
      options = [
        "Explore the area further",
        "Interact with a nearby object or character",
        "Look for an alternative path or solution",
        "Rest and observe your surroundings"
      ];
    }

    console.log("API Response:", { scenario: newScenario, options });

    return NextResponse.json({ scenario: newScenario, options });
  } catch (error) {
    console.error("Error generating scenario:", error);
    return NextResponse.json({ error: "Error processing the game. Please try again." }, { status: 500 });
  }
}