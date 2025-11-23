import { Tile } from './Tile'

type LetterState = 'correct' | 'present' | 'absent'

interface GuessResult {
  guess: string
  states: LetterState[]
}

interface BoardProps {
  guesses: GuessResult[]
  currentGuess: string
  currentRow: number
  shake?: boolean
}

export function Board({ guesses, currentGuess, currentRow, shake = false }: BoardProps) {
  const rows = Array.from({ length: 6 }, (_, rowIndex) => {
    // If this is a completed guess row
    if (rowIndex < guesses.length) {
      const { guess, states } = guesses[rowIndex]
      return Array.from({ length: 5 }, (_, colIndex) => ({
        letter: guess[colIndex] || '',
        state: states[colIndex] as 'correct' | 'present' | 'absent',
      }))
    }

    // If this is the current row being typed
    if (rowIndex === currentRow) {
      return Array.from({ length: 5 }, (_, colIndex) => ({
        letter: currentGuess[colIndex] || '',
        state: currentGuess[colIndex] ? ('tbd' as const) : ('empty' as const),
      }))
    }

    // Empty row
    return Array.from({ length: 5 }, () => ({
      letter: '',
      state: 'empty' as const,
    }))
  })

  return (
    <div className="flex flex-col gap-1.5 p-4">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex gap-1.5 justify-center ${
            rowIndex === currentRow && shake ? 'animate-shake' : ''
          }`}
          style={{
            animation:
              rowIndex === currentRow && shake
                ? 'shake 0.5s ease-in-out'
                : undefined,
          }}
        >
          {row.map((tile, colIndex) => (
            <Tile
              key={colIndex}
              letter={tile.letter}
              state={tile.state}
              index={colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
