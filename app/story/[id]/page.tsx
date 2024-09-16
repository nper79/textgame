'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import TranslatableWord from "@/components/TranslatableWord"
import { stories } from '../../data/stories'

export default function StoryPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<string>('')
  const [options, setOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [customAction, setCustomAction] = useState('')
  const searchParams = useSearchParams()

  const storyLanguage = searchParams.get('target') || 'Français'
  const translationLanguage = searchParams.get('native') || 'Inglês'

  const fetchInitialScenario = async () => {
    console.log('Iniciando fetchInitialScenario')
    setIsLoading(true)
    const storyData = stories.find(s => s.id === params.id)
    if (!storyData) {
      console.error('Story not found')
      setIsLoading(false)
      return
    }

    try {
      console.log('Fazendo requisição para /api/generate-scenario')
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId: params.id,
          storyTitle: storyData.title,
          storySummary: storyData.summary,
          storyLanguage,
        }),
      })
      console.log('Resposta recebida:', response.status)
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`)
      }
      const data = await response.json()
      console.log('Dados recebidos:', data)
      if (data.scenario && data.options) {
        console.log('Definindo história e opções')
        setStory(data.scenario)
        setOptions(data.options)
      } else {
        console.error('API response is missing scenario or options')
        setStory('Erro ao carregar o cenário. Por favor, tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao buscar cenário inicial:', error)
      setStory('Erro ao carregar o cenário. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInitialScenario()
  }, [params.id, storyLanguage])

  const handleOptionClick = async (option: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId: params.id,
          storyTitle: storyData?.title,
          storySummary: storyData?.summary,
          storyLanguage,
          action: option,
          previousScenario: story
        }),
      })
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`)
      }
      const data = await response.json()
      if (data.scenario && data.options) {
        setStory(prevStory => `${prevStory}\n\n${data.scenario}`)
        setOptions(data.options)
      } else {
        throw new Error('API response is missing scenario or options')
      }
    } catch (error) {
      console.error('Erro ao gerar próximo cenário:', error)
      setOptions(['Erro ao carregar as opções. Por favor, tente novamente.'])
    } finally {
      setIsLoading(false)
    }
  }

  const renderTranslatableText = (text: string) => {
    return text.split(/(\s+)/).map((part, index) => {
      if (part.trim().length === 0) {
        return part; // Retorna espaços em branco e quebras de linha como estão
      }
      return (
        <TranslatableWord
          key={index}
          word={part}
          fromLanguage={storyLanguage}
          toLanguage={translationLanguage}
        />
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl mb-4">Debug Info</h1>
        <p>Story ID: {params.id}</p>
        <p>Story Language: {storyLanguage}</p>
        <p>Translation Language: {translationLanguage}</p>
        <p>Is Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Story Content: {story || 'No story loaded'}</p>
        <p>Options: {options.length > 0 ? options.join(', ') : 'No options'}</p>
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <>
            {story && (
              <div className="mb-6 text-lg">
                {renderTranslatableText(story)}
              </div>
            )}
            {options.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {options.map((option, index) => (
                  <TranslatableButton
                    key={index}
                    text={`${index + 1}. ${option}`}
                    onClick={() => handleOptionClick(option)}
                    fromLanguage={storyLanguage}
                    toLanguage={translationLanguage}
                  />
                ))}
              </div>
            )}
            <div className="flex">
              <input
                type="text"
                value={customAction}
                onChange={(e) => setCustomAction(e.target.value)}
                placeholder="Ou digite sua própria ação..."
                className="flex-grow bg-gray-700 text-white rounded-l px-3 py-2"
              />
              <Button
                onClick={() => {/* Lógica para lidar com a ação personalizada */}}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-l-none"
              >
                &gt;
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}