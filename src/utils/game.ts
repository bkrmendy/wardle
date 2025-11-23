import type { LetterState } from '@/types/game'

/**
 * Check a guess against the answer and return the state of each letter
 */
export function checkGuess(guess: string, answer: string): LetterState[] {
  const guessLower = guess.toLowerCase()
  const answerLower = answer.toLowerCase()
  const result: LetterState[] = Array(5).fill('absent')
  const answerLetters = answerLower.split('')

  // First pass: mark correct letters
  for (let i = 0; i < 5; i++) {
    if (guessLower[i] === answerLower[i]) {
      result[i] = 'correct'
      answerLetters[i] = '' // Mark as used
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue

    const letterIndex = answerLetters.indexOf(guessLower[i])
    if (letterIndex !== -1) {
      result[i] = 'present'
      answerLetters[letterIndex] = '' // Mark as used
    }
  }

  return result
}

/**
 * Check if a word exists in the word list
 */
export function isValidWord(word: string, wordList: string[]): boolean {
  return wordList.includes(word.toLowerCase())
}

/**
 * Encode a word to base64 for URL sharing
 */
export function encodeWord(word: string): string {
  return btoa(word.toLowerCase())
}

/**
 * Decode a base64 encoded word from URL
 */
export function decodeWord(encoded: string): string {
  try {
    return atob(encoded)
  } catch {
    return ''
  }
}

/**
 * Get the state of each letter on the keyboard based on all guesses
 */
export function getLetterStates(
  guesses: Array<{ guess: string; states: LetterState[] }>,
): Record<string, LetterState> {
  const letterStates: Record<string, LetterState> = {}

  guesses.forEach(({ guess, states }) => {
    guess.split('').forEach((letter, i) => {
      const letterLower = letter.toLowerCase()
      const currentState = letterStates[letterLower]
      const newState = states[i]

      // Priority: correct > present > absent
      if (
        !currentState ||
        (newState === 'correct' ||
          (newState === 'present' && currentState !== 'correct'))
      ) {
        letterStates[letterLower] = newState
      }
    })
  })

  return letterStates
}

/**
 * Get a random word from the word list
 */
export function getRandomWord(wordList: string[]): string {
  return wordList[Math.floor(Math.random() * wordList.length)]
}

/**
 * Encode challenge data (word + optional message) to base64 for URL sharing
 */
export function encodeChallengeData(
  word: string,
  message?: string,
): string {
  const data = { word: word.toLowerCase(), message: message || '' }
  return btoa(JSON.stringify(data))
}

/**
 * Decode challenge data from base64 URL parameter
 * Returns { word, message } or falls back to treating input as plain word
 */
export function decodeChallengeData(encoded: string): {
  word: string
  message: string
} {
  try {
    const decoded = atob(encoded)
    // Try to parse as JSON first (new format)
    try {
      const data = JSON.parse(decoded)
      return {
        word: data.word || '',
        message: data.message || '',
      }
    } catch {
      // Fall back to treating as plain word (old format)
      return {
        word: decoded,
        message: '',
      }
    }
  } catch {
    return {
      word: '',
      message: '',
    }
  }
}
