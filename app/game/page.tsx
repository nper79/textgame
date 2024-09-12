'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import TranslatableWord from '@/components/TranslatableWord'

interface ScenarioBlock {
  text: string;
  action?: string;
}

export default function Game() {
  const searchParams = useSearchParams()
  const [scenarioHistory, setScenarioHistory] = useState<ScenarioBlock[]>([])
  const [currentOptions, setCurrentOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [customAction, setCustomAction] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const adventureType = searchParams.get('type') || 'Fantasy'
  const storyLanguage = searchParams.get('story') || 'English'
  const translationLanguage = searchParams.get('translation') || 'Portuguese'

  useEffect(() => {
    fetchScenario()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [scenarioHistory])

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
          previousScenario: scenarioHistory[scenarioHistory.length - 1]?.text 
        }),
      })
      const data = await response.json()
      
      if (!data.scenario || !data.options || data.options.length !== 4) {
        throw new Error("Invalid response from API");
      }

      if (action) {
        setScenarioHistory(prev => [
          ...prev,
          { text: '', action: action },
          { text: data.scenario, action: undefined }
        ])
      } else {
        setScenarioHistory([{ text: data.scenario, action: undefined }])
      }
      
      setCurrentOptions(data.options)
    } catch (error) {
      console.error("Error fetching scenario:", error);
      setCurrentOptions([
        "Explore the area further",
        "Interact with a nearby object or character",
        "Look for an alternative path or solution",
        "Rest and observe your surroundings"
      ]);
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

  const renderTranslatableText = (text: string, isOption = false) => {
    // Dividir o texto em parágrafos
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <h1 className="text-3xl font-bold p-4 text-cyan-400">{adventureType} Adventure</h1>
      <div className="flex-grow flex flex-col">
        <div className="flex-grow overflow-y-auto p-4">
          {scenarioHistory.map((scenario, index) => (
            <div key={index} className="mb-4">
              {scenario.action && (
                <div className="text-fuchsia-400 mb-2">
                  &gt; {scenario.action}
                </div>
              )}
              {scenario.text && (
                <div className="text-lg">
                  {renderTranslatableText(scenario.text)}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="text-cyan-400 text-2xl">
              <span className="animate-pulse">...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="p-4 bg-gray-800">
          {!isLoading && currentOptions.length === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {currentOptions.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  className="bg-cyan-600 hover:bg-cyan-700 p-4 rounded text-left"
                  onClick={() => handleOptionClick(option)}
                >
                  {renderTranslatableText(option, true)}
                </button>
              ))}
            </div>
          )}
          <div className="flex">
            <input
              type="text"
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              placeholder="Or type your own action..."
              className="flex-grow bg-gray-700 text-white p-2 rounded-l"
            />
            <button
              onClick={handleCustomAction}
              className="bg-purple-600 hover:bg-purple-700 p-2 rounded-r"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}