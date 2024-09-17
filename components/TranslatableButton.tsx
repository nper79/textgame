import React from 'react'
import { TranslatableWord } from './TranslatableWord'

interface TranslatableButtonProps {
  text: string
  onClick: () => void
  fromLanguage: string
  toLanguage: string
}

export function TranslatableButton({ text, onClick, fromLanguage, toLanguage }: TranslatableButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.translatable-word')) {
      onClick()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded"
    >
      {text.split(/(\s+)/).map((part, index) => (
        part.trim().length > 0 ? (
          <TranslatableWord
            key={index}
            word={part}
            fromLanguage={fromLanguage}
            toLanguage={toLanguage}
          />
        ) : part
      ))}
    </button>
  )
}