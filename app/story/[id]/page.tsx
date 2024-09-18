'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useParams } from 'next/navigation'

interface StoryData {
  id: string
  title: string
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
  const [storyData, setStoryData] = useState<StoryData | null>(null)
  const [storySegments, setStorySegments] = useState<StorySegment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [customAction, setCustomAction] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')
  const [hasInitialFetch, setHasInitialFetch] = useState(false)

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => prev + '\n' + info)
    console.log(info)
  }

  const fetchStory = useCallback(async (choice?: string) => {
    addDebugInfo('Fetching story with choice: ' + (choice || 'initial'))
    setIsLoading(true)
    setError(null)
    const id = params.id as string || 'default'
    const language = searchParams.get('target') || 'en'
    const nativeLanguage = searchParams.get('native') || 'en'

    addDebugInfo(`Fetching story with language: ${language}`)

    try {
      addDebugInfo(`Calling API with: id=${id}, language=${language}, native=${nativeLanguage}, choice=${choice || ''}`)
      const response = await fetch(`/api/story?id=${id}&language=${language}&native=${nativeLanguage}&choice=${choice || ''}`)
      addDebugInfo('API response status: ' + response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      addDebugInfo('Received story data: ' + JSON.stringify(data))

      if (!data.title || !data.summary || !Array.isArray(data.options)) {
        throw new Error('Dados da história incompletos ou inválidos')
      }
      
      addDebugInfo('Setting story data and segments')
      setStoryData(data)
      setStorySegments(prev => [...prev, { text: data.summary, choice }])
    } catch (error) {
      addDebugInfo('Erro ao obter dados da história: ' + error.message)
      setError(`Falha ao carregar a história. Erro: ${error.message}`)
    } finally {
      addDebugInfo('Setting isLoading to false')
      setIsLoading(false)
    }
  }, [params, searchParams])

  useEffect(() => {
    addDebugInfo(`Effect running, storyData: ${storyData ? 'exists' : 'null'}, isLoading: ${isLoading}, hasInitialFetch: ${hasInitialFetch}`)
    addDebugInfo(`URL Params: id=${params.id}, target=${searchParams.get('target')}, native=${searchParams.get('native')}`)
    if (!storyData && !hasInitialFetch) {
      addDebugInfo('Fetching initial story')
      setHasInitialFetch(true)
      fetchStory()
    }
  }, [fetchStory, storyData, params, searchParams, hasInitialFetch])

  const handleOptionClick = (option: string) => {
    fetchStory(option)
  }

  const handleCustomAction = () => {
    if (customAction.trim()) {
      fetchStory(customAction.trim())
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
      <h2>Estado atual:</h2>
      <p>isLoading: {isLoading ? 'Sim' : 'Não'}</p>
      <p>Erro: {error || 'Nenhum'}</p>
      <p>storyData: {storyData ? 'Disponível' : 'Não disponível'}</p>
      <p>Número de segmentos: {storySegments.length}</p>
      
      {isLoading ? (
        <div>Carregando... (Verifique o console para mais detalhes)</div>
      ) : error ? (
        <div>Erro: {error}</div>
      ) : !storyData ? (
        <div>Nenhum dado de história disponível. Por favor, tente novamente.</div>
      ) : (
        <>
          <h1 style={{ color: '#bb86fc', textAlign: 'center' }}>{storyData.title}</h1>
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
            {storyData.options.map((option, index) => (
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
      <h3>Informações de depuração:</h3>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', backgroundColor: '#000', padding: '10px', borderRadius: '5px' }}>{debugInfo}</pre>
    </div>
  )
}

export default StoryPage