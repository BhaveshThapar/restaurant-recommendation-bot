'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Suggestions from '@/components/Suggestions';
import type { ChatInterfaceRef } from '@/components/ChatInterface';

const ChatInterface = dynamic(() => import('@/components/ChatInterface'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-lg">
        <h1 className="text-2xl font-bold mb-2">Restaurant Recommendation Bot</h1>
        <p className="text-blue-50">
          Ask me about restaurants, cuisines, dishes, and more! I&apos;ll search Reddit and the web to give you the best recommendations.
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
      <div className="p-4 border-t bg-white">
        <input
          type="text"
          disabled
          placeholder="Loading..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
        />
      </div>
    </div>
  )
});

export default function Home() {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const chatInterfaceRef = useRef<ChatInterfaceRef | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    if (chatInterfaceRef.current && isClient) {
      chatInterfaceRef.current.sendMessage(suggestion);
    }
    setShowSuggestions(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto min-h-screen flex flex-col">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Restaurant Recommendation Bot
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Your AI-powered restaurant assistant. Get personalized recommendations, 
            compare restaurants, and discover the best dishes using Reddit reviews and web search.
          </p>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 h-full">
            {isClient && <ChatInterface ref={chatInterfaceRef} />}
          </div>

          {showSuggestions && isClient && (
            <div className="lg:w-80">
              <Suggestions onSuggestionClick={handleSuggestionClick} />
            </div>
          )}
        </div>

        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>
            Powered by Gemini AI • Reddit Search • Web Search
          </p>
          <p className="mt-1">
            Ask me about restaurants, cuisines, dishes, and more!
          </p>
        </div>
      </div>
    </main>
  );
}
