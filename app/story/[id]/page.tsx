"use client"

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { TranslatableWord } from '@/components/TranslatableWord'
import { TranslatableButton } from '@/components/ui/TranslatableButton'
import { stories } from '@/data/stories'
import { useStoryState } from '@/hooks/useStoryState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function StoryPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const storyLanguage = searchParams.get('target') || 'Inglês'
  const translationLanguage = searchParams.get('native') || 'Português'

  const storyData = stories.find(s => s.id === params.id)

  if (!storyData) return <div>História não encontrada</div>

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <StoryContent
        storyData={storyData}
        storyLanguage={storyLanguage}
        translationLanguage={translationLanguage}
      />
    </Suspense>
  ) // Adicionado o parêntese de fechamento aqui
}

function StoryContent({
  storyData,
  storyLanguage,
  translationLanguage,
}: {
  storyData: any
  storyLanguage: string
  translationLanguage: string
}) {
  const {
    story,
    options,
    isLoading,
    handleOptionClick,
    customAction,
    setCustomAction,
    handleCustomAction,
  } = useStoryState(storyData, storyLanguage, translationLanguage)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl mb-4">{storyData.title}</h1>
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <div className="mb-6 text-lg">
              {story.split(/(\s+)/).map((word: string, index: number) =>
                word.trim().length === 0 ? (
                  word
                ) : (
                  <TranslatableWord
                    key={index}
                    word={word}
                    fromLanguage={storyLanguage}
                    toLanguage={translationLanguage}
                  />
                )
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {options.map((option: string, index: number) => (
                <Button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {option}
                </Button>
              ))}
            </div>
            <div className="flex">
              <Input
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