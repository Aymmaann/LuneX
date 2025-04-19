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
- **FinBot: AI-Driven Financial Assistant (Gemini API):** Real-time cryptocurrency insights and personalized advice via conversational interaction.
- **User Wallet:** The wallet allows users to view all their invested cryptocurrencies, displaying the amount of each coin, the initial investment price, the current market price and more information. This enables users to monitor the performance of their portfolio in real time.
- **Investment Comparison:** The wallet allows users to view all their invested cryptocurrencies, displaying the amount of each coin, the initial investment price, the current market price and more information. This enables users to monitor the performance of their portfolio in real time. Users can compare the price of each coin when they invested versus its current price, offering a clear overview of gains or losses.
- **Analytics Dashboard:** The saved cryptos dashboard provides users with a comprehensive view of their portfolio performance, individual coin analysis, and overall market trends, helping them assess their investments' health and optimize their cryptocurrency strategy for future investments.

## Upcoming Features
  - **Multi-Cloud Integration:** Store user-selected cryptos in Datastore, analyze in BigQuery, and use AWS services for email notifications when significant price fluctuations occur.
 
## Cloud Services Used

- **Google BigQuery (Google Cloud):**  
  - Used BigQuery for advanced analytics on saved cryptocurrency data, enabling powerful insights into market trends and user behavior.

- **Google Cloud Storage (Bucket):**  
  - Stored exports of saved cryptocurrencies from Datastore in Google Cloud Storage, which are then used in BigQuery for detailed analytics and reporting. The analysis results are stored back for future reference and processing.
  
- **Cloud Run (Google Cloud):**  
  - Used Cloud Run to host the backend services, providing a scalable, serverless environment.
  
- **Google Cloud Datastore:**  
  - Used Google Cloud Datastore to store additional user authentication details and saved cryptocurrencies.

- **Google Cloud Secret Manager:**  
  - Used Google Cloud Secret Manager for securely storing sensitive environment variables, such as API keys and credentials.

- **Google Cloud Scheduler:**  
  - Configured Cloud Scheduler to trigger periodic updates of cryptocurrency values in the database every 5 minutes.

- **OAuth (Google Cloud):**  
  - Implemented OAuth for authentication, ensuring secure user login and authorization.

- **CoinGecko API:**  
  - Fetching real-time cryptocurrency market data, including prices, historical trends, and market cap.

- **Google Gemini API:**
  - Powers FinBot, providing AI-driven financial assistance and real-time cryptocurrency insights through conversational interaction.


### Upcoming Cloud Services

- **AWS EC2 (Amazon Web Services):**  
  - Hosting the backend services and API for real-time cryptocurrency tracking.  
  - Ensuring scalability and performance for high-traffic data requests.  

- **AWS SES (Simple Email Service):**  
  - Sending automated alerts for sudden price changes.  

### Useful BigQuery Queries for Users  

- **Shared Queries:** Analyze and combine multiple data points to uncover trends and insights across different coins and markets.  
- **Combined Scoring System:** Develop a unified scoring model that evaluates various metrics (e.g., price, volatility, trading volume) for each coin.  
- **Correlation Analysis:** Identify relationships between different cryptocurrencies, such as how Bitcoin’s price movements influence altcoins.  
- **Individual Coin Performance:** Track the historical performance of individual coins, including price fluctuations, volume, and market cap.  
- **Market Cap Exposure:** Assess how a user’s portfolio is exposed to different market cap categories (e.g., large-cap vs. small-cap cryptocurrencies).  
- **Performance Analysis:** Measure how different coins have performed over a set period, including trends in returns and volatility.  
- **Portfolio Risk:** Analyze the risk profile of a user's cryptocurrency portfolio based on diversification, volatility, and market exposure.  
- **Save Duration Analysis:** Evaluate the impact of holding a cryptocurrency over time, including changes in price and performance.  
- **Trending Analysis:** Identify the most popular coins and trends based on user behavior, market performance, and external factors like news and social media.


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
* `VITE_GEMINI_API_KEY`: Your application's key for accessing the Google Gemini API.

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
* `GCP_BIGQUERY_ID_SAVED_CRYPTO`: BigQuery Table Name for storing and analyzing saved cryptocurrency data.
* `GCP_ANALYSIS_BUCKET_ID`: Google Cloud Storage Bucket ID for storing exported cryptocurrency data and analysis results.
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
