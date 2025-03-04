# LuneX

LuneX is a cloud-powered cryptocurrency tracking platform that provides real-time insights, historical analysis, and AI-driven volatility alerts. This project leverages multiple cloud services for authentication, data storage, and analytics. **LuneX is currently under development.**

## Features

- **User Authentication:** Implements OAuth authentication, allowing secure sign-in and user data storage in a MongoDB database.
- **Dashboard:** Displays the top 100 cryptocurrencies with real-time pricing and market details.
- **Detailed Crypto View:** Each cryptocurrency has a modal that provides:
  - Historical data for the last 30 days.
  - A built-in currency converter to check the equivalent value in USD.
- **Trending Page:** Highlights trending cryptocurrencies with:
  - A modal showing the price trend for the last 24 hours.
  - Dynamic investment advice based on current growth or fall rate (e.g., "Promising," "Be Cautious," "Risky to Invest").
- **Upcoming Features:**
  - **AI-Powered Volatility Alerts:** BigQuery analytics and vector AI to detect significant price changes in user-tracked cryptos.
  - **Multi-Cloud Integration:** Store user-selected cryptos in Firestore, analyze in BigQuery, and use AWS services for email notifications when significant price fluctuations occur.

## Cloud Services Used

- **OAuth (Google Cloud):**  
  - Implemented OAuth for authentication, ensuring secure user login and authorization.
  
- **Cloud Run (Google Cloud):**  
  - Used Cloud Run to host the backend services, providing a scalable, serverless environment.
  
- **MongoDB Atlas:**  
  - Storing user authentication details and saved cryptocurrencies.

- **CoinGecko API:**  
  - Fetching real-time cryptocurrency market data, including prices, historical trends, and market cap.

### Upcoming Cloud Services

- **Firestore (Google Cloud):**  
  - Storing user-tracked cryptocurrencies for seamless cross-device access.

- **BigQuery (Google Cloud):**  
  - Analyzing historical crypto data and volatility patterns.  
  - Identifying correlations between trading volume and price changes.  
  - Calculating moving averages and trend analysis for better market insights.  
  - Aggregating data for custom user reports (e.g., most volatile assets over time).  

- **Vertex AI (Google Cloud):**  
  - Calculating **Volatility Score** to assess how much a cryptocurrency's price fluctuates.  
  - Predicting **Expected Price Rise/Drop** based on historical trends and market conditions.  
  - **Trend Prediction** (Bullish, Bearish, Neutral) using ML models trained on past price actions.  

- **AWS EC2 (Amazon Web Services):**  
  - Hosting the backend services and API for real-time cryptocurrency tracking.  
  - Ensuring scalability and performance for high-traffic data requests.  

- **AWS SES (Simple Email Service):**  
  - Sending automated alerts for sudden price changes.  

### Useful BigQuery Analyses for Users  

- **Price Correlation Analysis:** Find relationships between different coins (e.g., how Bitcoin’s price affects altcoins).  
- **Whale Activity Detection:** Track large transactions and how they impact price volatility.  
- **Seasonal Trends:** Identify patterns like "weekend dips" or "Monday recoveries" based on historical data.  
- **Market Sentiment Analysis:** If combined with news/social media data, gauge sentiment around a coin.  
- **Exchange Liquidity Analysis:** Compare spreads across exchanges to find the best trading opportunities.  

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Aymmaann/LuneX.git
   cd lunex
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the necessary credentials (OAuth keys, database connection, API keys, etc.).
4. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing
This project is still in development. Contributions and suggestions are welcome!

## License
This project is licensed under the MIT License.
