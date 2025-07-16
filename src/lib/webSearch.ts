import axios from 'axios';

export interface WebSearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

export class WebSearchService {
  private serpApiKey = process.env.SERP_API_KEY;

  async searchWeb(query: string): Promise<string> {
    try {
      if (this.serpApiKey) {
        return await this.searchWithSerpAPI(query);
      } else {
        return await this.searchWithFallback(query);
      }
    } catch (error) {
      console.error('Error searching web:', error);
      return 'Unable to search the web at the moment.';
    }
  }

  private async searchWithSerpAPI(query: string): Promise<string> {
    try {
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          q: query,
          api_key: this.serpApiKey,
          engine: 'google',
          num: 10,
          gl: 'us',
          hl: 'en'
        }
      });

      const results = response.data.organic_results || [];
      return this.formatWebResults(results);
    } catch (error) {
      console.error('SerpAPI error:', error);
      return await this.searchWithFallback(query);
    }
  }

  private async searchWithFallback(query: string): Promise<string> {
    try {
      const results: WebSearchResult[] = [];
      
      results.push({
        title: `${query} - Restaurant Information`,
        snippet: `Find information about ${query} including reviews, menu, and location details.`,
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        source: 'Google Search'
      });

      return this.formatWebResults(results);
    } catch (error) {
      console.error('Fallback search error:', error);
      return 'Web search is currently unavailable.';
    }
  }

  private formatWebResults(results: any[]): string { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (results.length === 0) {
      return 'No web search results found for this query.';
    }

    let formatted = 'Web Search Results:\n\n';
    
    results.forEach((result, index) => {
      formatted += `${index + 1}. **${result.title || 'No title'}**\n`;
      formatted += `   ${result.snippet || result.snippet || 'No description available'}\n`;
      formatted += `   Source: ${result.source || 'Unknown'}\n`;
      formatted += `   URL: ${result.url || result.link || 'No URL available'}\n\n`;
    });

    return formatted;
  }

  async searchRestaurantInfo(restaurantName: string, location?: string): Promise<string> {
    const query = location 
      ? `${restaurantName} restaurant ${location} reviews menu`
      : `${restaurantName} restaurant reviews menu`;
    
    return this.searchWeb(query);
  }

  async searchCuisineInfo(cuisine: string, location?: string): Promise<string> {
    const query = location 
      ? `best ${cuisine} restaurants ${location} reviews`
      : `best ${cuisine} restaurants reviews`;
    
    return this.searchWeb(query);
  }

  async searchDishRecommendations(restaurantName: string): Promise<string> {
    const query = `${restaurantName} best dishes menu recommendations`;
    return this.searchWeb(query);
  }

  async searchRestaurantComparison(restaurant1: string, restaurant2: string): Promise<string> {
    const query = `${restaurant1} vs ${restaurant2} restaurant comparison reviews`;
    return this.searchWeb(query);
  }
} 