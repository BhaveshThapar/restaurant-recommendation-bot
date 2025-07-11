'use client';

import { useState } from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  sources?: {
    reddit?: string;
    web?: string;
  };
}

export default function ChatMessage({ role, content, sources }: ChatMessageProps) {
  const [showSources, setShowSources] = useState(false);

  const hasSources = sources && (sources.reddit || sources.web);

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <div 
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{
            __html: content
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
          }}
        />
        
        {hasSources && (
          <div className="mt-2">
            <button
              onClick={() => setShowSources(!showSources)}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              {showSources ? 'Hide Sources' : 'Show Sources'}
            </button>
            
            {showSources && (
              <div className="mt-2 text-xs text-gray-600">
                {sources.reddit && (
                  <div className="mb-2">
                    <strong>Reddit Results:</strong>
                    <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
                      {sources.reddit}
                    </div>
                  </div>
                )}
                
                {sources.web && (
                  <div>
                    <strong>Web Search Results:</strong>
                    <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
                      {sources.web}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 