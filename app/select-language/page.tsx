'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"

const languages = ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão']

export default function SelectLanguage() {
  const [storyLanguage, setStoryLanguage] = useState('')
  const [translationLanguage, setTranslationLanguage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const storyId = searchParams.get('id')

  const handleStartGame = () => {
    if (storyLanguage && translationLanguage) {
      router.push(`/story/${storyId}?target=${storyLanguage}&native=${translationLanguage}`)
    } else {
      alert('Por favor, selecione ambos os idiomas antes de começar.')
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-black">
      <div className="relative z-10 bg-gray-900/80 p-8 rounded-2xl border border-cyan-400/30 shadow-lg shadow-cyan-500/30 backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-6 text-cyan-400">Selecione os Idiomas</h2>
        
        <div className="mb-6">
          <label className="block text-white mb-2">Idioma da História</label>
          <select 
            value={storyLanguage} 
            onChange={(e) => setStoryLanguage(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2"
          >
            <option value="">Selecione...</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-white mb-2">Idioma da Tradução</label>
          <select 
            value={translationLanguage} 
            onChange={(e) => setTranslationLanguage(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2"
          >
            <option value="">Selecione...</option>
            {languages.filter(lang => lang !== storyLanguage).map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        
        <Button 
          onClick={handleStartGame}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Iniciar Aventura
        </Button>
      </div>
    </div>
  )
}