
import React, { useEffect, useState } from 'react';

interface CelebrationEffectProps {
  onComplete: () => void;
}

const CelebrationEffect = ({ onComplete }: CelebrationEffectProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string; delay: number }>>([]);

  useEffect(() => {
    // Create celebration particles
    const celebrationEmojis = ['🎉', '✨', '🌟', '💫', '🎊', '🌱', '🌿', '🍃'];
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      emoji: celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)],
      delay: Math.random() * 1000
    }));
    
    setParticles(newParticles);

    // Complete animation after 2 seconds
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Celebration Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 animate-pulse" />
      
      {/* Center Burst */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-8xl animate-bounce">🎉</div>
      </div>

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-4xl animate-ping"
          style={{
            left: particle.x,
            top: particle.y,
            animationDelay: `${particle.delay}ms`,
            animationDuration: '1.5s'
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Success Message */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-2xl mt-32 animate-scale-in">
          <h3 className="text-2xl font-bold text-green-600 text-center">
            🌱 Habit Created Successfully! 🌱
          </h3>
        </div>
      </div>
    </div>
  );
};

export default CelebrationEffect;
