'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { stories, getStoriesByGenre } from '../config/storyConfig'

export default function SelectAdventure() {
  const router = useRouter()
  const [selectedGenre, setSelectedGenre] = useState('')

  const handleStorySelection = (story: Story) => {
    router.push(`/select-language?id=${story.id}&image=${encodeURIComponent(story.selectLanguageImage)}&title=${encodeURIComponent(story.title)}&summary=${encodeURIComponent(story.selectLanguageDescription)}`)
  }

  const genres = [...new Set(stories.map(story => story.genre))]

  return (
    <div>
      <h1>Selecione um Gênero</h1>
      <select onChange={(e) => setSelectedGenre(e.target.value)}>
        <option value="">Escolha um gênero</option>
        {genres.map(genre => (
          <option key={genre} value={genre}>{genre}</option>
        ))}
      </select>

      {selectedGenre && (
        <div>
          <h2>Histórias de {selectedGenre}</h2>
          {getStoriesByGenre(selectedGenre).map(story => (
            <button key={story.id} onClick={() => handleStorySelection(story)}>
              {story.title}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

