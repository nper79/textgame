'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface StoryData {
  id: string
  title: string
  summary: string
  options: string[]
}

const StoryPage: React.FC = () => {
  const [storyData, setStoryData] = useState<StoryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()

  const fetchStory = async (choice?: string) => {
    setIsLoading(true)
    const id = searchParams.get('id') || 'default'
    const language = searchParams.get('target') || 'en'
    const nativeLanguage = searchParams.get('native') || 'en'

    try {
      const response = await fetch(`/api/story?id=${id}&language=${language}&choice=${choice || ''}`)
      const data = await response.json()
      setStoryData(data)
    } catch (error) {
      console.error('Erro ao obter dados da história:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStory()
  }, [])

  const handleOptionClick = (option: string) => {
    fetchStory(option)
  }

  if (isLoading) return <div>Carregando...</div>
  if (!storyData) return <div>Erro ao carregar a história. Por favor, tente novamente.</div>

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#333' }}>{storyData.title}</h1>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{storyData.summary}</p>
      <h2 style={{ color: '#555', marginTop: '20px' }}>Opções:</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {storyData.options.map((option, index) => (
          <li 
            key={index} 
            onClick={() => handleOptionClick(option)}
            style={{ 
              backgroundColor: '#f0f0f0', 
              margin: '10px 0', 
              padding: '10px', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {option}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#777' }}>
        ID da História: {storyData.id}<br />
        Idioma: {searchParams.get('target') || 'en'}<br />
        Idioma Nativo: {searchParams.get('native') || 'en'}
      </div>
    </div>
  )
}

export default StoryPage