import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
import cors from "cors"; 
import router from './routes/router.js';
import { 
    saveCoin, 
    getUserCoins, 
    updateCryptoValues, 
    triggerCryptoUpdate,
    updateAllUsersCoins,
    saveInvestedCrypto,
    getInvestedCryptos,
    updateAllInvestedUsersCoins
  } from './controllers/coinController.js';
import { Server } from 'socket.io';
import { saveInvestedCrypto as originalSaveInvestedCrypto } from './controllers/coinController.js';

const app = express();
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

let lastFetchTime = null;
const CACHE_DURATION = 60 * 60 * 1000; 

app.use(cors());
app.use(express.json());


// Fetch top 250 crypto data
let cachedAllCryptoData = null;
const CRYPTOS_TO_FETCH = 250; 
app.get("/api/cryptos", async (req, res) => {
    try {
        const currentTime = new Date().getTime();
        if (cachedAllCryptoData && lastFetchTime && (currentTime - lastFetchTime < CACHE_DURATION)) {
            return res.json(cachedAllCryptoData);
        }

        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${CRYPTOS_TO_FETCH}&page=1&sparkline=false&x_cg_demo_api_key=${process.env.API_KEY}`);

        if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        const data = await response.json();

        const top250Coins = data.sort((a, b) => a.market_cap_rank - b.market_cap_rank).slice(0, CRYPTOS_TO_FETCH);

        cachedAllCryptoData = top250Coins;
        lastFetchTime = currentTime;
        setTimeout(() => {
            cachedAllCryptoData = null;
        }, CACHE_DURATION);
        res.json(top250Coins);

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
        setTimeout(() => {
            cachedTrendingData = null;
        }, CACHE_DURATION);
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
const historicalDataCache = new Map();
app.get("/api/crypto/:id/history", async (req, res) => {
    try {
        const { id } = req.params;
        const { days } = req.query;
        const cacheKey = `history_${id}_${days}`; 
        if (historicalDataCache.has(cacheKey)) {
            return res.json(historicalDataCache.get(cacheKey)); 
        }
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily&x_cg_demo_api_key=${process.env.API_KEY}`
        );
        if (!response.ok) throw new Error("Failed to fetch historical data");

        const data = await response.json();
        historicalDataCache.set(cacheKey, data)
        setTimeout(() => {
            historicalDataCache.delete(cacheKey);
        }, CACHE_DURATION);
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

app.get("/api/get-invested-cryptos", getInvestedCryptos)

app.get("/", (req,res) => {
    res.send("Hello from auth server")
})

app.post("/update-crypto-value", updateCryptoValues)

app.get("/api/trigger-crypto-update", triggerCryptoUpdate)

app.get("/api/update-all-users", updateAllUsersCoins);

app.get("/api/update-all-invested-users", updateAllInvestedUsersCoins);

app.post("/api/invest-crypto", async (req, res) => {
    try {
        const result = await originalSaveInvestedCrypto(req, res); 
        if(res.statusCode === 200){
            io.emit('investedCryptoUpdated', result.coin); 
        }
        return result;
    } catch (error) {
        console.error("Error in invested crypto route:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

app.use('/auth', router);
export { io };