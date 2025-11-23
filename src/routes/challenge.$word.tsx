import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Header } from '@/components/Header'
import { Board } from '@/components/Board'
import { Keyboard } from '@/components/Keyboard'
import { useGameState } from '@/hooks/useGameState'
import { decodeWord, isValidWord } from '@/utils/game'
import { WORDS } from '@/data/words'

function Challenge() {
  const { word } = Route.useParams()
  const navigate = useNavigate()

  const decodedWord = decodeWord(word)

  // Validate the word
  useEffect(() => {
    if (!decodedWord || !isValidWord(decodedWord, WORDS)) {
      alert('Invalid challenge word!')
      navigate({ to: '/' })
    }
  }, [decodedWord, navigate])

  const {
    guesses,
    currentGuess,
    currentRow,
    gameStatus,
    letterStates,
    error,
    shake,
    addLetter,
    deleteLetter,
    submitGuess,
  } = useGameState({
    answer: decodedWord,
    wordList: WORDS,
  })

  // Handle physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return

      if (e.key === 'Enter') {
        submitGuess()
      } else if (e.key === 'Backspace') {
        deleteLetter()
      } else if (/^[a-z]$/i.test(e.key)) {
        addLetter(e.key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStatus, addLetter, deleteLetter, submitGuess])

  // Handle virtual keyboard
  const handleKeyPress = (key: string) => {
    if (key === 'ENTER') {
      submitGuess()
    } else if (key === 'BACK') {
      deleteLetter()
    } else {
      addLetter(key)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-between max-w-lg mx-auto w-full px-4 pb-4">
        <Board
          guesses={guesses}
          currentGuess={currentGuess}
          currentRow={currentRow}
          shake={shake}
        />

        {error && (
          <div className="text-red-600 font-semibold text-center py-2">
            {error}
          </div>
        )}

        {gameStatus === 'won' && (
          <div className="text-center py-4">
            <p className="text-2xl font-bold text-green-600 mb-2">
              You won! 🎉
            </p>
            <button
              onClick={() => navigate({ to: '/' })}
              className="px-6 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700"
            >
              Back to Home
            </button>
          </div>
        )}

        {gameStatus === 'lost' && (
          <div className="text-center py-4">
            <p className="text-2xl font-bold text-red-600 mb-2">Game Over!</p>
            <p className="text-lg mb-3">
              The word was: <strong>{decodedWord.toUpperCase()}</strong>
            </p>
            <button
              onClick={() => navigate({ to: '/' })}
              className="px-6 py-2 bg-gray-600 text-white rounded font-semibold hover:bg-gray-700"
            >
              Back to Home
            </button>
          </div>
        )}

        <Keyboard onKeyPress={handleKeyPress} letterStates={letterStates} />
      </main>
    </div>
  )
}

export const Route = createFileRoute('/challenge/$word')({
  component: Challenge,
})
