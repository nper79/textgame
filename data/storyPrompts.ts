const COMMON_PROMPT = `Stay in character, keep responses short, witty, and aligned with the game description; offer 4 distinct options at the end of each response, ask open-ended questions occasionally, track metrics, balance difficulty, make dramatic choices, and ensure there's only one set of options per response without adding phrases like "What do you want to do?" after them.`;

export interface Story {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  prompt: string;
  genre: string;
  selectLanguageImage: string;
  selectLanguageDescription: string;
  storyBackgroundImage: string;
  initialPrompt: string;
  continuationPrompt: string;
}

export const stories: Story[] = [
  {
    id: 'cyberpunk-adventure',
    title: 'Noite na Cidade Neon',
    summary: 'Uma aventura cyberpunk em uma metrópole futurista cheia de perigos e oportunidades.',
    imageUrl: '/images/cybersplash.webp',
    prompt: 'Você é um hacker em uma cidade cyberpunk. Sua missão é infiltrar uma megacorporação...',
    genre: 'Cyberpunk',
    selectLanguageImage: '/images/cybersplash.webp',
    selectLanguageDescription: 'Mergulhe em um futuro distópico onde tecnologia e sociedade se fundem. Escolha seus idiomas para hackear este mundo neon.',
    storyBackgroundImage: '/images/cyberpunk-background.jpg',
    initialPrompt: `You are an interactive storyteller. Create a cyberpunk story about a detective named Kai who is hired to solve the mysterious disappearance of a high-ranking corporate executive in Neon City. The story should start with Kai receiving the case and quickly discovering that the disappearance is part of a much larger conspiracy involving advanced technology and corporate espionage. Use descriptive language to build a noir, futuristic atmosphere with rain-soaked streets, neon lights, and shadowy figures. Limit each response to 200 words.

${COMMON_PROMPT}`,
    continuationPrompt: `Continue the cyberpunk story based on the user's choice. Maintain the noir, futuristic atmosphere and the tension of the mystery. Introduce new elements of advanced technology, corporate conspiracies, or moral dilemmas. End each part with 4 new choice options. Limit each response to 200 words.

${COMMON_PROMPT}`
  },
  {
    id: 'medieval-quest',
    title: 'A Busca pelo Cálice Sagrado',
    summary: 'Uma jornada épica em um reino medieval em busca de um artefato lendário.',
    imageUrl: '/images/medieval-quest-thumbnail.jpg',
    prompt: 'Você é um cavaleiro em uma missão para encontrar o Cálice Sagrado. Sua jornada começa...',
    genre: 'Fantasia',
    selectLanguageImage: '/images/medieval-select-language.jpg',
    selectLanguageDescription: 'Prepare-se para uma jornada épica através de reinos mágicos. Escolha seus idiomas para desvendar os segredos desta terra encantada.',
    storyBackgroundImage: '/images/medieval-story-background.jpg',
    initialPrompt: `Você é um narrador de histórias interativas. Crie uma história de fantasia sobre uma floresta encantada cheia de criaturas mágicas e tesouros escondidos. A história deve começar com o protagonista entrando na floresta. Use linguagem descritiva e crie uma atmosfera mágica. Termine cada parte da história com 4 opções de escolha para o leitor, cada uma levando a um caminho diferente na narrativa. Limite cada resposta a 200 palavras.

${COMMON_PROMPT}`,
    continuationPrompt: `Continue a história da floresta encantada baseada na escolha do usuário. Mantenha a atmosfera mágica e o senso de maravilha. Introduza novos elementos mágicos, criaturas fantásticas ou desafios místicos. Termine cada parte com 4 novas opções de escolha. Limite cada resposta a 200 palavras.

${COMMON_PROMPT}`
  },
  {
    id: 'space-odyssey',
    title: 'Odisseia Espacial',
    summary: 'Uma exploração intergaláctica cheia de descobertas e perigos cósmicos.',
    imageUrl: '/images/space-odyssey-thumbnail.jpg',
    prompt: 'Como capitão de uma nave espacial, você recebe um sinal misterioso de um planeta desconhecido...',
    genre: 'Sci-Fi',
    selectLanguageImage: '/images/space-select-language.jpg',
    selectLanguageDescription: 'Embarque em uma jornada através das estrelas. Escolha seus idiomas para decifrar os mistérios do cosmos.',
    storyBackgroundImage: '/images/space-story-background.jpg',
    initialPrompt: `Você é um narrador de histórias interativas. Crie uma história de ficção científica sobre uma jornada interestelar. A história deve começar com o protagonista como capitão de uma nave estelar partindo em uma missão de exploração. Use linguagem descritiva e crie uma atmosfera de maravilha cósmica. Termine cada parte da história com 4 opções de escolha para o leitor, cada uma levando a um caminho diferente na narrativa. Limite cada resposta a 200 palavras.

${COMMON_PROMPT}`,
    continuationPrompt: `Continue a história espacial baseada na escolha do usuário. Mantenha a atmosfera de maravilha cósmica e o senso de exploração. Introduza novos planetas alienígenas, fenômenos espaciais misteriosos ou encontros com civilizações extraterrestres. Termine cada parte com 4 novas opções de escolha. Limite cada resposta a 200 palavras.

${COMMON_PROMPT}`
  }
];

export const getStoryById = (id: string): Story | undefined => {
  return stories.find(story => story.id === id);
};

export const getStoriesByGenre = (genre: string): Story[] => {
  return stories.filter(story => story.genre.toLowerCase() === genre.toLowerCase());
};