import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Habit } from '@/types/habit';
import CelebrationEffect from '@/components/CelebrationEffect';

interface HabitFormProps {
  onHabitCreated: (habit: Habit) => void;
  soundEnabled: boolean;
}

const HabitForm = ({ onHabitCreated, soundEnabled }: HabitFormProps) => {
  const [anchor, setAnchor] = useState('');
  const [action, setAction] = useState('');
  const [celebration, setCelebration] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const playWinningSound = () => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create an epic winning fanfare sound
    const createNote = (frequency: number, startTime: number, duration: number, volume: number = 0.1) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + startTime);
      oscillator.type = 'triangle';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + startTime + duration);
      
      oscillator.start(audioContext.currentTime + startTime);
      oscillator.stop(audioContext.currentTime + startTime + duration);
    };
    
    // Play a triumphant melody (C major scale going up)
    const notes = [
      { freq: 523.25, time: 0, duration: 0.3 },     // C5
      { freq: 659.25, time: 0.15, duration: 0.3 },  // E5
      { freq: 783.99, time: 0.3, duration: 0.3 },   // G5
      { freq: 1046.5, time: 0.45, duration: 0.6 },  // C6 (held longer)
    ];
    
    notes.forEach(note => {
      createNote(note.freq, note.time, note.duration, 0.15);
    });
    
    // Add some sparkle with higher notes
    setTimeout(() => {
      createNote(1567.98, 0, 0.2, 0.08); // G6
      createNote(1975.53, 0.1, 0.2, 0.08); // B6
      createNote(2093, 0.2, 0.4, 0.1); // C7
    }, 200);
    
    // Add a bell-like sound for extra celebration
    setTimeout(() => {
      const bell = audioContext.createOscillator();
      const bellGain = audioContext.createGain();
      
      bell.connect(bellGain);
      bellGain.connect(audioContext.destination);
      
      bell.frequency.setValueAtTime(2093, audioContext.currentTime); // C7
      bell.type = 'sine';
      
      bellGain.gain.setValueAtTime(0, audioContext.currentTime);
      bellGain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      bellGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
      
      bell.start();
      bell.stop(audioContext.currentTime + 1);
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!anchor.trim() || !action.trim() || !celebration.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Create the habit
    const newHabit: Habit = {
      anchor: anchor.trim(),
      action: action.trim(),
      celebration: celebration.trim(),
      createdAt: new Date()
    };

    // Show celebration effect and play winning sound
    setShowCelebration(true);
    playWinningSound();

    // Wait for animation to complete
    setTimeout(() => {
      onHabitCreated(newHabit);
      setIsSubmitting(false);
    }, 2000);
  };

  const examples = {
    anchor: [
      "After I pour my morning coffee",
      "After I sit down at my desk",
      "After I brush my teeth",
      "After I get in my car",
      "After I open my laptop"
    ],
    action: [
      "I will do one push-up",
      "I will write one sentence in my journal",
      "I will take three deep breaths",
      "I will drink a glass of water",
      "I will say one thing I'm grateful for"
    ],
    celebration: [
      "I will do a little victory dance",
      "I will say 'I'm awesome!'",
      "I will give myself a high-five",
      "I will smile and say 'Yes!'",
      "I will do a fist pump"
    ]
  };

  const getRandomExample = (type: keyof typeof examples) => {
    const exampleList = examples[type];
    return exampleList[Math.floor(Math.random() * exampleList.length)];
  };

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              Create Your Tiny Habit
            </CardTitle>
            <p className="text-gray-600">
              Follow the Tiny Habits formula: After [Anchor], I will [Action], then I will [Celebrate]
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Anchor */}
              <div className="space-y-3">
                <Label htmlFor="anchor" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  ⚓ Anchor (Existing Routine)
                </Label>
                <Input
                  id="anchor"
                  type="text"
                  placeholder="After I..."
                  value={anchor}
                  onChange={(e) => setAnchor(e.target.value)}
                  className="text-lg p-4 border-2 border-green-200 focus:border-green-400 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setAnchor(getRandomExample('anchor'))}
                  className="text-sm text-emerald-600 hover:text-emerald-700 underline"
                >
                  💡 Get inspiration
                </button>
              </div>

              {/* Action */}
              <div className="space-y-3">
                <Label htmlFor="action" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  🎯 Action (Tiny Behavior)
                </Label>
                <Input
                  id="action"
                  type="text"
                  placeholder="I will..."
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="text-lg p-4 border-2 border-emerald-200 focus:border-emerald-400 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setAction(getRandomExample('action'))}
                  className="text-sm text-emerald-600 hover:text-emerald-700 underline"
                >
                  💡 Get inspiration
                </button>
              </div>

              {/* Celebration */}
              <div className="space-y-3">
                <Label htmlFor="celebration" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  🎉 Celebration (Immediate Reward)
                </Label>
                <Input
                  id="celebration"
                  type="text"
                  placeholder="Then I will..."
                  value={celebration}
                  onChange={(e) => setCelebration(e.target.value)}
                  className="text-lg p-4 border-2 border-teal-200 focus:border-teal-400 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setCelebration(getRandomExample('celebration'))}
                  className="text-sm text-emerald-600 hover:text-emerald-700 underline"
                >
                  💡 Get inspiration
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !anchor.trim() || !action.trim() || !celebration.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating your habit...
                  </span>
                ) : (
                  '🌱 Plant Your Habit'
                )}
              </Button>
            </form>

            {/* Tip */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-400">
              <h4 className="font-semibold text-green-800 mb-2">💡 Tiny Habits Tip:</h4>
              <p className="text-green-700 text-sm">
                Make your action so small that it's impossible to fail. You can always do more, 
                but start with the tiniest version possible.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Celebration Effect */}
      {showCelebration && (
        <CelebrationEffect onComplete={() => setShowCelebration(false)} />
      )}
    </>
  );
};

export default HabitForm;
