
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Habit } from '@/types/habit';

interface HabitDisplayProps {
  habit: Habit;
  onCreateAnother: () => void;
}

const HabitDisplay = ({ habit, onCreateAnother }: HabitDisplayProps) => {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Card className="shadow-2xl bg-white/90 backdrop-blur-sm border-0 overflow-hidden">
        {/* Celebration Header */}
        <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 p-6 text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Congratulations!
          </h2>
          <p className="text-green-100 text-lg">
            Your tiny habit is ready to sprout! 🌱
          </p>
        </div>

        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Your New Habit Formula
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8 p-8">
          {/* Habit Formula Display */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200">
            <div className="space-y-6">
              {/* Anchor */}
              <div className="flex items-start gap-4">
                <div className="text-3xl">⚓</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-800 text-lg mb-1">Anchor</h3>
                  <p className="text-xl text-gray-700">{habit.anchor}</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-center text-3xl text-emerald-500">↓</div>

              {/* Action */}
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎯</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-emerald-800 text-lg mb-1">Tiny Action</h3>
                  <p className="text-xl text-gray-700">{habit.action}</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-center text-3xl text-teal-500">↓</div>

              {/* Celebration */}
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎉</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-teal-800 text-lg mb-1">Immediate Celebration</h3>
                  <p className="text-xl text-gray-700">{habit.celebration}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Complete Formula */}
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">Your Complete Habit:</h3>
            <p className="text-lg text-center text-gray-700 leading-relaxed">
              <span className="font-semibold text-green-600">{habit.anchor}</span>
              {", "}
              <span className="font-semibold text-emerald-600">{habit.action}</span>
              {", then "}
              <span className="font-semibold text-teal-600">{habit.celebration}</span>
            </p>
          </div>

          {/* Success Tips */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-l-4 border-yellow-400">
            <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
              ⭐ Keys to Success:
            </h4>
            <ul className="text-yellow-700 space-y-2 text-sm">
              <li>• <strong>Start tiny:</strong> Do the smallest version possible</li>
              <li>• <strong>Celebrate immediately:</strong> Feel good about your success right away</li>
              <li>• <strong>Be consistent:</strong> Do it every time you encounter your anchor</li>
              <li>• <strong>Grow naturally:</strong> Let the habit expand on its own</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={onCreateAnother}
              variant="outline"
              className="flex-1 py-3 text-lg border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl"
            >
              🌱 Create Another Habit
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 text-lg rounded-xl"
            >
              🏠 Start Over
            </Button>
          </div>

          {/* Footer Message */}
          <div className="text-center pt-4">
            <p className="text-gray-600 italic">
              "Success is the sum of small efforts repeated day in and day out." ✨
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitDisplay;
