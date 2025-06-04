
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const WelcomeScreen = ({ onGetStarted, soundEnabled, onToggleSound }: WelcomeScreenProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Play ambient sound after a slight delay to respect autoplay policies
    const timer = setTimeout(() => {
      if (audioRef.current && soundEnabled) {
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(console.log);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [soundEnabled]);

  const handleGetStarted = () => {
    // Fade out audio before transitioning
    if (audioRef.current) {
      const fadeOut = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.05) {
          audioRef.current.volume -= 0.05;
        } else {
          clearInterval(fadeOut);
          if (audioRef.current) {
            audioRef.current.pause();
          }
        }
      }, 50);
    }
    
    setTimeout(onGetStarted, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 flex items-center justify-center relative overflow-hidden">
      {/* Ambient Audio */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUYrTp66hVFApGn+DyvmEcBjiS2e/VfSUFl2+z7d6HNwgYZrjk5Z9NEQxPqdrws2MdCEOWp+vy0g=="
      />
      
      {/* Floating Elements Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-green-300 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-emerald-400 rounded-full animate-pulse opacity-40 animation-delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-teal-300 rounded-full animate-pulse opacity-50 animation-delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-60 animation-delay-3000"></div>
      </div>

      {/* Sound Toggle */}
      <button
        onClick={onToggleSound}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl"
        aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
      >
        {soundEnabled ? (
          <Volume2 className="w-5 h-5 text-emerald-600" />
        ) : (
          <VolumeX className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Main Content */}
      <div className="text-center px-6 max-w-4xl mx-auto animate-fade-in">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="text-8xl animate-pulse">🌱</div>
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce animation-delay-1000">✨</div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          HabitSprout
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-light">
          Start small. Celebrate immediately.
        </p>
        <p className="text-xl md:text-2xl text-emerald-600 mb-12 font-medium">
          Build lasting habits.
        </p>

        {/* Inspirational Quote */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-lg">
          <blockquote className="text-lg md:text-xl text-gray-700 italic mb-4">
            "The secret to changing your life is to start with the smallest possible step. 
            When you feel successful, you'll naturally want to do more."
          </blockquote>
          <cite className="text-emerald-600 font-medium">— BJ Fogg, Tiny Habits</cite>
        </div>

        {/* Get Started Button */}
        <Button
          onClick={handleGetStarted}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-8 rounded-full text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          🌟 Get Started
        </Button>

        {/* Small hint text */}
        <p className="text-gray-500 mt-6 text-sm">
          Create your first tiny habit in under 2 minutes
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
