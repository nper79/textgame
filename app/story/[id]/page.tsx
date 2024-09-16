'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import TranslatableWord from "@/components/TranslatableWord"
import { storyPrompts } from '@/data/storyPrompts'

export default function StoryPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<string>('')
  const [options, setOptions] = useState<string[]>([])
  const [customAction, setCustomAction] = useState('')
  const searchParams = useSearchParams()

  const storyLanguage = searchParams.get('target') || 'en'
  const translationLanguage = searchParams.get('native') || 'en'

  useEffect(() => {
    fetchInitialScenario()
  }, [])

  const fetchInitialScenario = async () => {
    const response = await fetch('/api/generate-scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyId: params.id,
        storyLanguage,
      }),
    })
    const data = await response.json()
    setStory(data.scenario)
    setOptions(data.options)
  }

  const handleOptionClick = async (option: string) => {
    const response = await fetch('/api/process-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: option,
        storyId: params.id,
        storyLanguage,
        previousScenario: story,
      }),
    })
    const data = await response.json()
    setStory(data.scenario)
    setOptions(data.options)
  }

  const handleCustomAction = async () => {
    if (customAction.trim()) {
      await handleOptionClick(customAction.trim())
      setCustomAction('')
    }
  }

  const renderTranslatableText = (text: string, isOption = false) => {
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');
    
    return paragraphs.map((paragraph, paragraphIndex) => (
      <p key={paragraphIndex} className={isOption ? "" : "mb-2"}>
        {paragraph.split(/\s+/).map((word, index) => (
          <React.Fragment key={index}>
            <TranslatableWord
              word={word}
              fromLanguage={storyLanguage}
              toLanguage={translationLanguage}
              onClick={isOption ? (e) => e.stopPropagation() : undefined}
            />
            {' '}
          </React.Fragment>
        ))}
      </p>
    ));
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{backgroundImage: "url('/images/story-background.jpg')"}}>
      <div className="bg-black bg-opacity-70 text-white p-8 rounded-lg shadow-lg max-w-3xl w-full flex flex-col h-[80vh]">
        <h1 className="text-2xl font-bold mb-4 text-center text-cyan-400">Adventure</h1>
        <div className="flex-grow overflow-y-auto mb-4">
          {renderTranslatableText(story)}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleOptionClick(option)}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {renderTranslatableText(option, true)}
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
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-l-none"
          >
            &gt;
          </Button>
        </div>
      </div>
    </div>
  )
}