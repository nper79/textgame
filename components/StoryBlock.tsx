import React, { forwardRef } from 'react';
import TranslatableWord from './TranslatableWord';

interface StoryBlockProps {
  text: string;
  language: string;
  nativeLanguage: string;
  onWordClick: (word: string) => void;
}

const StoryBlock = forwardRef<HTMLDivElement, StoryBlockProps>(
  ({ text, language, nativeLanguage, onWordClick }, ref) => {
    const renderTranslatableText = (text: string) => {
      return text.split(' ').map((word, idx) => (
        <React.Fragment key={idx}>
          <TranslatableWord
            word={word}
            sourceLanguage={language}
            targetLanguage={nativeLanguage}
            onWordClick={onWordClick}
          />
          {' '}
        </React.Fragment>
      ));
    };

    return (
      <div ref={ref} className="bg-gray-800 p-4 rounded-lg mb-4">
        {renderTranslatableText(text)}
      </div>
    );
  }
);

StoryBlock.displayName = 'StoryBlock';

export default StoryBlock;