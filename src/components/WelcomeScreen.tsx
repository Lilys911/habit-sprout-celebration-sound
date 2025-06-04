
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
    // Play nature sounds after a slight delay to respect autoplay policies
    const timer = setTimeout(() => {
      if (audioRef.current && soundEnabled) {
        audioRef.current.volume = 0.2;
        audioRef.current.play().catch(console.log);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [soundEnabled]);

  const createNatureSounds = () => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create gentle forest ambience with birds and wind
    const createBirdChirp = (frequency: number, time: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + time);
      oscillator.frequency.linearRampToValueAtTime(frequency * 1.2, audioContext.currentTime + time + 0.1);
      oscillator.frequency.linearRampToValueAtTime(frequency, audioContext.currentTime + time + 0.3);
      
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + time);
      gainNode.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + time + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + time + 0.4);
      
      oscillator.start(audioContext.currentTime + time);
      oscillator.stop(audioContext.currentTime + time + 0.4);
    };
    
    // Create wind sound
    const createWindSound = () => {
      const noise = audioContext.createBufferSource();
      const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
      const output = buffer.getChannelData(0);
      
      for (let i = 0; i < buffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      noise.buffer = buffer;
      
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, audioContext.currentTime);
      
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
      
      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      noise.loop = true;
      noise.start();
      
      return { noise, gainNode };
    };
    
    // Start wind sound
    const wind = createWindSound();
    
    // Schedule bird chirps
    const scheduleBirds = () => {
      const birdFrequencies = [800, 1200, 1600, 2000];
      const chirpTime = Math.random() * 3 + 1; // Random interval between 1-4 seconds
      const frequency = birdFrequencies[Math.floor(Math.random() * birdFrequencies.length)];
      
      createBirdChirp(frequency, chirpTime);
      
      setTimeout(scheduleBirds, (chirpTime + 2) * 1000);
    };
    
    scheduleBirds();
    
    // Store for cleanup
    if (audioRef.current) {
      (audioRef.current as any).windSound = wind;
    }
  };

  useEffect(() => {
    if (soundEnabled) {
      createNatureSounds();
    }
    
    return () => {
      // Cleanup
      if (audioRef.current && (audioRef.current as any).windSound) {
        const wind = (audioRef.current as any).windSound;
        if (wind.noise) wind.noise.stop();
      }
    };
  }, [soundEnabled]);

  const handleGetStarted = () => {
    // Stop nature sounds before transitioning
    if (audioRef.current && (audioRef.current as any).windSound) {
      const wind = (audioRef.current as any).windSound;
      if (wind.gainNode) {
        wind.gainNode.gain.exponentialRampToValueAtTime(0.001, audioRef.current.context?.currentTime + 0.5);
      }
      setTimeout(() => {
        if (wind.noise) wind.noise.stop();
      }, 600);
    }
    
    setTimeout(onGetStarted, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 flex items-center justify-center relative overflow-hidden">
      {/* Hidden audio element for reference */}
      <audio ref={audioRef} style={{ display: 'none' }} />
      
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
