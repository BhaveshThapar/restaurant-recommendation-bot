# Restaurant Recommendation Bot

An AI-powered restaurant recommendation chatbot built with Next.js, Gemini AI, Reddit search, and web search capabilities. Get personalized restaurant recommendations, compare restaurants, and discover the best dishes using real-time data from Reddit and the web.

## Features

- **AI-Powered Chatbot**: Uses Google's Gemini AI for intelligent restaurant recommendations
- **Reddit Integration**: Searches Reddit for real user reviews and discussions
- **Web Search**: Finds restaurant information, reviews, and recommendations from across the web
- **Smart Query Analysis**: Automatically determines the best search strategy based on your question
- **Real-time Responses**: Get instant recommendations with source attribution
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS

## Example Queries

The bot can handle various types of restaurant-related questions:

- **Cuisine Recommendations**: "Where is the best place to get mediterranean food in flatiron?"
- **Dish Suggestions**: "What should I order at four charles?"
- **Restaurant Comparisons**: "What is the difference between thai villa and soothr?"
- **Price Information**: "Is per se an expensive restaurant?"
- **General Recommendations**: "Best Italian restaurants in Manhattan"

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **AI**: Google Gemini AI (gemini-1.5-flash)
- **Search Tools**: Reddit API, SerpAPI (web search)
- **Styling**: Tailwind CSS with custom components
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key
- (Optional) SerpAPI key for enhanced web search

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/BhaveshThapar/restaurant-recommendation-bot.git
cd restaurant-recommendation-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Required: Gemini API Key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Optional: Enhanced web search (SerpAPI)
SERP_API_KEY=your_serp_api_key

# Optional: Reddit API (for enhanced Reddit search)
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
```

### 4. Get API Keys

#### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

#### SerpAPI Key (Optional)
1. Sign up at [SerpAPI](https://serpapi.com/)
2. Get your API key
3. Add it to your `.env.local` file for enhanced web search

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Chat API endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main page
├── components/
│   ├── ChatInterface.tsx         # Main chat component
│   ├── ChatMessage.tsx           # Individual message component
│   ├── ChatInput.tsx             # Message input component
│   └── Suggestions.tsx           # Query suggestions
└── lib/
    ├── chatbot.ts                # Main chatbot orchestrator
    ├── gemini.ts                 # Gemini AI service
    ├── reddit.ts                 # Reddit search service
    └── webSearch.ts              # Web search service
```

## API Endpoints

### POST /api/chat

Send a message to the chatbot and get a response with search results.

**Request:**
```json
{
  "message": "Where is the best place to get mediterranean food in flatiron?"
}
```

**Response:**
```json
{
  "message": "Based on my search results...",
  "sources": {
    "reddit": "Reddit search results...",
    "web": "Web search results..."
  }
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `GOOGLE_GENERATIVE_AI_API_KEY`
- `SERP_API_KEY` (optional)
- `REDDIT_CLIENT_ID` (optional)
- `REDDIT_CLIENT_SECRET` (optional)

## Features in Detail

### Smart Query Analysis

The bot automatically analyzes your query to determine:
- Whether to search Reddit, web, or both
- What specific search terms to use
- How to format the response

### Reddit Integration

- Searches multiple food-related subreddits
- Filters by relevance and score
- Provides direct links to discussions
- Focuses on recent, high-quality content

### Web Search

- Uses SerpAPI for comprehensive web search
- Falls back to basic search if API unavailable
- Searches restaurant review sites and general web
- Provides source attribution

### AI Response Generation

- Uses Gemini AI to synthesize search results
- Provides natural, conversational responses
- Includes source information
- Handles various query types intelligently

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## Acknowledgments

- Google Gemini AI for the AI capabilities
- Reddit for community-driven restaurant discussions
- SerpAPI for web search functionality
- Next.js team for the excellent framework
