import React, { useState, useRef, useEffect } from 'react'

interface TranslatableWordProps {
  word: string
  fromLanguage: string
  toLanguage: string
}

const TranslatableWord: React.FC<TranslatableWordProps> = ({ word, fromLanguage, toLanguage }) => {
  const [translation, setTranslation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const handleClick = async () => {
    if (translation || isLoading) {
      setShowTooltip(!showTooltip)
      return
    }
    setIsLoading(true)
    setShowTooltip(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word, fromLanguage, toLanguage }),
      })

      if (!response.ok) {
        throw new Error('Falha na tradução')
      }

      const data = await response.json()
      setTranslation(data.translation)
    } catch (error) {
      console.error('Erro na tradução:', error)
      setTranslation('Erro na tradução')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <span 
      onClick={handleClick} 
      className="cursor-pointer hover:underline relative group translatable-word"
    >
      {word}
      {(isLoading || translation) && (
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white p-2 rounded text-sm whitespace-nowrap z-10">
          {isLoading ? 'Traduzindo...' : translation}
        </span>
      )}
    </span>
  )
}

export default TranslatableWord