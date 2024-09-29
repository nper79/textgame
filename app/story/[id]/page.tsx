// textgame/app/path_to_your_component/StoryPage.tsx

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRightIcon } from 'lucide-react';
import TranslatableWord from '@/components/TranslatableWord';

interface StoryData {
  id: string;
  title?: string;
  summary: string;
  options: string[];
}

interface StorySegment {
  text: string;
  choice?: string;
}

interface WordStatus {
  word: string;
  lastClickedBlock: number;
  appearedInLastBlock: boolean;
}

const StoryPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = (params.id as string) || 'default';
  const language = searchParams.get('target') || 'en';
  const nativeLanguage = searchParams.get('native') || 'en';

  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [storySegments, setStorySegments] = useState<StorySegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customAction, setCustomAction] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [clickedWords, setClickedWords] = useState<WordStatus[]>([]);
  const [currentBlock, setCurrentBlock] = useState<number>(0);

  const debugInfoRef = useRef<string>('');
  const initialFetchRef = useRef(false);

  const addDebugInfo = useCallback((info: string) => {
    debugInfoRef.current += '\n' + info;
    console.log(info);
  }, []);

  const fetchStory = useCallback(async (choice?: string, previousSummaryParam?: string) => {
    addDebugInfo('Buscando história com escolha: ' + (choice || 'inicial'));
    setIsLoading(true);
    setError(null);

    const previousSummary = previousSummaryParam !== undefined
      ? previousSummaryParam
      : storySegments.map(segment => segment.text).join('\n\n');

    try {
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
          clickedWords: clickedWords.map(w => w.word),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }

      const data = await response.json();

      // Log detalhado das opções
      console.log('Opções recebidas da API (raw):', data.options);
      console.log('Opções após normalização:');
      data.options.forEach((option: string, index: number) => {
        console.log(`Opção ${index + 1}:`, option);
        console.log(`Opção ${index + 1} (normalizada):`, normalizeText(option));
      });

      if ((storySegments.length === 0 && !data.title) || !data.summary || !Array.isArray(data.options) || data.options.length === 0) {
        throw new Error('Dados da história incompletos ou inválidos');
      }

      setStoryData(data);
      setStorySegments(prev => [...prev, { text: data.summary, choice: choice }]);
      setCurrentBlock(prev => prev + 1);
      
      const newBlockWords = new Set(data.summary.toLowerCase().split(/\s+/));
      
      setClickedWords(prev => 
        prev.filter(wordStatus => {
          // Remove a palavra se apareceu no bloco anterior e não foi clicada
          if (wordStatus.appearedInLastBlock && wordStatus.lastClickedBlock < currentBlock) {
            return false;
          }
          return true;
        }).map(wordStatus => ({
          ...wordStatus,
          appearedInLastBlock: newBlockWords.has(wordStatus.word.toLowerCase())
        }))
      );

      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao buscar história:', error);
      setError('Falha ao carregar história. ' + (error as Error).message);
      setIsLoading(false);
    }
  }, [id, language, nativeLanguage, storySegments, addDebugInfo, clickedWords, currentBlock]);

  useEffect(() => {
    if (!initialFetchRef.current) {
      initialFetchRef.current = true;
      fetchStory();
    }
  }, [fetchStory]);

  const handleOptionWordClick = (e: React.MouseEvent<HTMLSpanElement>, word: string) => {
    e.stopPropagation(); // Prevents the click on the word from triggering the option selection
    handleWordClick(word);
  };

  const handleOptionClick = (option: string) => {
    if (isLoading) return;
    const updatedPreviousSummary = [...storySegments.map(s => s.text), storyData!.summary].join('\n\n');
    fetchStory(option, updatedPreviousSummary);
  };

  const handleCustomAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAction.trim() && !isLoading) {
      const updatedPreviousSummary = [...storySegments.map(s => s.text), storyData!.summary].join('\n\n');
      fetchStory(customAction.trim(), updatedPreviousSummary);
      setCustomAction('');
    }
  };

  const handleWordClick = useCallback((word: string) => {
    setClickedWords(prev => {
      const existingWordIndex = prev.findIndex(w => w.word.toLowerCase() === word.toLowerCase());
      if (existingWordIndex !== -1) {
        const updatedWords = [...prev];
        updatedWords[existingWordIndex] = {
          ...updatedWords[existingWordIndex],
          lastClickedBlock: currentBlock,
          appearedInLastBlock: true,
        };
        return updatedWords;
      } else {
        return [...prev, { word, lastClickedBlock: currentBlock, appearedInLastBlock: true }];
      }
    });
  }, [currentBlock]);

  const normalizeText = (text: string) => {
    // Apenas remove espaços em branco extras e faz trim
    return text.trim().replace(/\s+/g, ' ');
  };

  const renderTranslatableText = (text: string) => {
    return text.split(' ').map((word, idx) => (
      <React.Fragment key={idx}>
        <TranslatableWord
          word={word}
          sourceLanguage={language}
          targetLanguage={nativeLanguage}
          onWordClick={handleWordClick}
        />
        {' '}
      </React.Fragment>
    ));
  };

  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4" 
         style={{backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Omgktnq0WE63kht5XLDg36IDNAvNQN.png')"}}>
      <div className="w-full max-w-3xl">
        <div className="relative z-10 bg-gray-900/90 p-6 rounded-lg border border-cyan-400/30 shadow-lg shadow-cyan-500/30">
          {error ? (
            <div className="text-red-500">Erro: {error}</div>
          ) : (!storyData && storySegments.length === 0) ? (
            <div className="text-white">Loading Adventure, please wait...</div>
          ) : (
            <>
              <ScrollArea className="h-[300px] w-full rounded mb-6 overflow-hidden bg-gray-800/80">
                <div className="p-4">
                  {storySegments.map((segment, index) => (
                    <div key={index} className="mb-3">
                      {segment.choice && (
                        <p className="text-pink-400">&gt; {renderTranslatableText(segment.choice)}</p>
                      )}
                      <p className="text-cyan-300">
                        {renderTranslatableText(segment.text)}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {isLoading && (
                <div className="flex justify-center items-center mb-4">
                  <div className="loading-dots">
                    <span className="dot dot1"></span>
                    <span className="dot dot2"></span>
                    <span className="dot dot3"></span>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl mb-2 text-white">Palavras clicadas:</h2>
                <div className="flex flex-wrap gap-2">
                  {clickedWords.map((wordStatus, index) => (
                    <span key={index} className="bg-blue-600 px-2 py-1 rounded text-white">{wordStatus.word}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {storyData!.options.map((option, index) => {
                  const normalizedOption = normalizeText(option);
                  console.log(`Opção ${index + 1} renderizada:`, normalizedOption);
                  return (
                    <div 
                      key={index}
                      onClick={() => !isLoading && handleOptionClick(option)}
                      className={`bg-cyan-600 hover:bg-cyan-700 text-white border-none whitespace-normal h-auto py-2 px-4 text-left cursor-pointer rounded ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {normalizedOption.split(/\s+/).map((word, wordIndex) => (
                        <React.Fragment key={wordIndex}>
                          <TranslatableWord
                            word={word}
                            sourceLanguage={language}
                            targetLanguage={nativeLanguage}
                            onWordClick={handleWordClick}
                          />
                          {' '}
                        </React.Fragment>
                      ))}
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleCustomAction} className="flex space-x-2">
                <Input
                  type="text"
                  value={customAction}
                  onChange={(e) => setCustomAction(e.target.value)}
                  placeholder="Or type your own action..."
                  className="flex-grow bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  disabled={isLoading}
                />
                <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded" disabled={isLoading}>
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryPage;
