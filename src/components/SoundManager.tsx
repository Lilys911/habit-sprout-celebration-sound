
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundManagerProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const SoundManager = ({ soundEnabled, onToggleSound }: SoundManagerProps) => {
  return (
    <div className="fixed top-6 right-6 z-40">
      <button
        onClick={onToggleSound}
        className="p-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
        aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
        title={soundEnabled ? "Mute sound" : "Enable sound"}
      >
        {soundEnabled ? (
          <Volume2 className="w-5 h-5 text-emerald-600" />
        ) : (
          <VolumeX className="w-5 h-5 text-gray-400" />
        )}
      </button>
    </div>
  );
};

export default SoundManager;
