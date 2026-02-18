
import React, { useState } from 'react';
import { generateSpeech } from '../services/gemini';
import { playPcmAudio } from '../services/audio';

interface PronunciationButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PronunciationButton: React.FC<PronunciationButtonProps> = ({ text, size = 'md', className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;
    
    setIsPlaying(true);
    const audioData = await generateSpeech(text);
    if (audioData) {
      await playPcmAudio(audioData);
    }
    setIsPlaying(false);
  };

  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

  return (
    <button
      onClick={handlePlay}
      disabled={isPlaying}
      className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${isPlaying ? 'opacity-50 animate-pulse' : ''} ${className}`}
      title="Pronounce"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    </button>
  );
};

export default PronunciationButton;
