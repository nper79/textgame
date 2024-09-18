import { useState, useEffect, useCallback, useRef } from 'react'

interface StoryData {
  id: string
  title: string
  summary: string
}

interface UseStoryStateProps {
  storyData: StoryData
  storyLanguage: string
}

export function useStoryState({ storyData, storyLanguage }: UseStoryStateProps) {
  const [story, setStory] = useState<string>('')
  const [options, setOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [customAction, setCustomAction] = useState<string>('')
  const isMounted = useRef<boolean>(true)

  const fetchScenario = useCallback(async (action?: string) => {
    if (!isMounted.current) return
    setIsLoading(true)
    try {
      console.log('DEBUG - Fetching scenario with:', { storyLanguage, storyTitle: storyData.title, action })
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyLanguage,
          storyTitle: storyData.title,
          storySummary: storyData.summary,
          action,
          previousScenario: story,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch scenario')
      }

      const data = await response.json()
      console.log('DEBUG - API response:', data)
      if (isMounted.current) {
        setStory(data.scenario)
        setOptions(data.options)
        console.log('DEBUG - State updated:', { scenario: data.scenario, options: data.options })
      }
    } catch (error) {
      console.error('Error fetching scenario:', error)
      if (isMounted.current) {
        setStory('Erro ao carregar a história. Por favor, tente novamente.')
        setOptions([])
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }, [storyLanguage, storyData.title, storyData.summary, story])

  useEffect(() => {
    fetchScenario()
    return () => {
      isMounted.current = false
    }
  }, [fetchScenario])

  const handleOptionClick = useCallback((option: string) => {
    fetchScenario(option)
  }, [fetchScenario])

  const handleCustomAction = useCallback(() => {
    if (customAction.trim()) {
      fetchScenario(customAction.trim())
      setCustomAction('')
    }
  }, [customAction, fetchScenario])

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