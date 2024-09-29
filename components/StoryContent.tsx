import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import TranslatableWord from '@/components/TranslatableWord'

interface StoryContentProps {
  storyData: any
  storyLanguage: string
  nativeLanguage: string
}

export function StoryContent({ storyData, storyLanguage, nativeLanguage }: StoryContentProps) {
  const [clickedWords, setClickedWords] = useState<string[]>([])

  const handleWordClick = useCallback((word: string) => {
    setClickedWords(prev => [...new Set([...prev, word])])
  }, [])

  const renderTranslatableText = (text: string) => {
    return text.split(' ').map((word, idx) => (
      <TranslatableWord
        key={idx}
        word={word}
        fromLanguage={storyLanguage}
        toLanguage={nativeLanguage}
        onWordClick={() => handleWordClick(word)}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl mb-4">{storyData.title}</h1>
        <ScrollArea className="h-[300px] mb-6">
          <div className="p-4 bg-gray-800 rounded">
            {renderTranslatableText(storyData.summary)}
          </div>
        </ScrollArea>

        <div className="mb-6">
          <h2 className="text-xl mb-2">Palavras clicadas:</h2>
          <div className="flex flex-wrap gap-2">
            {clickedWords.map((word, index) => (
              <span key={index} className="bg-blue-600 px-2 py-1 rounded">{word}</span>
            ))}
          </div>
        </div>

        {/* Opções e ações personalizadas */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {storyData.options.map((option: string, index: number) => (
            <Button
              key={index}
              onClick={() => {/* Lógica para lidar com a opção */}}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {renderTranslatableText(option)}
            </Button>
          ))}
        </div>
        <div className="flex">
          <Input
            type="text"
            placeholder="Ou digite sua própria ação..."
            className="flex-grow bg-gray-700 text-white rounded-l"
          />
          <Button
            onClick={() => {/* Lógica para lidar com ação personalizada */}}
            className="bg-purple-600 hover:bg-purple-700 rounded-l-none"
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  )
}