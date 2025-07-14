import { GeminiService } from './gemini';
import { RedditService } from './reddit';
import { WebSearchService } from './webSearch';

export interface ChatResponse {
  message: string;
  sources: {
    reddit?: string;
    web?: string;
  };
}

export class RestaurantChatbot {
  private geminiService: GeminiService;
  private redditService: RedditService;
  private webSearchService: WebSearchService;

  constructor() {
    this.geminiService = new GeminiService();
    this.redditService = new RedditService();
    this.webSearchService = new WebSearchService();
  }

  async processMessage(userMessage: string): Promise<ChatResponse> {
    try {
      const searchStrategy = this.analyzeQuery(userMessage);
      
      let redditResults: string | undefined;
      let webResults: string | undefined;

      if (searchStrategy.shouldSearchReddit) {
        redditResults = await this.redditService.searchReddit(searchStrategy.redditQuery || userMessage);
        
        if (redditResults && redditResults.includes('No relevant Reddit discussions found')) {
          redditResults = undefined;
        }
      }

      if (searchStrategy.shouldSearchWeb) {
        webResults = await this.webSearchService.searchWeb(searchStrategy.webQuery || userMessage);
      }

      const response = await this.geminiService.sendMessageWithTools(
        userMessage,
        redditResults,
        webResults
      );

      return {
        message: response,
        sources: {
          reddit: redditResults,
          web: webResults
        }
      };
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        message: 'I apologize, but I encountered an error processing your request. Please try again.',
        sources: {}
      };
    }
  }

  private analyzeQuery(message: string): {
    shouldSearchReddit: boolean;
    shouldSearchWeb: boolean;
    redditQuery?: string;
    webQuery?: string;
  } {
    const lowerMessage = message.toLowerCase();
    
    let shouldSearchReddit = true;
    let shouldSearchWeb = true;
    let redditQuery = message;
    let webQuery = message;

    if (this.containsRestaurantName(lowerMessage)) {
      const restaurantName = this.extractRestaurantName(message);
      redditQuery = `${restaurantName} restaurant review`;
      webQuery = `${restaurantName} restaurant reviews menu`;
    }
    
    else if (this.isCuisineQuery(lowerMessage)) {
      const cuisine = this.extractCuisine(lowerMessage);
      const location = this.extractLocation(lowerMessage);
      
      if (location) {
        redditQuery = `best ${cuisine} restaurant ${location}`;
        webQuery = `best ${cuisine} restaurants ${location} NYC reviews recommendations 2024`;
      } else {
        redditQuery = `best ${cuisine} restaurant`;
        webQuery = `best ${cuisine} restaurants NYC reviews recommendations 2024`;
      }
    }
    
    else if (this.isComparisonQuery(lowerMessage)) {
      const restaurants = this.extractRestaurantsForComparison(message);
      if (restaurants.length >= 2) {
        redditQuery = `${restaurants[0]} vs ${restaurants[1]} restaurant`;
        webQuery = `${restaurants[0]} vs ${restaurants[1]} restaurant comparison`;
      }
    }
    
    else if (this.isDishQuery(lowerMessage)) {
      const restaurantName = this.extractRestaurantName(message);
      if (restaurantName) {
        redditQuery = `${restaurantName} best dishes what to order`;
        webQuery = `${restaurantName} best dishes menu recommendations`;
      }
    }

    return {
      shouldSearchReddit,
      shouldSearchWeb,
      redditQuery,
      webQuery
    };
  }

  private containsRestaurantName(message: string): boolean {
    const restaurantKeywords = ['restaurant', 'cafe', 'bistro', 'diner', 'eatery', 'grill', 'kitchen'];
    return restaurantKeywords.some(keyword => message.includes(keyword));
  }

  private extractRestaurantName(message: string): string {
    const words = message.split(' ');
    const potentialNames = words.filter(word => 
      word.length > 2 && 
      word[0] === word[0].toUpperCase() && 
      !['The', 'And', 'Or', 'But', 'In', 'On', 'At', 'To', 'For', 'Of', 'With'].includes(word)
    );
    
    return potentialNames.join(' ') || message;
  }

  private isCuisineQuery(message: string): boolean {
    const cuisines = [
      'italian', 'chinese', 'japanese', 'thai', 'indian', 'mexican', 'french', 'greek',
      'mediterranean', 'american', 'korean', 'vietnamese', 'spanish', 'lebanese', 'turkish',
      'ethiopian', 'moroccan', 'brazilian', 'peruvian', 'caribbean'
    ];
    
    return cuisines.some(cuisine => message.includes(cuisine));
  }

  private extractCuisine(message: string): string {
    const cuisines = [
      'italian', 'chinese', 'japanese', 'thai', 'indian', 'mexican', 'french', 'greek',
      'mediterranean', 'american', 'korean', 'vietnamese', 'spanish', 'lebanese', 'turkish',
      'ethiopian', 'moroccan', 'brazilian', 'peruvian', 'caribbean'
    ];
    
    for (const cuisine of cuisines) {
      if (message.includes(cuisine)) {
        return cuisine;
      }
    }
    
    return 'restaurant';
  }

  private extractLocation(message: string): string | null {
    const locations = [
      'flatiron', 'manhattan', 'brooklyn', 'queens', 'bronx', 'staten island',
      'midtown', 'downtown', 'uptown', 'chelsea', 'west village', 'east village',
      'soho', 'noho', 'tribeca', 'financial district', 'lower east side',
      'upper east side', 'upper west side', 'harlem', 'washington heights'
    ];
    
    for (const location of locations) {
      if (message.includes(location)) {
        return location;
      }
    }
    
    return null;
  }

  private isComparisonQuery(message: string): boolean {
    return message.includes('vs') || message.includes('versus') || message.includes('difference between');
  }

  private extractRestaurantsForComparison(message: string): string[] {
    const words = message.split(' ');
    const restaurants: string[] = [];
    
    for (let i = 0; i < words.length; i++) {
      if (words[i].length > 2 && words[i][0] === words[i][0].toUpperCase()) {
        let restaurantName = words[i];
        let j = i + 1;
        while (j < words.length && 
               words[j].length > 2 && 
               words[j][0] === words[j][0].toUpperCase() && 
               !['Vs', 'Versus', 'And', 'Or', 'The'].includes(words[j])) {
          restaurantName += ' ' + words[j];
          j++;
        }
        if (restaurantName.length > 3) {
          restaurants.push(restaurantName);
        }
        i = j - 1;
      }
    }
    
    return restaurants.slice(0, 2); 
  }

  private isDishQuery(message: string): boolean {
    const dishKeywords = ['order', 'dish', 'menu', 'recommend', 'best', 'popular'];
    return dishKeywords.some(keyword => message.includes(keyword));
  }
} 