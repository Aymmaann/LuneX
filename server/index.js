import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
import cors from "cors"; 
import router from './routes/authRouter.js';
import { saveCoin, getUserCoins } from './controllers/coinController.js';

const app = express();
const PORT = process.env.PORT || 8080;

let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; 

app.use(cors());
app.use(express.json());


// Fetch top 100 crypto data
let cachedAllCryptoData = null;
app.get("/api/cryptos", async (req, res) => {
    try {
        const currentTime = new Date().getTime();
        if (cachedAllCryptoData && lastFetchTime && (currentTime - lastFetchTime < CACHE_DURATION)) {
            return res.json(cachedAllCryptoData);
        }
        
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&x_cg_demo_api_key=${process.env.API_KEY}`);
        const data = await response.json();
        const top100Coins = data.sort((a, b) => a.market_cap_rank - b.market_cap_rank).slice(0, 100);
        
        cachedAllCryptoData = top100Coins;
        lastFetchTime = currentTime;
        res.json(top100Coins);
    } catch (error) {
        console.error("Error fetching data:", error);
        if (cachedAllCryptoData) {
            return res.json(cachedAllCryptoData);
        }
        res.status(500).json({ message: "Error fetching data" });
    }
});

// Fetch trending crypto data
let cachedTrendingData = null;
app.get("/trending", async (req, res) => {
    try {
        const currentTime = new Date().getTime();
        if (cachedTrendingData && lastFetchTime && (currentTime - lastFetchTime < CACHE_DURATION)) {
            return res.json(cachedTrendingData);
        }

        const response = await fetch("https://api.coingecko.com/api/v3/search/trending");
        const data = await response.json();
        const top100Coins = data.coins.sort((a, b) => a.market_cap_rank - b.market_cap_rank).slice(0, 100);

        cachedTrendingData = top100Coins;
        lastFetchTime = currentTime;
        res.json(top100Coins);
    } catch (error) {
        console.error("Error fetching data:", error);
        if (cachedTrendingData) {
            return res.json(cachedTrendingData);
        }
        res.status(500).json({ message: "Error fetching data" });
    }
});

// Retrieve the coin's price data from the past 30 days
app.get("/api/crypto/:id/history", async (req, res) => {
    try {
        const { id } = req.params;
        const { days } = req.query;
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily&x_cg_demo_api_key=${process.env.API_KEY}`
        );
        if (!response.ok) throw new Error("Failed to fetch historical data");

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching historical data:", error);
        res.status(500).json({ message: "Error fetching historical data" });
    }
});

// Save a coin to the Cloud Datastore
app.post("/api/save-coin", saveCoin);

// Display the saved coins
app.get("/api/get-user-coins", getUserCoins);

app.get("/", (req,res) => {
    res.send("Hello from auth server")
})

app.use('/auth', router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));