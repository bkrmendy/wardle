import type { KeyState } from '@/types/game'

interface KeyboardProps {
  onKeyPress: (key: string) => void
  letterStates: Record<string, KeyState>
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
]

export function Keyboard({ onKeyPress, letterStates }: KeyboardProps) {
  const getKeyClass = (key: string) => {
    const state = letterStates[key.toLowerCase()] ?? 'unused'

    const baseClass =
      'px-2 py-4 sm:px-4 rounded font-bold uppercase text-sm sm:text-base transition-colors active:scale-95'

    const stateClasses = {
      correct: 'bg-green-600 text-white',
      present: 'bg-yellow-500 text-white',
      absent: 'bg-gray-500 text-white',
      unused: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    }

    return `${baseClass} ${stateClasses[state]}`
  }

  const getKeyLabel = (key: string) => {
    if (key === 'ENTER') return '⏎'
    if (key === 'BACK') return '⌫'
    return key
  }

  const getKeyWidth = (key: string) => {
    if (key === 'ENTER' || key === 'BACK') return 'flex-[1.5]'
    return 'flex-1'
  }

  return (
    <div className="w-full max-w-lg mx-auto p-2">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 mb-1 justify-center">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`${getKeyClass(key)} ${getKeyWidth(key)}`}
            >
              {getKeyLabel(key)}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
