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
  
- **AWS SES (Simple Email Service):**  
  - Sending automated alerts for sudden price changes.

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
