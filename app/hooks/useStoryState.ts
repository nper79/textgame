import { useState, useEffect } from 'react'

interface StoryData {
  id: string
  title: string
  summary: string
}

export function useStoryState(storyData: StoryData, storyLanguage: string, translationLanguage: string) {
  const [story, setStory] = useState('')
  const [options, setOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [customAction, setCustomAction] = useState('')

  useEffect(() => {
    fetchInitialScenario()
  }, [storyData, storyLanguage, translationLanguage])

  async function fetchInitialScenario() {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId: storyData.id,
          storyTitle: storyData.title,
          storySummary: storyData.summary,
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

  async function handleOptionClick(option: string) {
    await fetchNextScenario(option)
  }

  async function handleCustomAction() {
    if (customAction.trim()) {
      await fetchNextScenario(customAction.trim())
      setCustomAction('')
    }
  }

  async function fetchNextScenario(action: string) {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId: storyData.id,
          storyTitle: storyData.title,
          storySummary: storyData.summary,
          storyLanguage,
          translationLanguage,
          action,
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

  return {
    story,
    options,
    isLoading,
    handleOptionClick,
    customAction,
    setCustomAction,
    handleCustomAction,
  }
}