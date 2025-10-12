'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceNewsButtonProps {
  onDone?: () => void;
}

const VoiceNewsButton = ({ onDone }: VoiceNewsButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Warren Buffett style financial commentary (exactly 50 words)
  const financialNews = "Welcome to The Scoop! Here's what's happening in today's markets. The Dow Jones is up 150 points, showing strong investor confidence. Apple just reported solid earnings, beating expectations with strong iPhone sales. Oil prices climbed 2% on supply concerns, while the Federal Reserve kept interest rates steady. Bitcoin reached $45,000, continuing its recent rally. European markets were mixed as investors weighed economic data. Stay tuned for more market insights and breaking financial news.";

  const handleVoiceNews = async () => {
    if (isPlaying) return;
    
    setIsLoading(true);
    setIsPlaying(true);

    try {
      // Call the backend API through Next.js proxy
      const response = await fetch('/api/backend/voice-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: financialNews }),
        mode: 'cors', // Explicitly set CORS mode
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Voice generation failed:', response.status, errorText);
        throw new Error(`Failed to generate voice: ${response.status} ${errorText}`);
      }

      const audioBlob = await response.blob();
      console.log('Audio blob received:', audioBlob.size, 'bytes');
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        onDone?.();
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
        onDone?.();
      };

      await audio.play();
    } catch (error) {
      console.error('Error generating voice news:', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleVoiceNews}
      disabled={isLoading || isPlaying}
      variant="outline"
      className="flex items-center gap-2 bg-black/40 backdrop-blur-sm border-white/10 hover:border-green-500/50 text-white hover:text-green-300 transition-all duration-200"
    >
      {isLoading ? (
        <div className="border-2 border-green-500 border-t-transparent rounded-full w-4 h-4 animate-spin" />
      ) : isPlaying ? (
        <Volume2 className="w-4 h-4 text-green-500" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
        {isLoading ? 'Generating...' : isPlaying ? 'Playing The Scoop...' : 'The Scoop'}
    </Button>
  );
};

export default VoiceNewsButton;
