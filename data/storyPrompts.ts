export interface StoryPrompt {
    id: string;
    title: string;
    summary: string;
    image: string;
  }
  
  export const storyPrompts: StoryPrompt[] = [
    {
      id: "1",
      title: "The Enchanted Forest",
      summary: "Explore a mystical forest filled with magical creatures and hidden treasures. Your choices will shape the fate of this enchanted realm.",
      image: "/images/enchanted-forest.jpg"
    },
    {
      id: "2",
      title: "Cyberpunk Detective",
      summary: "In a neon-lit future, you're a detective with cybernetic enhancements. Solve crimes and uncover conspiracies in this thrilling sci-fi adventure.",
      image: "/images/cyberpunk-detective.jpg"
    },
    {
      id: "3",
      title: "Pirate's Legacy",
      summary: "Set sail on the high seas as a daring pirate captain. Build your crew, find treasure, and become a legend of the Caribbean.",
      image: "/images/pirate-legacy.jpg"
    },
    {
      id: "4",
      title: "Space Odyssey",
      summary: "Embark on an interstellar journey as the captain of a starship. Explore alien worlds, make first contact, and navigate the dangers of deep space.",
      image: "/images/space-odyssey.jpg"
    }
  ];