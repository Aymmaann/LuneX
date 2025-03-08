import { Datastore } from '@google-cloud/datastore';
import jwt from 'jsonwebtoken';
import "dotenv/config";
import { getCryptoAnalysis, getCoinDetails } from '../services/cryptoServices.js';

const datastore = new Datastore({
  projectId: process.env.GCP_PROJECT_ID, 
  databaseId: process.env.GCP_DATABASE_ID_SAVED_CRYPTO,        
  keyFilename: process.env.GCP_KEY_FILE 
});

export const updateCryptoValues = async (req, res) => {
  try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
          return res.status(401).json({ message: 'No token provided' });
      }

      let decoded;
      try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (tokenError) {
          console.error('Token verification error:', tokenError);
          return res.status(401).json({ message: 'Invalid or expired token' });
      }

      const userEmail = decoded.email;
      if (!userEmail) {
          return res.status(400).json({ message: "User email not found in token" });
      }

      const query = datastore.createQuery('UserCoin').filter('userEmail', '=', userEmail);
      const [coins] = await datastore.runQuery(query);

      for (const coin of coins) {
          const { id: coinId } = coin;

          try {
              const { volatility, risk, trend } = await getCryptoAnalysis(coinId);
              const coinDetails = await getCoinDetails(coinId);

              if (!coinDetails) {
                  console.error(`Failed to get coin details for ${coinId}`);
                  continue;
              }

              const currentPrice = coinDetails.market_data.current_price?.usd || 0;

              const key = datastore.key(['UserCoin', `${userEmail}_${coinId}`]);
              const entity = {
                  key: key,
                  data: {
                      ...coin,
                      current_price: currentPrice,
                      volatility_score: volatility,
                      prediction: trend,
                      risk_score: risk
                  }
              };
              await datastore.save(entity);
              console.log(`Updated values for ${coinId} for user ${userEmail}`);

          } catch (analysisError) {
              console.error(`Error updating ${coinId} for user ${userEmail}:`, analysisError);
          }
      }

      res.status(200).json({ message: `Crypto values updated successfully for ${userEmail}` });
  } catch (error) {
      console.error('Error updating crypto values:', error);
      res.status(500).json({ message: 'Failed to update crypto values', error: error.message });
  }
};

export const triggerCryptoUpdate = async (req, res) => {
  try {
      await updateCryptoValues(req, res);
  } catch (error) {
      console.error('Error triggering crypto update:', error);
      res.status(500).json({ message: 'Failed to trigger crypto update', error: error.message });
  }
};

export const saveCoin = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      // console.log('Received token:', token);
      // console.log('Request body:', req.body); 
  
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
  
      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (tokenError) {
        console.error('Token verification error:', tokenError);
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
  
      // Use email as the user identifier
      const userEmail = decoded.email;
      if (!userEmail) {
        return res.status(400).json({ message: 'User email not found in token' });
      }

      const { coin } = req.body;
  
      // Normalize coin data
      const normalizedCoin = {
        id: coin.item?.id || coin.id,
        userEmail: userEmail, 
        name: coin.item?.name || coin.name,
        symbol: coin.item?.symbol || coin.symbol,
        image: coin.item?.large || coin.image || '',
        current_price: coin.item?.data?.price || coin.current_price || 0,
        market_cap: coin.item?.data?.market_cap || coin.market_cap || 0,
        price_change_percentage: coin.item?.data?.price_change_percentage_24h?.usd || coin.price_change_percentage_24h || 0,
        volatility_score: null,
        market_cap: coin.item?.data?.market_cap || coin.market_cap || 0,
        prediction: null,
        risk_score: null,
        savedAt: new Date()
      };

      const { volatility, risk, trend } = await getCryptoAnalysis(normalizedCoin.id);
      normalizedCoin.volatility_score = volatility;
      normalizedCoin.prediction = trend;
      normalizedCoin.risk_score = risk;
  
      // Datastore key - use a combination of email and coin id
      const key = datastore.key(['UserCoin', `${userEmail}_${normalizedCoin.id}`]);
  
      // Save to Datastore
      await datastore.save({
        key: key,
        data: normalizedCoin
      });
  
      res.status(200).json({
        message: 'Coin saved successfully',
        coin: normalizedCoin
      });
    } catch (error) {
      console.error('Detailed error saving coin:', error);
      res.status(500).json({ 
        message: 'Failed to save coin',
        error: error.toString(),
        stack: error.stack
      });
    }
};

export const getUserCoins = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Use email as the user identifier
    const userEmail = decoded.email;
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found in token" });
    }

    const query = datastore
      .createQuery('UserCoin')
      .filter('userEmail', '=', userEmail);
    
    const [coins] = await datastore.runQuery(query);

    res.status(200).json(coins);
  } catch (error) {
    console.error('Error retrieving coins:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve coins', 
      error: error.message 
    });
  }
};

export default {
  saveCoin,
  getUserCoins,
  updateCryptoValues,
  triggerCryptoUpdate
};