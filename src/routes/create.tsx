import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Header } from '@/components/Header'
import { encodeWord } from '@/utils/game'
import { WORDS } from '@/data/words'

function CreateChallenge() {
  const [selectedWord, setSelectedWord] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [copied, setCopied] = useState(false)

  const filteredWords = searchTerm
    ? WORDS.filter((word) => word.toLowerCase().startsWith(searchTerm.toLowerCase())).slice(0, 50)
    : []

  const challengeUrl = selectedWord
    ? `${window.location.origin}/challenge/${encodeWord(selectedWord)}`
    : ''

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

      <main className="flex-1 flex flex-col items-center px-4 py-8 max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-6">Create a Challenge</h2>

        <div className="w-full mb-6">
          <label className="block text-sm font-semibold mb-2">
            Search for a word:
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search..."
            className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-gray-500 focus:outline-none"
            maxLength={5}
          />

          {filteredWords.length > 0 && (
            <div className="mt-2 border border-gray-300 rounded max-h-60 overflow-y-auto">
              {filteredWords.map((word) => (
                <button
                  key={word}
                  onClick={() => {
                    setSelectedWord(word)
                    setSearchTerm('')
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 uppercase"
                >
                  {word}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedWord && (
          <div className="w-full space-y-4">
            <div className="p-4 bg-green-50 border border-green-300 rounded">
              <p className="text-sm font-semibold mb-1">Selected word:</p>
              <p className="text-2xl font-bold uppercase">{selectedWord}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">
                Share this link:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={challengeUrl}
                  readOnly
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded bg-gray-50 text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 whitespace-nowrap"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedWord('')}
              className="w-full px-6 py-2 bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300"
            >
              Choose Different Word
            </button>
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/"
            className="text-blue-600 hover:underline font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}

export const Route = createFileRoute('/create')({
  component: CreateChallenge,
})
