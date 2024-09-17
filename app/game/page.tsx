'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import TranslatableWord from '@/components/TranslatableWord'
import { Button } from "@/components/ui/button"

export default function Game() {
  const searchParams = useSearchParams()
  const [story, setStory] = useState<string>('')
  const [options, setOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [customAction, setCustomAction] = useState('')

  const adventureType = searchParams.get('type') || 'Fantasy'
  const storyLanguage = searchParams.get('story') || 'English'
  const translationLanguage = searchParams.get('translation') || 'Portuguese'

  useEffect(() => {
    fetchScenario()
  }, [])

  const fetchScenario = async (action?: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          adventureType, 
          storyLanguage, 
          action, 
          previousScenario: story 
        }),
      })
      const data = await response.json()
      
      if (data.scenario && data.options) {
        setStory(prevStory => action ? `${prevStory}\n\n${data.scenario}` : data.scenario)
        setOptions(data.options)
      } else {
        throw new Error("Invalid response from API")
      }
    } catch (error) {
      console.error("Error fetching scenario:", error)
      setOptions([
        "Explorar a área",
        "Interagir com um objeto próximo",
        "Procurar um caminho alternativo",
        "Descansar e observar o ambiente"
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptionClick = (option: string) => {
    fetchScenario(option)
  }

  const handleCustomAction = () => {
    if (customAction.trim()) {
      fetchScenario(customAction.trim())
      setCustomAction('')
    }
  }

  const renderTranslatableText = (text: string) => {
    return text.split(/(\s+)/).map((word, index) => {
      if (word.trim().length === 0) {
        return word; // Retorna espaços em branco e quebras de linha como estão
      }
      return (
        <TranslatableWord
          key={index}
          word={word}
          fromLanguage={storyLanguage}
          toLanguage={translationLanguage}
        />
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl mb-4">{adventureType} Adventure</h1>
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <div className="mb-6 text-lg">
              {renderTranslatableText(story)}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {renderTranslatableText(option)}
                </Button>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={customAction}
                onChange={(e) => setCustomAction(e.target.value)}
                placeholder="Ou digite sua própria ação..."
                className="flex-grow bg-gray-700 text-white rounded-l px-3 py-2"
              />
              <Button
                onClick={handleCustomAction}
                className="bg-purple-600 hover:bg-purple-700 rounded-l-none"
              >
                Enviar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}