import fetch from 'node-fetch'
import "dotenv/config";

// Function to fetch historical price data
// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to fetch historical price data with detailed logging
async function fetchHistoricalData(coinId) {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=90&x_cg_demo_api_key=${process.env.API_KEY}`;
    console.log(`Requesting URL: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CoinGecko API error (${response.status}) for ${coinId}: ${errorText}`);
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.prices) {
      console.error(`No prices property found in data for ${coinId}:`, JSON.stringify(data).substring(0, 200) + '...');
      throw new Error('No prices property in API response');
    }
    
    if (!Array.isArray(data.prices) || data.prices.length === 0) {
      console.error(`Prices is not an array or is empty for ${coinId}:`, data.prices);
      throw new Error('Prices is not an array or is empty');
    }
    
    return data.prices.map(p => p[1]);
  } catch (error) {
    console.error(`Critical error in fetchHistoricalData for ${coinId}:`, error);
    return []; 
  }
}

async function getCryptoAnalysis(coinId) {
    try {
    //   await delay(1000);
      
      const prices = await fetchHistoricalData(coinId);
      
      // Only proceed if we have price data
      if (prices.length === 0) {
        console.log(`No price data available for ${coinId}, returning default values`);
        return { volatility: 0, risk: 10, trend: "Unknown" };
      }
      
      // Calculate volatility using the prices we already have
      const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
      const squaredDiffs = prices.map(p => (p - mean) ** 2);
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / prices.length;
      const volatility = Math.sqrt(variance).toFixed(2);
      
      // Determine trend using the prices we already have
      const firstPrice = prices[0];
      const lastPrice = prices[prices.length - 1];
      const percentageChange = ((lastPrice - firstPrice) / firstPrice) * 100;
      let trend;
      if (percentageChange > 5) trend = "Bullish";
      else if (percentageChange < -5) trend = "Bearish";
      else trend = "Neutral";
      
      // Add another delay before the second API call
    //   await delay(1000);
      
      // Get coin details for market cap and price change
      const url = `https://api.coingecko.com/api/v3/coins/${coinId}?x_cg_demo_api_key=${process.env.API_KEY}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`CoinGecko API error (${response.status}) for ${coinId}: ${errorText}`);
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Verify we have market data
      if (!data.market_data) {
        console.error(`No market_data in response for ${coinId}`);
        throw new Error('No market_data in API response');
      }
      
      const marketCap = data.market_data?.market_cap?.usd || 0;
      const priceChange = data.market_data?.price_change_percentage_24h || 0;
      
      // Calculate risk score
      let risk = 0;
      if (volatility > 5) risk += 3;
      else if (volatility > 3) risk += 2;
      else risk += 1;
      
      if (marketCap < 500000000) risk += 3;
      else if (marketCap < 5000000000) risk += 2;
      else risk += 1;
      
      if (priceChange < -5) risk += 3;
      else if (priceChange < -2) risk += 2;
      else risk += 1;
      
      risk = Math.min(risk, 10);
      
      return { volatility, risk, trend };
    } catch (error) {
      console.error(`Error in getCryptoAnalysis for ${coinId}:`, error);
      return { volatility: 0, risk: 10, trend: "Error" };
    }
}

// Export functions
export { fetchHistoricalData, getCryptoAnalysis }
