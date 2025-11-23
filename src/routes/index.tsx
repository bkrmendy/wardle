import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/Header'
import { Keyboard } from '@/components/Keyboard'
import { Tile } from '@/components/Tile'
import { encodeWord, isValidWord } from '@/utils/game'
import { WORDS } from '@/data/words'

export const Route = createFileRoute('/')({ component: Index })

function Index() {
  const [currentWord, setCurrentWord] = useState('')
  const [copied, setCopied] = useState(false)

  const isValid = currentWord.length === 5 && isValidWord(currentWord, WORDS)

  const challengeUrl = isValid
    ? `${window.location.origin}/challenge/${encodeWord(currentWord)}`
    : ''

  const addLetter = useCallback((letter: string) => {
    setCurrentWord((prev) => {
      if (prev.length >= 5) return prev
      return prev + letter.toLowerCase()
    })
    setCopied(false)
  }, [])

  const deleteLetter = useCallback(() => {
    setCurrentWord((prev) => prev.slice(0, -1))
    setCopied(false)
  }, [])

  const handleKeyPress = (key: string) => {
    if (key === 'ENTER') {
      // Do nothing on enter
    } else if (key === 'BACK') {
      deleteLetter()
    } else {
      addLetter(key)
    }
  }

  // Handle physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        deleteLetter()
      } else if (/^[a-z]$/i.test(e.key)) {
        addLetter(e.key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [addLetter, deleteLetter])

  const handleCopy = async () => {
    if (challengeUrl) {
      await navigator.clipboard.writeText(challengeUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4">
        {/* Centered content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full space-y-8">
            <h2 className="text-2xl font-bold text-center">
              Create a Challenge
            </h2>

            {/* Word display */}
            <div className="flex gap-1.5 justify-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Tile
                  key={i}
                  letter={currentWord[i] || ''}
                  state={currentWord[i] ? 'tbd' : 'empty'}
                  index={i}
                />
              ))}
            </div>

            {/* Validation message */}
            <div className="text-center h-6">
              {currentWord.length === 5 && !isValid && (
                <p className="text-red-600 font-semibold">Not in word list</p>
              )}
              {isValid && (
                <p className="text-green-600 font-semibold">Valid word!</p>
              )}
            </div>

            {/* Copy challenge URL */}
            <div className="flex gap-2">
              <input
                type="text"
                value={challengeUrl}
                readOnly
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopy}
                disabled={!isValid}
                className={`px-6 py-2 rounded font-semibold whitespace-nowrap transition-colors ${
                  isValid
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard at bottom */}
        <div className="pb-4">
          <Keyboard onKeyPress={handleKeyPress} letterStates={{}} />
        </div>
      </main>
    </div>
  )
}
