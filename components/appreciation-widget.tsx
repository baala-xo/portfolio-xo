"use client"

import { useState, useEffect } from "react"
import { Heart, Code, Coffee, Zap, Star, Sparkles, ThumbsUp, Brain } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const nerdy_messages = [
  "You're like a perfectly optimized algorithm - efficient and beautiful! 🚀",
  "If you were a function, you'd be pure and side-effect free! ✨",
  "You've got more class than a well-structured OOP program! 🎯",
  "Your appreciation compiles without errors in my heart! 💖",
  "You're the missing semicolon that makes my code complete! 😄",
  "Like a recursive function, my gratitude for you is infinite! ♾️",
  "You've successfully passed all my validation checks! ✅",
  "Your kindness has O(1) complexity - always constant! 📊",
  "You're like clean code - readable, maintainable, and appreciated! 📚",
  "Thanks for not throwing an exception in my day! 🐛"
]

const appreciation_responses = [
  "Aww, you made my console.log('heart') overflow! 💝",
  "Your appreciation just triggered my happy callback! 🎉",
  "You've boosted my confidence by 200%! Level up! ⬆️",
  "My gratitude.push(your_kindness) just executed! 🔄",
  "You're like a perfect code review - constructive and uplifting! 👨‍💻",
  "Your support just resolved all my imposter syndrome bugs! 🐞→✨",
  "Thanks for being the caffeine in my code! ☕",
  "You've unlocked the 'Made My Day' achievement! 🏆"
]

const interaction_icons = [
  { icon: Heart, label: "Appreciate", color: "text-red-500 dark:text-red-400" },
  { icon: Coffee, label: "Virtual Coffee", color: "text-amber-600 dark:text-amber-400" },
  { icon: Zap, label: "Mind Blown", color: "text-purple-500 dark:text-purple-400" }
]

export default function AppreciationWidget() {
  const [currentMessage, setCurrentMessage] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [appreciationCount, setAppreciationCount] = useState(0)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [showSparkles, setShowSparkles] = useState(false)

  const handleAppreciation = (iconLabel: string) => {
    setIsAnimating(true)
    setSelectedIcon(iconLabel)
    setShowSparkles(true)

    const randomMessage = nerdy_messages[Math.floor(Math.random() * nerdy_messages.length)]
    const randomResponse = appreciation_responses[Math.floor(Math.random() * appreciation_responses.length)]

    setCurrentMessage(randomMessage)
    setAppreciationCount(prev => prev + 1)

    // Show response after a delay
    setTimeout(() => {
      setCurrentMessage(randomResponse)
    }, 2000)

    // Reset animations
    setTimeout(() => {
      setIsAnimating(false)
      setSelectedIcon(null)
      setShowSparkles(false)
    }, 4000)

    // Clear message after longer delay
    setTimeout(() => {
      setCurrentMessage("")
    }, 6000)
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500">
      {/* Sparkle Animation Overlay */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <Sparkles
              key={i}
              className={`absolute text-yellow-400 animate-ping`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
              size={16}
            />
          ))}
        </div>
      )}

      <CardContent className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Code className="text-slate-600 dark:text-slate-400" size={24} />
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Mutual Appreciation Protocol
            </h3>
            <Code className="text-slate-600 dark:text-slate-400 scale-x-[-1]" size={24} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            // waddup biaaaaaaaaaaaaaaaatchh.?
          </p>
        </div>

        {/* Appreciation Counter */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-full text-sm font-mono">
            <span className="text-slate-600 dark:text-slate-400">appreciation_count:</span>
            <span className={`font-bold transition-all duration-300 ${isAnimating ? 'scale-125 text-green-500' : 'text-slate-800 dark:text-slate-200'}`}>
              {appreciationCount}
            </span>
          </div>
        </div>

        {/* Interactive Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {interaction_icons.map(({ icon: Icon, label, color }) => (
            <Button
              key={label}
              variant="outline"
              size="sm"
              onClick={() => handleAppreciation(label)}
              className={`relative transition-all duration-300 hover:scale-105 ${selectedIcon === label
                ? 'ring-2 ring-blue-400 dark:ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              disabled={isAnimating}
            >
              <Icon
                className={`mr-2 transition-all duration-300 ${selectedIcon === label ? `${color} animate-bounce` : 'text-slate-600 dark:text-slate-400'
                  }`}
                size={16}
              />
              <span className="text-xs font-medium">{label}</span>
              {selectedIcon === label && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
              )}
            </Button>
          ))}
        </div>

        {/* Message Display */}
        <div className="min-h-[80px] flex items-center justify-center">
          {currentMessage ? (
            <div className={`text-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 transition-all duration-500 ${isAnimating ? 'animate-pulse scale-105' : ''
              }`}>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentMessage}
              </p>
            </div>
          ) : (
            <div className="text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm italic">
                Click any button above to start our appreciation exchange! 🎯
              </p>
              <p className="text-xs mt-1 font-mono">
                // Warning: May cause excessive smiling 😊
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="text-green-600 dark:text-green-400">return</span>{" "}
            <span className="text-blue-600 dark:text-blue-400">"Thanks for being awesome!"</span>
            <span className="text-slate-600 dark:text-slate-400">;</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
