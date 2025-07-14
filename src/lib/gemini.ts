import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ToolResult {
  tool: string;
  result: string;
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

  async sendMessage(message: string, toolResults?: ToolResult[]): Promise<string> {
    try {
      let fullMessage = message;
      
      if (toolResults && toolResults.length > 0) {
        fullMessage += '\n\nHere are the results from my search tools:\n';
        toolResults.forEach(result => {
          fullMessage += `\n--- ${result.tool.toUpperCase()} RESULTS ---\n${result.result}\n`;
        });
        fullMessage += '\nPlease provide a comprehensive response based on this information.';
      }

      const result = await this.chat.sendMessage(fullMessage);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
  }

  async sendMessageWithTools(message: string, redditResults?: string, webResults?: string): Promise<string> {
    const toolResults: ToolResult[] = [];
    
    if (redditResults) {
      toolResults.push({ tool: 'Reddit', result: redditResults });
    }
    
    if (webResults) {
      toolResults.push({ tool: 'Web Search', result: webResults });
    }

    return this.sendMessage(message, toolResults);
  }
} 