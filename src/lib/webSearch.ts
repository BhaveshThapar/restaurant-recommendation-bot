import axios from 'axios';
import * as cheerio from 'cheerio';

interface WebSearchResult {
  title: string;
  snippet: string;
  url: string;
}

export class WebSearchService {
  private apiKey = process.env.SERPAPI_API_KEY;

  async searchWeb(query: string): Promise<string> {
    if (!this.apiKey) {
      return 'Web search is not configured. Please add SERPAPI_API_KEY to your environment variables.';
    }

    try {
      const searchUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${this.apiKey}&num=5`;
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.organic_results || data.organic_results.length === 0) {
        return 'No relevant web results found for this query.';
      }

      const results = data.organic_results.slice(0, 5).map((result: any) => ({
        title: result.title,
        snippet: result.snippet,
        url: result.link
      }));

      return this.formatWebResults(results);
    } catch (error) {
      console.error('Error searching web:', error);
      return 'Unable to search the web at the moment.';
    }
  }

  private formatWebResults(results: WebSearchResult[]): string {
    if (results.length === 0) {
      return 'No relevant web results found.';
    }

    let formattedResults = `Found ${results.length} relevant web results:\n\n`;
    
    results.forEach((result, index) => {
      formattedResults += `${index + 1}. **${result.title}**\n`;
      formattedResults += `${result.snippet}\n`;
      formattedResults += `Source: ${result.url}\n\n`;
    });

    return formattedResults;
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