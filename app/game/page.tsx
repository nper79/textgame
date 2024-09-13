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
  const scrollRef = useRef<HTMLDivElement>(null);

  const adventureType = searchParams.get('type') || 'Fantasy'
  const storyLanguage = searchParams.get('story') || 'English'
  const translationLanguage = searchParams.get('translation') || 'Portuguese'

  useEffect(() => {
    fetchScenario()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{backgroundImage: "url('/images/cyberbackground.webp')"}}>
      <div className="bg-black bg-opacity-70 text-white p-8 rounded-lg shadow-lg max-w-3xl w-full flex flex-col h-[80vh]">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {adventureType} Adventure
        </h1>
        <div ref={scrollRef} className="flex-grow overflow-y-auto mb-6 pr-4">
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
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {currentOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className="bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              {renderTranslatableText(option, true)}
            </button>
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
          <button
            onClick={handleCustomAction}
            className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-2 px-4 rounded-r transition duration-300"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}