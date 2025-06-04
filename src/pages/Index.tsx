
import React, { useState, useEffect } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import HabitForm from '@/components/HabitForm';
import HabitDisplay from '@/components/HabitDisplay';
import SoundManager from '@/components/SoundManager';
import { Habit } from '@/types/habit';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentHabit, setCurrentHabit] = useState<Habit | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Load sound preference from localStorage
    const savedSoundPreference = localStorage.getItem('habitsprout-sound-enabled');
    if (savedSoundPreference !== null) {
      setSoundEnabled(JSON.parse(savedSoundPreference));
    }
  }, []);

  useEffect(() => {
    // Save sound preference to localStorage
    localStorage.setItem('habitsprout-sound-enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  const handleHabitCreated = (habit: Habit) => {
    setCurrentHabit(habit);
    console.log('New habit created:', habit);
  };

  const handleCreateAnother = () => {
    setCurrentHabit(null);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  if (showWelcome) {
    return (
      <WelcomeScreen 
        onGetStarted={handleGetStarted}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <SoundManager soundEnabled={soundEnabled} onToggleSound={toggleSound} />
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            🌱 HabitSprout
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start small. Celebrate immediately. Build lasting habits.
          </p>
        </header>

        {!currentHabit ? (
          <HabitForm 
            onHabitCreated={handleHabitCreated}
            soundEnabled={soundEnabled}
          />
        ) : (
          <HabitDisplay 
            habit={currentHabit}
            onCreateAnother={handleCreateAnother}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
