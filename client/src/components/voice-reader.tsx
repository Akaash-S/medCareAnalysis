import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Pause, RotateCcw, VolumeX } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { MedicalTerm } from "@shared/schema";

interface VoiceReaderProps {
  originalText: string;
  simplifiedText: string;
  identifiedTerms: MedicalTerm[];
  useSimplified?: boolean;
}

export default function VoiceReader({ 
  originalText, 
  simplifiedText, 
  identifiedTerms, 
  useSimplified = true 
}: VoiceReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80); // 0-100
  const [speechRate, setSpeechRate] = useState(1.0); // 0.5-2.0
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const previousVolumeRef = useRef(volume);
  
  // Prepare explanation text for reading
  const textToRead = useSimplified ? simplifiedText : originalText;
  
  // Additional explanation for terms
  const termsExplanation = useSimplified 
    ? identifiedTerms.map(term => 
        `${term.term}: ${term.simplified}.`
      ).join(' ')
    : '';
  
  // Complete text to read
  const fullTextToRead = useSimplified 
    ? `${textToRead}. I will now explain the key medical terms: ${termsExplanation}`
    : textToRead;
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Update volume when it changes
  useEffect(() => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  // Update rate when it changes
  useEffect(() => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.rate = speechRate;
    }
  }, [speechRate]);
  
  // Handle play
  const handlePlay = () => {
    if (isPaused) {
      // Resume the paused speech
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }
    
    if (isPlaying) {
      handlePause();
      return;
    }
    
    // Start new speech synthesis
    window.speechSynthesis.cancel(); // Cancel any previous speech
    
    const utterance = new SpeechSynthesisUtterance(fullTextToRead);
    utterance.volume = volume / 100;
    utterance.rate = speechRate;
    
    // Select a voice (optional)
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => 
      voice.lang.includes('en') && voice.name.includes('Female')
    ) || voices[0];
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    // Event handlers
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      speechSynthesisRef.current = null;
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
      speechSynthesisRef.current = null;
    };
    
    // Store reference and start speaking
    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };
  
  // Handle pause
  const handlePause = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(true);
    }
  };
  
  // Handle reset
  const handleReset = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    speechSynthesisRef.current = null;
  };
  
  // Handle mute toggle
  const handleMuteToggle = () => {
    if (isMuted) {
      // Unmute
      setVolume(previousVolumeRef.current);
      setIsMuted(false);
    } else {
      // Mute
      previousVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  };
  
  return (
    <div className="bg-white rounded-md shadow-sm border border-neutral-200 p-4">
      <div className="flex flex-col space-y-4">
        <h3 className="text-sm font-medium text-neutral-900">Audio Reading</h3>
        
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePlay}
                  disabled={!fullTextToRead}
                  aria-label={isPaused ? "Resume" : isPlaying ? "Pause" : "Play"}
                >
                  {isPaused ? (
                    <Volume2 className="h-4 w-4" />
                  ) : isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isPaused ? "Resume" : isPlaying ? "Pause" : "Play"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  disabled={!isPlaying && !isPaused}
                  aria-label="Reset"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleMuteToggle}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMuted ? "Unmute" : "Mute"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="ml-2 flex-1">
            <div className="text-xs text-neutral-500 mb-1">Volume</div>
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => setVolume(values[0])}
              aria-label="Volume"
            />
          </div>
        </div>
        
        <div>
          <div className="text-xs text-neutral-500 mb-1">Speed</div>
          <Slider
            value={[speechRate * 50]}
            min={25}
            max={100}
            step={5}
            onValueChange={(values) => setSpeechRate(values[0] / 50)}
            aria-label="Speech Rate"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>Slow</span>
            <span>Normal</span>
            <span>Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
}