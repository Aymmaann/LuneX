import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express()
const PORT = process.env.PORT || 8080

let cachedData = null;
let lastFetchTime = null;
const CACHE_DURATION = 60 * 60 * 1000; 

app.use(cors());

app.get("/api/cryptos", async(req, res) => {
    try {
        const currentTime = new Date().getTime();
    
        if (cachedData && lastFetchTime && (currentTime - lastFetchTime < CACHE_DURATION)) {
            console.log("Serving data from cache");
            return res.json(cachedData);
        }

        console.log("Fetching fresh data from CoinGecko");
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&x_cg_demo_api_key=${process.env.API_KEY}`);
        const data = await response.json();
        
        const top100Coins = data
            .sort((a, b) => a.market_cap_rank - b.market_cap_rank)
            .slice(0, 100);
            
        // Update cache
        cachedData = top100Coins;
        lastFetchTime = currentTime;
        
        res.json(top100Coins);
    } catch(error) {
        console.error("Error fetching data: ", error);
        
        if (cachedData) {
            console.log("Returning cached data as fallback");
            return res.json(cachedData);
        }
        
        res.status(500).json({message: "Error fetching data"});
    }
})

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
})