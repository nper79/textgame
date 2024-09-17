"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { TranslatableWord } from '@/components/TranslatableWord'
import { TranslatableButton } from '@/components/TranslatableButton'
import { stories } from '@/app/data/stories'

export default function StoryPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<string>('')
  const [options, setOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const storyLanguage = searchParams.get('target') || 'Inglês'
  const translationLanguage = searchParams.get('native') || 'Português'

  const storyData = stories.find(s => s.id === params.id)

  useEffect(() => {
    if (storyData) {
      fetchInitialScenario()
    }
  }, [storyData, storyLanguage, translationLanguage])

  const fetchInitialScenario = async () => {
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
          translationLanguage,
        }),
      })
      if (!response.ok) throw new Error(`API responded with status ${response.status}`)
      const data = await response.json()
      if (data.scenario && data.options) {
        setStory(data.scenario)
        setOptions(data.options)
      } else {
        throw new Error('API response is missing scenario or options')
      }
    } catch (error) {
      console.error('Erro ao buscar cenário inicial:', error)
      setStory('Erro ao carregar o cenário. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

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
          translationLanguage,
          action: option,
          previousScenario: story
        }),
      })
      if (!response.ok) throw new Error(`API responded with status ${response.status}`)
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
        return part
      }
      return (
        <TranslatableWord
          key={index}
          word={part}
          fromLanguage={storyLanguage}
          toLanguage={translationLanguage}
        />
      )
    })
  }

  if (!storyData) {
    return <div>História não encontrada</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{storyData.title}</h1>
      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <>
          {story && (
            <div className="mb-6 text-lg">
              {renderTranslatableText(story)}
            </div>
          )}
          {options.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
        </>
      )}
    </div>
  )
}