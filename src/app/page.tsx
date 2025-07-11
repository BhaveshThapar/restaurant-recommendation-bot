'use client';

import { useState, useRef } from 'react';
import ChatInterface, { ChatInterfaceRef } from '@/components/ChatInterface';
import Suggestions from '@/components/Suggestions';

export default function Home() {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatInterfaceRef = useRef<ChatInterfaceRef>(null);

  const handleSuggestionClick = (suggestion: string) => {
    if (chatInterfaceRef.current) {
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
            <ChatInterface ref={chatInterfaceRef} />
          </div>

          {showSuggestions && (
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
