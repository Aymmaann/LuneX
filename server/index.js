import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express()
const PORT = process.env.PORT || 8080

let lastFetchTime = null;
const CACHE_DURATION = 60 * 60 * 1000; 

app.use(cors());


// Fetch top 100 crypto data
let cachedAllCryptoData = null;
app.get("/api/cryptos", async(req, res) => {
    try {
        const currentTime = new Date().getTime();
        if (cachedAllCryptoData && lastFetchTime && (currentTime - lastFetchTime < CACHE_DURATION)) {
            // Serving data from cache
            return res.json(cachedAllCryptoData);
        }
        // Fetching data
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&x_cg_demo_api_key=${process.env.API_KEY}`);
        const data = await response.json();
        const top100Coins = data
            .sort((a, b) => a.market_cap_rank - b.market_cap_rank)
            .slice(0, 100);
            
        // Update cache
        cachedAllCryptoData = top100Coins;
        lastFetchTime = currentTime;
        res.json(top100Coins);
    } catch(error) {
        console.error("Error fetching data: ", error);
        
        if (cachedAllCryptoData) {
            return res.json(cachedAllCryptoData);
        }
        res.status(500).json({message: "Error fetching data"});
    }
})

// Fetch trending crypto data
let cachedTrendingData = null;
app.get("/trending", async(req,res) => {
    try {
        const currentTime = new Date().getTime();
    
        if (cachedTrendingData && lastFetchTime && (currentTime - lastFetchTime < CACHE_DURATION)) {
            // Serving data from cache
            return res.json(cachedTrendingData);
        }

        const response = await fetch("https://api.coingecko.com/api/v3/search/trending")
        const data = await response.json()

        const top100Coins = data.coins
            .sort((a, b) => a.market_cap_rank - b.market_cap_rank)
            .slice(0, 100);

        cachedTrendingData = top100Coins;
        lastFetchTime = currentTime;

        res.json(top100Coins)
    } catch(error) {
        console.error("Error fetching data: ", error);

        if(cachedTrendingData) {
            return res.json(cachedTrendingData);
        }
        res.status(500).json({message: "Error fetching data"});
    }
})

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
})