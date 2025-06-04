import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const WelcomeScreen = ({ onGetStarted, soundEnabled, onToggleSound }: WelcomeScreenProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const natureSoundsRef = useRef<{
    wind?: { noise: AudioBufferSourceNode; gainNode: GainNode };
    water?: { noise: AudioBufferSourceNode; gainNode: GainNode };
  }>({});

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      Object.values(natureSoundsRef.current).forEach(sound => {
        if (sound?.noise) {
          try {
            sound.noise.stop();
          } catch (e) {
            console.log('Sound already stopped');
          }
        }
      });
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const createNatureSounds = () => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      // Create realistic bird calls
      const createBirdCall = (type: 'robin' | 'sparrow' | 'cardinal' | 'dove', time: number) => {
        if (!audioContext || audioContext.state === 'closed') return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const currentTime = audioContext.currentTime + time;
        
        // Different bird call patterns
        switch (type) {
          case 'robin': // Cheerful warbling
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1000, currentTime);
            oscillator.frequency.linearRampToValueAtTime(1400, currentTime + 0.15);
            oscillator.frequency.linearRampToValueAtTime(1200, currentTime + 0.3);
            oscillator.frequency.linearRampToValueAtTime(1600, currentTime + 0.45);
            oscillator.frequency.linearRampToValueAtTime(1000, currentTime + 0.6);
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.03, currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.7);
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.7);
            break;
            
          case 'sparrow': // Quick chirps
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(2000, currentTime);
            oscillator.frequency.linearRampToValueAtTime(2200, currentTime + 0.05);
            oscillator.frequency.setValueAtTime(2000, currentTime + 0.1);
            oscillator.frequency.linearRampToValueAtTime(2300, currentTime + 0.15);
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.025, currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.2);
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.2);
            break;
            
          case 'cardinal': // Clear whistle
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1800, currentTime);
            oscillator.frequency.linearRampToValueAtTime(1600, currentTime + 0.4);
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.035, currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.5);
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.5);
            break;
            
          case 'dove': // Gentle cooing
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, currentTime);
            oscillator.frequency.linearRampToValueAtTime(350, currentTime + 0.3);
            oscillator.frequency.linearRampToValueAtTime(400, currentTime + 0.6);
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, currentTime);
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.02, currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.8);
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.8);
            break;
        }
      };
      
      // Create gentle water stream sound
      const createWaterSound = () => {
        if (!audioContext || audioContext.state === 'closed') return null;
        
        const noise = audioContext.createBufferSource();
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 4, audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        // Generate pink noise for water-like sound
        for (let i = 0; i < buffer.length; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.5;
        }
        
        noise.buffer = buffer;
        
        const filter1 = audioContext.createBiquadFilter();
        filter1.type = 'highpass';
        filter1.frequency.setValueAtTime(800, audioContext.currentTime);
        
        const filter2 = audioContext.createBiquadFilter();
        filter2.type = 'lowpass';
        filter2.frequency.setValueAtTime(3000, audioContext.currentTime);
        
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.008, audioContext.currentTime);
        
        noise.connect(filter1);
        filter1.connect(filter2);
        filter2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        noise.loop = true;
        noise.start();
        
        return { noise, gainNode };
      };
      
      // Create enhanced wind sound
      const createWindSound = () => {
        if (!audioContext || audioContext.state === 'closed') return null;
        
        const noise = audioContext.createBufferSource();
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 3, audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(150, audioContext.currentTime);
        
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.015, audioContext.currentTime);
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        noise.loop = true;
        noise.start();
        
        return { noise, gainNode };
      };
      
      // Start ambient sounds
      const wind = createWindSound();
      const water = createWaterSound();
      natureSoundsRef.current = { wind, water };
      
      // Schedule varied bird calls
      const scheduleBirds = () => {
        if (!audioContext || audioContext.state === 'closed') return;
        
        const birdTypes: ('robin' | 'sparrow' | 'cardinal' | 'dove')[] = ['robin', 'sparrow', 'cardinal', 'dove'];
        const randomBird = birdTypes[Math.floor(Math.random() * birdTypes.length)];
        const callTime = Math.random() * 4 + 2; // Random interval between 2-6 seconds
        
        createBirdCall(randomBird, callTime);
        
        // Sometimes add a second bird call shortly after
        if (Math.random() > 0.7) {
          const secondBird = birdTypes[Math.floor(Math.random() * birdTypes.length)];
          createBirdCall(secondBird, callTime + 1 + Math.random() * 2);
        }
        
        setTimeout(scheduleBirds, (callTime + 3) * 1000);
      };
      
      // Resume audio context if needed (for autoplay policy)
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          scheduleBirds();
        });
      } else {
        scheduleBirds();
      }
    } catch (error) {
      console.log('Audio context creation failed:', error);
    }
  };

  useEffect(() => {
    if (soundEnabled) {
      // Add a small delay to respect autoplay policies
      const timer = setTimeout(() => {
        createNatureSounds();
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      // Stop all nature sounds when disabled
      Object.values(natureSoundsRef.current).forEach(sound => {
        if (sound?.noise) {
          try {
            sound.noise.stop();
          } catch (e) {
            console.log('Sound already stopped');
          }
        }
      });
      natureSoundsRef.current = {};
    }
    
    return () => {
      // Cleanup
      Object.values(natureSoundsRef.current).forEach(sound => {
        if (sound?.noise) {
          try {
            sound.noise.stop();
          } catch (e) {
            console.log('Sound already stopped');
          }
        }
      });
    };
  }, [soundEnabled]);

  const handleGetStarted = () => {
    // Fade out nature sounds before transitioning
    Object.values(natureSoundsRef.current).forEach(sound => {
      if (sound?.gainNode && audioContextRef.current) {
        try {
          const currentTime = audioContextRef.current.currentTime;
          sound.gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.8);
        } catch (error) {
          console.log('Error fading sound:', error);
        }
      }
    });
    
    setTimeout(() => {
      Object.values(natureSoundsRef.current).forEach(sound => {
        if (sound?.noise) {
          try {
            sound.noise.stop();
          } catch (e) {
            console.log('Sound already stopped');
          }
        }
      });
      onGetStarted();
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 flex items-center justify-center relative overflow-hidden">
      {/* Hidden audio element for reference */}
      <audio style={{ display: 'none' }} />
      
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
