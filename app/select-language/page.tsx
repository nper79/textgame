'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'pt', name: 'Portuguese' },
]

export default function SelectLanguage() {
  const [storyLanguage, setStoryLanguage] = useState('')
  const [translationLanguage, setTranslationLanguage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const storyId = searchParams.get('id')

  // Atualizando a lista de idiomas para incluir o checo
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'German' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'cs', name: 'Czech' }
  ]

  const handleStartGame = () => {
    if (storyLanguage && translationLanguage) {
      router.push(`/story/${storyId}?target=${encodeURIComponent(storyLanguage)}&native=${encodeURIComponent(translationLanguage)}`)
    } else {
      alert('Please select both languages before starting.')
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-black">
      <div className="relative z-10 bg-gray-900/80 p-8 rounded-2xl border border-cyan-400/30 shadow-lg shadow-cyan-500/30 backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-6 text-cyan-400">Select Languages</h2>
        
        <div className="mb-6">
          <label htmlFor="storyLanguage" className="block text-white mb-2">Story Language</label>
          <select
            id="storyLanguage"
            value={storyLanguage}
            onChange={(e) => setStoryLanguage(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2"
          >
            <option value="">Select...</option>
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="translationLanguage" className="block text-white mb-2">Translation Language</label>
          <select
            id="translationLanguage"
            value={translationLanguage}
            onChange={(e) => setTranslationLanguage(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2"
          >
            <option value="">Select...</option>
            {languages.filter(lang => lang.code !== storyLanguage).map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
        
        <Button 
          onClick={handleStartGame}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          disabled={!storyLanguage || !translationLanguage}
        >
          Start Adventure
        </Button>
      </div>
    </div>
  )
}