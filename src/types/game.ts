/**
 * Represents the state of a letter in a Wordle guess
 * - 'correct': Letter is in the correct position (green)
 * - 'present': Letter is in the word but wrong position (yellow)
 * - 'absent': Letter is not in the word (gray)
 */
export type LetterState = 'correct' | 'present' | 'absent'

/**
 * Represents the state of a key on the virtual keyboard
 * Extends LetterState with an 'unused' state for keys that haven't been pressed
 */
export type KeyState = LetterState | 'unused'
