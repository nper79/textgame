'use client';

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getStoryById, Story } from '@/data/storyPrompts'

const languages = [
  { code: 'en', name: 'English', flag: '/circle-flags/flags/gb.svg' },
  { code: 'pt', name: 'Portuguese', flag: '/circle-flags/flags/pt.svg' },
  { code: 'es', name: 'Spanish', flag: '/circle-flags/flags/es.svg' },
  { code: 'fr', name: 'French', flag: '/circle-flags/flags/fr.svg' },
  { code: 'de', name: 'German', flag: '/circle-flags/flags/de.svg' },
  { code: 'it', name: 'Italian', flag: '/circle-flags/flags/it.svg' },
  { code: 'ru', name: 'Russian', flag: '/circle-flags/flags/ru.svg' },
  { code: 'zh', name: 'Chinese', flag: '/circle-flags/flags/cn.svg' },
  { code: 'ja', name: 'Japanese', flag: '/circle-flags/flags/jp.svg' },
]

function LanguageSelect({ languages, value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2 text-gray-300">{label}</label>
      <div 
        className="w-full p-2 bg-gray-700 text-white rounded flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? (
          <>
            <Image src={languages.find(l => l.code === value).flag} alt="" width={24} height={24} className="mr-2" />
            {languages.find(l => l.code === value).name}
          </>
        ) : (
          <span>Select language</span>
        )}
        <span className="ml-2">▼</span>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded shadow-lg">
          {languages.map((lang) => (
            <div 
              key={lang.code}
              className="flex items-center p-2 hover:bg-gray-600 cursor-pointer"
              onClick={() => {
                onChange(lang.code);
                setIsOpen(false);
              }}
            >
              <Image src={lang.flag} alt="" width={24} height={24} className="mr-2" />
              {lang.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SelectLanguage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || ''
  const story = getStoryById(id)

  const [storyLanguage, setStoryLanguage] = React.useState('')
  const [translationLanguage, setTranslationLanguage] = React.useState('')

  if (!story) {
    return <div>História não encontrada</div>
  }

  const handleStartGame = () => {
    if (storyLanguage && translationLanguage) {
      router.push(`/story/${id}?target=${storyLanguage}&native=${translationLanguage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-800 border-none overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative h-64 md:h-full">
            <Image
              src={story.selectLanguageImage}
              alt={story.title}
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{story.title}</h1>
              <p className="text-sm text-gray-300">Select your languages to begin the adventure</p>
            </div>
          </div>
          <CardContent className="p-6">
            <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
              <div className="space-y-6 pt-8"> {/* Adicionado pt-8 aqui */}
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-blue-400">Story Summary</h2>
                  <p className="text-sm text-gray-300 mb-6">
                    {story.selectLanguageDescription}
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-blue-400">Select Languages</h2>
                  <div className="space-y-4">
                    <LanguageSelect
                      languages={languages}
                      value={storyLanguage}
                      onChange={setStoryLanguage}
                      label="Story Language"
                    />
                    <LanguageSelect
                      languages={languages}
                      value={translationLanguage}
                      onChange={setTranslationLanguage}
                      label="Translation Language"
                    />
                  </div>
                  <Button 
                    className="w-full mt-6 bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2 text-lg transition-colors duration-300 ease-in-out"
                    disabled={!storyLanguage || !translationLanguage}
                    onClick={handleStartGame}
                  >
                    Start Adventure
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}