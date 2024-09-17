"use client"

import React, { useState } from 'react'

interface TranslatableWordProps {
  word: string
  fromLanguage: string
  toLanguage: string
}

export function TranslatableWord({ word, fromLanguage, toLanguage }: TranslatableWordProps) {
  const [translation, setTranslation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (translation || isLoading) {
      setShowTooltip(!showTooltip)
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, fromLanguage, toLanguage }),
      })
      if (!response.ok) throw new Error('Falha na tradução')
      const data = await response.json()
      setTranslation(data.translation)
      setShowTooltip(true)
    } catch (error) {
      console.error('Erro na tradução:', error)
      setTranslation('Erro na tradução')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <span className="relative inline-block">
      <span
        onClick={handleClick}
        className="cursor-pointer hover:underline"
      >
        {word}
      </span>
      {showTooltip && (
        <span className="absolute z-10 p-2 mt-1 text-sm text-white bg-black rounded shadow-lg bottom-full left-1/2 transform -translate-x-1/2">
          {isLoading ? 'Traduzindo...' : translation}
        </span>
      )}
    </span>
  )
}