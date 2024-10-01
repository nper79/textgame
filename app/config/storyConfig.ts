export interface Story {
    id: string;
    title: string;
    summary: string;
    imageUrl: string;
    prompt: string;
    genre: string;
    selectLanguageImage: string; // Imagem para a página de seleção de idioma
    selectLanguageDescription: string; // Descrição para a página de seleção de idioma
    storyBackgroundImage: string; // Imagem de fundo para a página da história
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
      storyBackgroundImage: '/images/cyberpunk-background.jpg'
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
      storyBackgroundImage: '/images/medieval-story-background.jpg'
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
      storyBackgroundImage: '/images/space-story-background.jpg'
    },
    // Adicione mais histórias conforme necessário
  ];
  
  export const getStoryById = (id: string): Story | undefined => {
    return stories.find(story => story.id === id);
  };

  // ... (mantenha as funções getStoryById e getStoriesByGenre como estavam)