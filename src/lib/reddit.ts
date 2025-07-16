import axios from 'axios';

export interface RedditPost {
  title: string;
  content: string;
  score: number;
  url: string;
  subreddit: string;
  author: string;
  created_utc: number;
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

      const relevantResults = this.filterRelevantResults(successfulResults, query);

      const topResults = relevantResults
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
      const searchQueries = this.generateSearchQueries(query);
      
      const allPosts: RedditPost[] = [];
      
      for (const searchQuery of searchQueries) {
        const response = await axios.get(`${this.baseUrl}/r/${subreddit}/search.json`, {
          params: {
            q: searchQuery,
            restrict_sr: 'on',
            sort: 'relevance',
            t: 'year',
            limit: 5
          },
          headers: {
            'User-Agent': 'RestaurantRecommendationBot/1.0'
          }
        });

        const posts = response.data.data.children.map((child: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
          title: child.data.title,
          content: child.data.selftext || '',
          score: child.data.score,
          url: `https://reddit.com${child.data.permalink}`,
          subreddit: child.data.subreddit,
          author: child.data.author,
          created_utc: child.data.created_utc
        }));

        allPosts.push(...posts);
      }

      const uniquePosts = this.removeDuplicates(allPosts);
      return uniquePosts.filter((post: RedditPost) => post.content.length > 30);
    } catch (error) {
      console.error(`Error searching subreddit ${subreddit}:`, error);
      return [];
    }
  }

  private generateSearchQueries(originalQuery: string): string[] {
    const queries = [originalQuery];
    
    const words = originalQuery.toLowerCase().split(' ');
    
    const cuisines = ['mediterranean', 'italian', 'chinese', 'japanese', 'thai', 'indian', 'mexican', 'french', 'greek', 'american', 'korean', 'vietnamese', 'spanish', 'lebanese', 'turkish', 'ethiopian', 'moroccan', 'brazilian', 'peruvian', 'caribbean'];
    const locations = ['flatiron', 'manhattan', 'brooklyn', 'queens', 'bronx', 'midtown', 'downtown', 'uptown', 'chelsea', 'west village', 'east village', 'soho', 'noho', 'tribeca', 'financial district', 'lower east side', 'upper east side', 'upper west side', 'harlem', 'washington heights'];
    
    const foundCuisine = cuisines.find(cuisine => words.includes(cuisine));
    const foundLocation = locations.find(location => words.includes(location));
    
    if (foundCuisine && foundLocation) {
      queries.push(`${foundCuisine} restaurant ${foundLocation}`);
      queries.push(`best ${foundCuisine} ${foundLocation}`);
      queries.push(`${foundCuisine} food ${foundLocation}`);
    } else if (foundCuisine) {
      queries.push(`${foundCuisine} restaurant`);
      queries.push(`best ${foundCuisine}`);
    } else if (foundLocation) {
      queries.push(`restaurant ${foundLocation}`);
      queries.push(`food ${foundLocation}`);
    }
    
    return queries;
  }

  private removeDuplicates(posts: RedditPost[]): RedditPost[] {
    const seen = new Set();
    return posts.filter(post => {
      const key = `${post.title}-${post.author}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private filterRelevantResults(posts: RedditPost[], originalQuery: string): RedditPost[] {
    const queryWords = originalQuery.toLowerCase().split(' ').filter(word => word.length > 2);
    
    return posts.filter(post => {
      const titleAndContent = `${post.title} ${post.content}`.toLowerCase();
      
      const cuisines = ['mediterranean', 'italian', 'chinese', 'japanese', 'thai', 'indian', 'mexican', 'french', 'greek', 'american', 'korean', 'vietnamese', 'spanish', 'lebanese', 'turkish', 'ethiopian', 'moroccan', 'brazilian', 'peruvian', 'caribbean'];
      const locations = ['flatiron', 'manhattan', 'brooklyn', 'queens', 'bronx', 'midtown', 'downtown', 'uptown', 'chelsea', 'west village', 'east village', 'soho', 'noho', 'tribeca', 'financial district', 'lower east side', 'upper east side', 'upper west side', 'harlem', 'washington heights'];
      
      const foundCuisine = cuisines.find(cuisine => queryWords.includes(cuisine));
      const foundLocation = locations.find(location => queryWords.includes(location));
      
      if (foundCuisine && foundLocation) {
        const hasCuisine = titleAndContent.includes(foundCuisine);
        const hasLocation = titleAndContent.includes(foundLocation);
        const hasRestaurantTerms = ['restaurant', 'food', 'dining', 'eat', 'meal', 'dish', 'menu', 'cuisine', 'kitchen'].some(term => titleAndContent.includes(term));
        
        return hasCuisine && hasLocation && hasRestaurantTerms;
      }
      
      if (foundCuisine) {
        const hasCuisine = titleAndContent.includes(foundCuisine);
        const hasRestaurantTerms = ['restaurant', 'food', 'dining', 'eat', 'meal', 'dish', 'menu', 'cuisine', 'kitchen'].some(term => titleAndContent.includes(term));
        
        return hasCuisine && hasRestaurantTerms;
      }
      
      if (foundLocation) {
        const hasLocation = titleAndContent.includes(foundLocation);
        const hasRestaurantTerms = ['restaurant', 'food', 'dining', 'eat', 'meal', 'dish', 'menu', 'cuisine', 'kitchen'].some(term => titleAndContent.includes(term));
        
        return hasLocation && hasRestaurantTerms;
      }
      
      const matchingWords = queryWords.filter(word => titleAndContent.includes(word));
      const hasRestaurantTerms = ['restaurant', 'food', 'dining', 'eat', 'meal', 'dish', 'menu', 'cuisine', 'kitchen'].some(term => titleAndContent.includes(term));
      
      return matchingWords.length >= 3 && hasRestaurantTerms;
    });
  }

  private formatRedditResults(posts: RedditPost[]): string {
    let formatted = 'Reddit Discussions and Reviews:\n\n';
    
    posts.forEach((post: RedditPost, index: number) => {
      formatted += `${index + 1}. **${post.title}** (r/${post.subreddit})\n`;
      formatted += `   Score: ${post.score} | Author: ${post.author}\n`;
      formatted += `   ${post.content.substring(0, 300)}${post.content.length > 300 ? '...' : ''}\n`;
      formatted += `   URL: ${post.url}\n\n`;
    });

    return formatted;
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