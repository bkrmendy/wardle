import { useState, useCallback } from 'react'
import { checkGuess, isValidWord, getLetterStates } from '@/utils/game'

type LetterState = 'correct' | 'present' | 'absent'
type GameStatus = 'playing' | 'won' | 'lost'

interface GuessResult {
  guess: string
  states: LetterState[]
}

interface UseGameStateProps {
  answer: string
  wordList: string[]
}

export function useGameState({ answer, wordList }: UseGameStateProps) {
  const [guesses, setGuesses] = useState<GuessResult[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
  const [error, setError] = useState<string>('')
  const [shake, setShake] = useState(false)

  const currentRow = guesses.length

  const letterStates = getLetterStates(guesses)

  const addLetter = useCallback(
    (letter: string) => {
      if (gameStatus !== 'playing') return
      if (currentGuess.length >= 5) return

      setCurrentGuess((prev) => prev + letter.toLowerCase())
      setError('')
    },
    [currentGuess, gameStatus],
  )

  const deleteLetter = useCallback(() => {
    if (gameStatus !== 'playing') return

    setCurrentGuess((prev) => prev.slice(0, -1))
    setError('')
  }, [gameStatus])

  const submitGuess = useCallback(() => {
    if (gameStatus !== 'playing') return
    if (currentGuess.length !== 5) {
      setError('Not enough letters')
      setShake(true)
      setTimeout(() => setShake(false), 600)
      return
    }

    if (!isValidWord(currentGuess, wordList)) {
      setError('Not in word list')
      setShake(true)
      setTimeout(() => setShake(false), 600)
      return
    }

    const states = checkGuess(currentGuess, answer)
    const newGuess: GuessResult = {
      guess: currentGuess,
      states,
    }

    setGuesses((prev) => [...prev, newGuess])
    setCurrentGuess('')
    setError('')

    // Check win condition
    if (currentGuess.toLowerCase() === answer.toLowerCase()) {
      setGameStatus('won')
      return
    }

    // Check lose condition
    if (guesses.length + 1 >= 6) {
      setGameStatus('lost')
    }
  }, [currentGuess, guesses.length, answer, wordList, gameStatus])

  return {
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
  }
}
