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
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-pointer underline decoration-dotted">
            {word}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{translation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TranslatableWord;