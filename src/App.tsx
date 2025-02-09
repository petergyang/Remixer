import { useState } from 'react'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRemix = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/remix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remix content')
      }
      setOutputText(data.remixedText)
    } catch (error: any) {
      console.error('Error:', error)
      setOutputText(`Error: ${error.message || 'An unknown error occurred'}`)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">
          Content Remixer
        </h1>
        
        <div className="space-y-6">
          <textarea
            className="w-full h-48 p-4 rounded border border-gray-300 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     resize-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here..."
          />
          
          <button
            onClick={handleRemix}
            disabled={isLoading || !inputText}
            className="px-4 py-2 bg-blue-500 text-white rounded
                     hover:bg-blue-600 disabled:opacity-50
                     disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Remix Content'}
          </button>
          
          {outputText && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Remixed Output:</h2>
              <div className="p-4 bg-gray-100 rounded">
                {outputText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
