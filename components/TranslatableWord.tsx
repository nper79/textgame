// components/TranslatableWord.tsx

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TranslatableWordProps {
  word: string;
  sourceLanguage: string;
  targetLanguage: string;
  onWordClick?: (word: string) => void;
}

const TranslatableWord: React.FC<TranslatableWordProps> = ({
  word,
  sourceLanguage,
  targetLanguage,
  onWordClick,
}) => {
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const translateWord = useCallback(async () => {
    if (!translation) {
      try {
        const response = await fetch('/api/translate-and-explain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            word,
            fromLanguage: sourceLanguage,
            toLanguage: targetLanguage,
          }),
        });

        if (!response.ok) {
          throw new Error('Erro na tradução');
        }

        const data = await response.json();
        setTranslation(data.translation);
      } catch (error) {
        console.error('Erro ao traduzir:', error);
        setTranslation('Falha na tradução');
      }
    }
    if (onWordClick) {
      onWordClick(word);
    }
  }, [word, sourceLanguage, targetLanguage, translation, onWordClick]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    translateWord();
    setIsTooltipOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsTooltipOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <TooltipProvider>
      <Tooltip open={isTooltipOpen}>
        <TooltipTrigger asChild>
          <span
            ref={tooltipRef}
            className="cursor-pointer hover:underline"
            onClick={handleClick}
          >
            {word}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          <p>{translation || 'Traduzindo...'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TranslatableWord;
