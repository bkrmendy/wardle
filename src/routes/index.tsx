import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Header } from '@/components/Header'
import { Keyboard } from '@/components/Keyboard'
import { Tile } from '@/components/Tile'
import { encodeChallengeData, isValidWord } from '@/utils/game'
import { WORDS } from '@/data/words'

export const Route = createFileRoute('/')({ component: Index })

function Index() {
  const [currentWord, setCurrentWord] = useState('')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [isMessageFocused, setIsMessageFocused] = useState(false)
  const messageInputRef = useRef<HTMLInputElement>(null)

  const isValid = currentWord.length === 5 && isValidWord(currentWord, WORDS)

  const challengeUrl = isValid
    ? `${window.location.origin}/challenge/${encodeChallengeData(currentWord, message)}`
    : ''

  const addLetter = useCallback(
    (letter: string) => {
      // If message input is focused, add to message; otherwise add to word
      if (isMessageFocused) {
        setMessage((prev) => prev + letter.toLowerCase())
      } else {
        setCurrentWord((prev) => {
          if (prev.length >= 5) return prev
          return prev + letter.toLowerCase()
        })
      }
      setCopied(false)
    },
    [isMessageFocused],
  )

  const deleteLetter = useCallback(() => {
    if (isMessageFocused) {
      setMessage((prev) => prev.slice(0, -1))
    } else {
      setCurrentWord((prev) => prev.slice(0, -1))
    }
    setCopied(false)
  }, [isMessageFocused])

  const handleKeyPress = (key: string) => {
    if (key === 'ENTER') {
      // Do nothing on enter
    } else if (key === 'BACK') {
      deleteLetter()
    } else if (key === 'SPACE') {
      if (isMessageFocused) {
        setMessage((prev) => prev + ' ')
        setCopied(false)
      }
    } else {
      addLetter(key)
    }
  }

  // Handle physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard events when message input is focused
      // (let the input handle its own events naturally)
      if (isMessageFocused) return

      if (e.key === 'Backspace') {
        deleteLetter()
      } else if (/^[a-z]$/i.test(e.key)) {
        addLetter(e.key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [addLetter, deleteLetter, isMessageFocused])

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

            {/* Message input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Optional message when solved:
              </label>
              <div className="flex gap-2">
                <input
                  ref={messageInputRef}
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                    setCopied(false)
                  }}
                  onFocus={() => setIsMessageFocused(true)}
                  onBlur={() => setIsMessageFocused(false)}
                  placeholder="Great job!"
                  maxLength={100}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded focus:border-gray-500 focus:outline-none"
                />
                <button
                  onClick={() => messageInputRef.current?.blur()}
                  className="px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition-colors"
                  title="Done"
                >
                  ✓
                </button>
              </div>
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
        {!isMessageFocused && (
          <div className="pb-4">
            <Keyboard onKeyPress={handleKeyPress} letterStates={{}} />
          </div>
        )}
      </main>
    </div>
  )
}
