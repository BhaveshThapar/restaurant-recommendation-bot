import axios from 'axios';

interface RedditPost {
  title: string;
  content: string;
  score: number;
  url: string;
  subreddit: string;
}

export class RedditService {
  private baseUrl = 'https://www.reddit.com';

  async searchReddit(query: string, subreddits: string[] = ['food', 'restaurants', 'nyc', 'AskNYC']): Promise<string> {
    try {
      const searchPromises = subreddits.map(subreddit => 
        this.searchSubreddit(query, subreddit)
      );

      const results = await Promise.allSettled(searchPromises);
      const successfulResults = results
        .filter((result): result is PromiseFulfilledResult<RedditPost[]> => result.status === 'fulfilled')
        .map(result => result.value)
        .flat();

      const topResults = successfulResults
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      if (topResults.length === 0) {
        return 'No relevant Reddit discussions found for this query.';
      }

      return this.formatRedditResults(topResults);
    } catch (error) {
      console.error('Error searching Reddit:', error);
      return 'Unable to search Reddit at the moment.';
    }
  }

  private async searchSubreddit(query: string, subreddit: string): Promise<RedditPost[]> {
    try {
      const searchUrl = `${this.baseUrl}/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=on&sort=relevance&t=year&limit=10`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'RestaurantRecommendationBot/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.data || !data.data.children) {
        return [];
      }

      return data.data.children
        .filter((post: any) => post.data && post.data.title && post.data.selftext)
        .map((post: any) => ({
          title: post.data.title,
          content: post.data.selftext.substring(0, 500) + (post.data.selftext.length > 500 ? '...' : ''),
          score: post.data.score || 0,
          url: `https://reddit.com${post.data.permalink}`,
          subreddit: post.data.subreddit
        }))
        .filter((post: RedditPost) => post.score > 0);
    } catch (error) {
      console.error(`Error searching subreddit ${subreddit}:`, error);
      return [];
    }
  }

  private formatRedditResults(posts: RedditPost[]): string {
    if (posts.length === 0) {
      return 'No relevant Reddit discussions found.';
    }

    let formattedResults = `Found ${posts.length} relevant Reddit discussions:\n\n`;
    
    posts.forEach((post, index) => {
      formattedResults += `${index + 1}. **${post.title}** (r/${post.subreddit}, Score: ${post.score})\n`;
      formattedResults += `${post.content}\n`;
      formattedResults += `Source: ${post.url}\n\n`;
    });

    return formattedResults;
  }

  async searchRestaurantReviews(restaurantName: string, location?: string): Promise<string> {
    const query = location 
      ? `${restaurantName} ${location} review`
      : `${restaurantName} review`;
    
    return this.searchReddit(query, ['food', 'restaurants', 'nyc', 'AskNYC', 'foodnyc']);
  }

  async searchCuisineRecommendations(cuisine: string, location?: string): Promise<string> {
    const query = location 
      ? `best ${cuisine} restaurant ${location}`
      : `best ${cuisine} restaurant`;
    
    return this.searchReddit(query, ['food', 'restaurants', 'nyc', 'AskNYC', 'foodnyc']);
  }
} 