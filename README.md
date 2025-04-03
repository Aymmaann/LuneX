# LuneX

LuneX is a cloud-powered cryptocurrency tracking platform that provides real-time insights, historical analysis, and AI-driven volatility alerts. This project leverages multiple cloud services for authentication, data storage, and analytics. **LuneX is currently under development.**

## Features

- **User Authentication:** Implements OAuth authentication, allowing secure sign-in and user data storage in a Google Cloud Datastore.
- **Dashboard:** Displays the top 250 cryptocurrencies with real-time pricing and market details.
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
  
- **Google Cloud Datastore:**  
  - Used Google Cloud Datastore to store additional user authentication details and saved cryptocurrencies.

- **Google Cloud Secret Manager:**  
  - Used Google Cloud Secret Manager for securely storing sensitive environment variables, such as API keys and credentials.

- **Google Cloud Scheduler:**  
  - Configured Cloud Scheduler to trigger periodic updates of cryptocurrency values in the database every 5 minutes.

- **CoinGecko API:**  
  - Fetching real-time cryptocurrency market data, including prices, historical trends, and market cap.



### Upcoming Cloud Services

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

## Environment Variables (Client)

The client component of this project utilizes the following environment variables, which are specific to Vite projects. These variables should be set in a `.env` file within the `client` directory.

**Explanation of Variables:**

* `VITE_GOOGLE_CLIENT_ID`: Google OAuth 2.0 Client ID for the client-side application.
* `VITE_API_URL`: The URL of the API server that the client will communicate with.

**Setting Up Environment Variables:**

1.  Create a `.env` file in the `client` directory.
2.  Populate the `.env` file with the required variables and their values, as shown above.
3.  Ensure that the `.env` file is not committed to version control (add it to your `.gitignore` file).

## Environment Variables (Server)

The server component of this project relies on the following environment variables. These variables should be set in a `.env` file within the `server` directory.

**Explanation of Variables:**

* `API_KEY`: API key for external services (if applicable).
* `PORT`: The port on which the server will listen.
* `GOOGLE_CLIENT_ID`: Google OAuth 2.0 Client ID.
* `GOOGLE_CLIENT_SECRET`: Google OAuth 2.0 Client Secret.
* `JWT_SECRET`: Secret key for JSON Web Token (JWT) generation.
* `JWT_TIMEOUT`: Expiration time for JWTs.
* `NODE_ENV`: Node.js environment (e.g., `development`, `production`).
* `GCP_PROJECT_ID`: Google Cloud Platform project ID.
* `GCP_DATABASE_ID_SAVED_CRYPTO`: Google Cloud Platform database ID for saved cryptocurrency data.
* `GCP_DATABASE_ID_LOGIN_INFO`: Google Cloud Platform database ID for login information.
* `GCP_DATABASE_ID_INVESTED_CRYPTOS`: Google Cloud Platform database ID for invested cryptocurrency data.
* `GCP_KEY_FILE`: Path to the Google Cloud Platform service account key file.
* `API_URL`: The url of your api.

**Setting Up Environment Variables:**

1.  Create a `.env` file in the `server` directory.
2.  Populate the `.env` file with the required variables and their values.
3.  Ensure that the `.env` file is not committed to version control (add it to your `.gitignore` file). 

## Contributing
This project is still in development. Contributions and suggestions are welcome!

## License
This project is licensed under the MIT License.
