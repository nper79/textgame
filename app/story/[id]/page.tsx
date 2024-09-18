'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useParams } from 'next/navigation'

interface StoryData {
  id: string
  title?: string
  summary: string
  options: string[]
}

interface StorySegment {
  text: string
  choice?: string
}

const StoryPage: React.FC = () => {
  console.log('Rendering StoryPage')

  const params = useParams()
  const searchParams = useSearchParams()

  // Extract parameters once
  const id = params.id as string || 'default'
  const language = searchParams.get('target') || 'en'
  const nativeLanguage = searchParams.get('native') || 'en'

  const [storyData, setStoryData] = useState<{ id: string; title?: string } | null>(null)
  const [storySegments, setStorySegments] = useState<StorySegment[]>([])
  const [options, setOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [customAction, setCustomAction] = useState('')
  const [error, setError] = useState<string | null>(null)
  const debugInfoRef = useRef<string>('')

  // Use a ref to track if the initial fetch has been made
  const initialFetchRef = useRef(false)

  // Wrap addDebugInfo in useCallback to prevent unnecessary re-renders
  const addDebugInfo = useCallback((info: string) => {
    debugInfoRef.current += '\n' + info
    console.log(info)
  }, [])

  const fetchStory = useCallback(
    async (choice?: string, previousSummaryParam?: string) => {
      addDebugInfo('Fetching story with choice: ' + (choice || 'initial'))
      setIsLoading(true)
      setError(null)

      const previousSummary =
        previousSummaryParam !== undefined
          ? previousSummaryParam
          : storySegments.map((segment) => segment.text).join('\n\n')

      try {
        addDebugInfo(
          `Calling API with: id=${id}, language=${language}, native=${nativeLanguage}, choice=${choice || ''}`
        )
        const response = await fetch('/api/story', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            language,
            nativeLanguage,
            choice: choice || '',
            previousSummary,
          }),
        })

        addDebugInfo('API response status: ' + response.status)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: StoryData = await response.json()
        addDebugInfo('Received story data: ' + JSON.stringify(data))

        if (
          (storySegments.length === 0 && !data.title) ||
          !data.summary ||
          !Array.isArray(data.options) ||
          data.options.length === 0
        ) {
          throw new Error('Incomplete or invalid story data')
        }

        addDebugInfo('Setting story data and segments')

        if (data.title && storySegments.length === 0) {
          // First time, set title
          setStoryData({ id: data.id, title: data.title })
        }

        // Update story segments with the new summary and the choice made
        setStorySegments((prev) => [...prev, { text: data.summary, choice }])

        // Update options for the next set of choices
        setOptions(data.options)
      } catch (error) {
        addDebugInfo('Error fetching story data: ' + error.message)
        setError('Ops! Algo deu errado. Por favor, tente novamente.')
      } finally {
        addDebugInfo('Setting isLoading to false')
        setIsLoading(false)
      }
    },
    [id, language, nativeLanguage, addDebugInfo, storySegments]
  )

  useEffect(() => {
    // Check if the initial fetch has already been made
    if (!initialFetchRef.current) {
      initialFetchRef.current = true
      fetchStory()
    }
  }, [fetchStory])

  const handleOptionClick = (option: string) => {
    const updatedPreviousSummary = [...storySegments.map((s) => s.text), options.length > 0 ? options.join('\n') : ''].join('\n\n')

    fetchStory(option, updatedPreviousSummary)
  }

  const handleCustomAction = () => {
    if (customAction.trim()) {
      const updatedPreviousSummary = [...storySegments.map((s) => s.text), options.length > 0 ? options.join('\n') : ''].join('\n\n')

      fetchStory(customAction.trim(), updatedPreviousSummary)
      setCustomAction('')
    }
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#1a1a2e',
      color: '#61dafb',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2>Estado Atual:</h2>
      <p>isLoading: {isLoading ? 'Sim' : 'Não'}</p>
      <p>Erro: {error || 'Nenhum'}</p>
      <p>storyData: {storyData ? 'Disponível' : 'Não disponível'}</p>
      <p>Número de segmentos: {storySegments.length}</p>

      {isLoading ? (
        <div>Carregando... (Verifique o console para mais detalhes)</div>
      ) : error ? (
        <div>Erro: {error}</div>
      ) : (!storyData && storySegments.length === 0) ? (
        <div>Nenhuma história disponível. Por favor, tente novamente.</div>
      ) : (
        <>
          {storyData && storyData.title && (
            <h1 style={{ color: '#bb86fc', textAlign: 'center' }}>{storyData.title}</h1>
          )}
          <div style={{
            backgroundColor: '#0d0d1a',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            {storySegments.map((segment, index) => (
              <div key={index}>
                {segment.choice && (
                  <p style={{ color: '#ff79c6' }}>&gt; {segment.choice}</p>
                )}
                <p>{segment.text}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                style={{
                  backgroundColor: '#03dac6',
                  color: '#000',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <div style={{ marginTop: '20px', display: 'flex' }}>
            <input
              type="text"
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              placeholder="Ou digite sua própria ação..."
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '5px 0 0 5px',
                border: 'none',
                backgroundColor: '#2a2a3a',
                color: '#fff'
              }}
            />
            <button
              onClick={handleCustomAction}
              style={{
                backgroundColor: '#bb86fc',
                color: '#000',
                border: 'none',
                padding: '10px',
                borderRadius: '0 5px 5px 0',
                cursor: 'pointer'
              }}
            >
              &gt;
            </button>
          </div>
        </>
      )}
      <h3>Informações de Depuração:</h3>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', backgroundColor: '#000', padding: '10px', borderRadius: '5px' }}>{debugInfoRef.current}</pre>
    </div>
  )
}

export default StoryPage
