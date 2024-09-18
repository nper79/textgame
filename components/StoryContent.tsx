'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useStoryState } from '@/hooks/useStoryState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface StoryContentProps {
  storyData: {
    id: string
    title: string
    summary: string
    backgroundImage: string
  }
  storyLanguage: string
}

const StoryContent: React.FC<StoryContentProps> = ({ storyData, storyLanguage }) => {
  const {
    story,
    options,
    isLoading,
    handleOptionClick,
    customAction,
    setCustomAction,
    handleCustomAction,
  } = useStoryState({ storyData, storyLanguage })

  const [renderCount, setRenderCount] = useState<number>(0)

  useEffect(() => {
    console.log(`DEBUG - StoryContent rendering #${renderCount + 1}`)
    console.log('DEBUG - Story:', story)
    console.log('DEBUG - Options:', options)
    console.log('DEBUG - Is loading:', isLoading)
    setRenderCount(prev => prev + 1)
  }, [story, options, isLoading])

  const onOptionClick = useCallback((option: string) => {
    console.log('DEBUG - Option clicked:', option)
    handleOptionClick(option)
  }, [handleOptionClick])

  const onCustomActionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAction(e.target.value)
  }, [setCustomAction])

  const onCustomActionSubmit = useCallback(() => {
    console.log('DEBUG - Custom action submitted:', customAction)
    handleCustomAction()
  }, [customAction, handleCustomAction])

  return (
    <div
      className="min-h-screen bg-gray-900 text-white p-4"
      style={{
        backgroundImage: `url(${storyData.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-2xl mx-auto bg-black bg-opacity-70 p-8 rounded-2xl border border-cyan-400/30 shadow-lg shadow-cyan-500/30 backdrop-blur-md">
        <h1 className="text-2xl mb-4">{storyData.title}</h1>
        <div className="mb-4">
          <p>{isLoading ? 'Carregando história...' : story}</p>
        </div>
        {isLoading ? (
          <p>Carregando opções...</p>
        ) : options && options.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 mb-4">
            {options.map((option, index) => (
              <Button
                key={index}
                onClick={() => onOptionClick(option)}
                className="bg-blue-600 hover:bg-blue-700 text-left p-2"
              >
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <p>Nenhuma opção disponível.</p>
        )}
        <div className="flex mt-4">
          <Input
            type="text"
            value={customAction}
            onChange={onCustomActionChange}
            placeholder="Ou digite sua própria ação..."
            className="flex-grow bg-gray-700 text-white rounded-l px-3 py-2"
          />
          <Button
            onClick={onCustomActionSubmit}
            className="bg-purple-600 hover:bg-purple-700 rounded-l-none"
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StoryContent