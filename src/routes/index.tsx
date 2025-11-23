import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { encodeWord, getRandomWord } from '@/utils/game'
import { WORDS } from '@/data/words'

export const Route = createFileRoute('/')({ component: Index })

function Index() {
  const navigate = useNavigate()

  const playRandomChallenge = () => {
    const randomWord = getRandomWord(WORDS)
    const encodedWord = encodeWord(randomWord)
    navigate({ to: '/challenge/$word', params: { word: encodedWord } })
  }

  const createChallenge = () => {
    navigate({ to: '/create' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome to Wardle!</h2>
            <p className="text-gray-600">
              Challenge your friends or play a random word
            </p>
          </div>

          <button
            onClick={playRandomChallenge}
            className="w-full px-8 py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
          >
            Play Random Word
          </button>

          <button
            onClick={createChallenge}
            className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            Create Challenge
          </button>

          <div className="pt-6 border-t border-gray-300">
            <h3 className="font-bold mb-2">How to play:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Guess the 5-letter word in 6 tries</li>
              <li>• Green = correct letter and position</li>
              <li>• Yellow = correct letter, wrong position</li>
              <li>• Gray = letter not in word</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
