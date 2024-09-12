'use client'

import React, { useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface TranslatableWordProps {
  word: string;
  fromLanguage: string;
  toLanguage: string;
}

export default function TranslatableWord({ word, fromLanguage, toLanguage, onClick }: TranslatableWordProps) {
  const [translation, setTranslation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleTranslate = async (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
    if (translation || isLoading) {
      setIsOpen(true);
      return;
    }
    setIsLoading(true);
    setIsOpen(true);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, fromLanguage, toLanguage }),
      });
      
      if (!response.ok) {
        throw new Error('Falha na tradução');
      }
      
      const data = await response.json();
      setTranslation(data.translation);
    } catch (error) {
      console.error('Erro ao traduzir:', error);
      setTranslation('Erro na tradução');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip.Trigger asChild>
          <span 
            className="cursor-pointer hover:underline inline-block"
            onClick={handleTranslate}
          >
            {word}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-white text-black p-2 rounded shadow-lg z-50"
            sideOffset={5}
          >
            {isLoading ? 'Traduzindo...' : translation || 'Clique para traduzir'}
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
