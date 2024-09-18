import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TranslatableWordProps {
  word: string;
  translation: string;
}

const TranslatableWord: React.FC<TranslatableWordProps> = ({ word, translation }) => {
  // Separa a palavra da pontuação
  const match = word.match(/^(\S+?)([.,!?;:]*)$/);
  const actualWord = match ? match[1] : word;
  const punctuation = match ? match[2] : '';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-pointer underline decoration-dotted">
            {actualWord}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{translation}</p>
        </TooltipContent>
      </Tooltip>
      {punctuation}
    </TooltipProvider>
  );
};

export default TranslatableWord;