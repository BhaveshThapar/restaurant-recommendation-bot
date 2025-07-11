'use client';

interface SuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export default function Suggestions({ onSuggestionClick }: SuggestionsProps) {
  const suggestions = [
    "Where is the best place to get mediterranean food in flatiron?",
    "What should I order at four charles?",
    "What is the difference between thai villa and soothr?",
    "Is per se an expensive restaurant?",
    "Best Italian restaurants in Manhattan",
    "What are the most popular dishes at Eleven Madison Park?"
  ];

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Try asking about:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm text-gray-700"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
} 