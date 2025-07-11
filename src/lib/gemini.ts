import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  private chat: any;

  constructor() {
    this.chat = this.model.startChat({
      history: [
        {
          role: 'user',
          parts: [
            {
              text: `You are a helpful restaurant recommendation assistant. You have access to Reddit reviews and web search results to provide accurate, up-to-date restaurant recommendations. 

Your capabilities include:
- Searching Reddit for restaurant reviews and discussions
- Searching the web for restaurant information, reviews, and recommendations
- Providing detailed recommendations based on cuisine, location, price, and preferences
- Comparing restaurants and explaining differences
- Suggesting specific dishes to order

Always be helpful, accurate, and provide actionable recommendations. When you use tools to search for information, synthesize the results into a comprehensive response.`
            }
          ]
        },
        {
          role: 'model',
          parts: [
            {
              text: 'I understand! I\'m your restaurant recommendation assistant with access to Reddit reviews and web search capabilities. I can help you find the best restaurants, compare options, suggest dishes, and provide detailed recommendations based on your preferences. What would you like to know about restaurants?'
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });
  }

  async sendMessageWithTools(
    userMessage: string,
    redditResults?: string,
    webResults?: string
  ): Promise<string> {
    try {
      let prompt = userMessage;

      if (redditResults && redditResults !== 'No relevant Reddit discussions found for this query.') {
        prompt += `\n\nReddit Search Results:\n${redditResults}`;
      }

      if (webResults && webResults !== 'No relevant web results found for this query.') {
        prompt += `\n\nWeb Search Results:\n${webResults}`;
      }

      const result = await this.chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
  }
} 