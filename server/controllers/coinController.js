import { Datastore } from '@google-cloud/datastore';
import jwt from 'jsonwebtoken';
import "dotenv/config";

const datastore = new Datastore({
  projectId: process.env.GCP_PROJECT_ID, 
  databaseId: process.env.GCP_DATABASE_ID,        
  keyFilename: process.env.GCP_KEY_FILE 
});

export const saveCoin = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      console.log('Received token:', token);
      console.log('Request body:', req.body); 
  
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
  
      const userId = decoded._id;
      const { coin } = req.body;
  
      // Normalize coin data
      const normalizedCoin = {
        id: coin.item?.id || coin.id,
        userId: userId,
        name: coin.item?.name || coin.name,
        symbol: coin.item?.symbol || coin.symbol,
        image: coin.item?.large || coin.image || '',
        current_price: coin.item?.data?.price || coin.current_price || 0,
        market_cap: coin.item?.data?.market_cap || coin.market_cap || 0,
        savedAt: new Date()
      };

  
      // Datastore key
      const key = datastore.key(['UserCoin', `${userId}_${normalizedCoin.id}`]);
  
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

// Function to retrieve saved coins
export const getUserCoins = async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (tokenError) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Extract user ID from decoded token
    const userId = decoded._id;

    const query = datastore
      .createQuery('UserCoin')
      .filter('userId', '=', userId);
    
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
  getUserCoins
};