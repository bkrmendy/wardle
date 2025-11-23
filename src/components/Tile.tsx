type TileState = 'empty' | 'tbd' | 'correct' | 'present' | 'absent'

interface TileProps {
  letter: string
  state: TileState
  index?: number
}

export function Tile({ letter, state, index = 0 }: TileProps) {
  const stateClasses = {
    empty: 'border-2 border-gray-300 bg-white',
    tbd: 'border-2 border-gray-500 bg-white scale-105',
    correct: 'border-2 border-green-600 bg-green-600 text-white',
    present: 'border-2 border-yellow-500 bg-yellow-500 text-white',
    absent: 'border-2 border-gray-500 bg-gray-500 text-white',
  }

  const animationDelay = index * 0.1

  return (
    <div
      className={`
        flex items-center justify-center
        w-14 h-14 sm:w-16 sm:h-16
        text-2xl sm:text-3xl font-bold uppercase
        transition-all duration-200
        ${stateClasses[state]}
      `}
      style={{
        animationDelay: `${animationDelay}s`,
      }}
    >
      {letter}
    </div>
  )
}
