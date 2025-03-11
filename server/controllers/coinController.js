import "dotenv/config";
import { Datastore } from '@google-cloud/datastore';
import jwt from 'jsonwebtoken';
import { getCryptoAnalysis, getCoinDetails } from '../services/cryptoServices.js';
import { OAuth2Client } from 'google-auth-library';
import { io } from "../index.js";

const datastore = new Datastore({
  projectId: process.env.GCP_PROJECT_ID, 
  databaseId: process.env.GCP_DATABASE_ID_SAVED_CRYPTO,        
  keyFilename: process.env.GCP_KEY_FILE 
});

const userDatastore = new Datastore({
  projectId: process.env.GCP_PROJECT_ID,
  databaseId: process.env.GCP_DATABASE_ID_LOGIN_INFO,
  keyFilename: process.env.GCP_KEY_FILE
});

const investedDatastore = new Datastore({
  projectId: process.env.GCP_PROJECT_ID,
  databaseId: process.env.GCP_DATABASE_ID_INVESTED_CRYPTOS,
  keyFilename: process.env.GCP_KEY_FILE
});

const client = new OAuth2Client();

async function verifyOidcToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header missing or invalid');
  }
  const token = authHeader.split('Bearer ')[1];
  try {
      console.log("Token to verify", token);
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.API_URL,
      });
      const payload = ticket.getPayload();
      console.log("Payload: ", payload);
      console.log('OIDC Token Audience:', payload.aud);
      console.log('Expected Audience:', process.env.API_URL);
      return payload;
  } catch (error) {
      console.error('OIDC Token Verification Error:', error);
      throw error;
  }
}

// Helper function to update crypto values for a specific user
async function updateCryptoValuesForUser(userEmail) {
  try {
      console.log(`Processing updates for user: ${userEmail}`);
      
      const query = datastore.createQuery('UserCoin').filter('userEmail', '=', userEmail);
      const [coins] = await datastore.runQuery(query);
      console.log(`Found ${coins.length} coins for user ${userEmail}`);

      if (coins.length === 0) {
          console.log(`No coins found for user ${userEmail}`);
          return {
              userEmail,
              status: 'no_coins',
              message: 'No coins found for this user'
          };
      }

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
                      risk_score: risk,
                      last_updated: new Date()
                  }
              };
              try {
                await datastore.save(entity);
                console.log(`Updated values for ${coinId} for user ${userEmail}`);
              } catch (saveError) {
                console.error(`Error saving to Datastore for ${coinId} for user ${userEmail}:`, saveError);
              }

          } catch (analysisError) {
              console.error(`Error updating ${coinId} for user ${userEmail}:`, analysisError);
          }
      }

      return {
          userEmail,
          status: 'success',
          coinsUpdated: coins.length
      };
  } catch (error) {
      console.error(`Error in updateCryptoValuesForUser for ${userEmail}:`, error);
      return {
          userEmail,
          status: 'error',
          message: error.message
      };
  }
}

// Main handler for scheduler - updates all users
export const updateAllUsersCoins = async (req, res) => {
  try {
      // First verify if this is an authorized request from Cloud Scheduler
      const authHeader = req.headers.authorization;
      try {
          const payload = await verifyOidcToken(authHeader);
          // Check if the email is from a service account (Cloud Scheduler)
          if (!payload.email.endsWith('.iam.gserviceaccount.com')) {
              return res.status(403).json({ 
                  message: 'Only service accounts can call this endpoint'
              });
          }
          console.log("Scheduler authenticated successfully:", payload.email);
      } catch (authError) {
          console.error("Scheduler authentication failed:", authError);
          return res.status(401).json({ 
              message: 'Unauthorized access to scheduler endpoint'
          });
      }

      // Get all unique users who have saved coins
      console.log("Fetching all users with saved coins...");
      const query = datastore.createQuery('UserCoin')
          .select('userEmail');
      
      const [results] = await datastore.runQuery(query);
      
      // Extract unique user emails
      const userEmails = [...new Set(results.map(coin => coin.userEmail))];
      console.log(`Found ${userEmails.length} users with saved coins`);

      if (userEmails.length === 0) {
          return res.status(200).json({
              message: 'No users with saved coins found',
              usersProcessed: 0
          });
      }

      // Process each user - but use sequential processing to avoid rate limits
      const updateResults = [];
      for (const email of userEmails) {
          const result = await updateCryptoValuesForUser(email);
          updateResults.push(result);
          
          // Add a small delay between users to avoid hitting API rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Return results
      return res.status(200).json({
          message: 'Crypto update completed for all users',
          usersProcessed: userEmails.length,
          results: updateResults
      });
  } catch (error) {
      console.error('Error in updateAllUsersCoins:', error);
      return res.status(500).json({
          message: 'Failed to update crypto values for all users',
          error: error.message
      });
  }
};

export const updateCryptoValues = async (req, res) => {
  try {
      const authHeader = req.headers.authorization;
      let userEmail;
      try {
          const payload = await verifyOidcToken(authHeader);
          userEmail = payload.email;
          console.log("User Email from OIDC: ", userEmail);
      } catch (oidcError) {
          try {
              const token = authHeader?.split(' ')[1];
              if (!token) {
                  return res.status(401).json({ message: 'No token provided' });
              }
              let decoded;
              decoded = jwt.verify(token, process.env.JWT_SECRET);
              userEmail = decoded.email;
          } catch (jwtError) {
              return res.status(401).json({ message: 'Invalid or expired token' });
          }
      }

      if (!userEmail) {
          return res.status(400).json({ message: "User email not found in token" });
      }

      const result = await updateCryptoValuesForUser(userEmail);
      
      if (result.status === 'success') {
        // After successfully updating crypto values, emit the event
        const query = datastore.createQuery('UserCoin').filter('userEmail', '=', userEmail);
        const [coins] = await datastore.runQuery(query);
        coins.forEach(coin => {
            io.emit('savedCryptoUpdated', coin);
        });

        res.status(200).json({
            message: `Crypto values updated successfully for ${userEmail}`,
            coinsUpdated: result.coinsUpdated
        });
      } else {
          res.status(result.status === 'no_coins' ? 200 : 500).json({ 
              message: result.message || `Error updating crypto values for ${userEmail}`
          });
      }
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
        prediction: null,
        risk_score: null,
        savedAt: new Date(),
        last_updated: new Date()
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

      io.emit('savedCryptoUpdated', normalizedCoin);
  
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

export const getInvestedCryptos = async(req,res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if(!token) {
      return res.status(401).json({ message: 'No token porovided' })
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch(tokenError) {
      console.error('Token verification error: ', tokenError)
      return res.status(401).json({ message: 'Invalid or expired token' })
    }
    const userEmail = decoded.email
    if(!userEmail) {
      return res.status(400).json({ message: 'User email not found in token' })
    }
    const query = investedDatastore
      .createQuery('invested_cryptos')
      .filter('userEmail', '=', userEmail)
    
    const [coins] = await investedDatastore.runQuery(query)
    res.status(200).json(coins)
  } catch(error) {
    console.error("Error retrieving coins: ", err)
    res.status(500).json({
      message: 'Failed to retrieve coins',
      error: error.message
    })
  }
}

export const saveInvestedCrypto = async (req, res) => {
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
          return res.status(400).json({ message: 'User email not found in token' });
      }

      const { coin, quantity } = req.body;

      const currentPrice = coin.item?.data?.price || coin.current_price || 0;

      const coinId = coin.item?.id || coin.id;

      const key = investedDatastore.key(['invested_cryptos', `${userEmail}_${coinId}`]);

      const [existingCoin] = await investedDatastore.get(key);

      let marketCap = coin.item?.data?.market_cap || coin.market_cap || 0;

      // Check and remove the dollar sign from market_cap
      if (typeof marketCap === 'string' && marketCap.startsWith('$')) {
          marketCap = marketCap.substring(1).replace(/,/g, '');
          marketCap = parseFloat(marketCap); 
      }

      if (existingCoin) {
          const updatedQuantity = existingCoin.quantity + quantity;
          const { volatility, risk, trend } = await getCryptoAnalysis(coinId);

          const updatedCoin = {
              ...existingCoin,
              quantity: updatedQuantity,
              volatility_score: volatility,
              prediction: trend,
              risk_score: risk,
              current_price: currentPrice,
              market_cap: marketCap, 
          };

          await investedDatastore.save({
              key: key,
              data: updatedCoin,
          });

          res.status(200).json({
              message: 'Crypto investment updated successfully',
              coin: updatedCoin,
          });
      } else {
          const normalizedCoin = {
              id: coinId,
              userEmail: userEmail,
              name: coin.item?.name || coin.name,
              symbol: coin.item?.symbol || coin.symbol,
              image: coin.item?.large || coin.image || '',
              invested_price: currentPrice,
              current_price: currentPrice,
              market_cap: marketCap, 
              price_change_percentage: coin.item?.data?.price_change_percentage_24h?.usd || coin.price_change_percentage_24h || 0,
              volatility_score: null,
              prediction: null,
              risk_score: null,
              savedAt: new Date(),
              quantity: quantity,
              last_updated: new Date()
          };

          const { volatility, risk, trend } = await getCryptoAnalysis(normalizedCoin.id);
          normalizedCoin.volatility_score = volatility;
          normalizedCoin.prediction = trend;
          normalizedCoin.risk_score = risk;

          await investedDatastore.save({
              key: key,
              data: normalizedCoin,
          });

          res.status(200).json({
              message: 'Crypto investment saved successfully',
              coin: normalizedCoin,
          });
      }
  } catch (error) {
      console.error('Detailed error saving invested crypto:', error);
      res.status(500).json({
          message: 'Failed to save invested crypto',
          error: error.toString(),
          stack: error.stack,
      });
  }
};

// Helper function to update invested crypto values for a specific user
async function updateInvestedCryptoValuesForUser(userEmail) {
  try {
      console.log(`Processing invested crypto updates for user: ${userEmail}`);

      const query = investedDatastore.createQuery('invested_cryptos').filter('userEmail', '=', userEmail);
      const [coins] = await investedDatastore.runQuery(query);
      console.log(`Found ${coins.length} invested cryptos for user ${userEmail}`);

      if (coins.length === 0) {
          console.log(`No invested cryptos found for user ${userEmail}`);
          return {
              userEmail,
              status: 'no_coins',
              message: 'No invested cryptos found for this user'
          };
      }

      for (const coin of coins) {
          const { id: coinId } = coin;

          try {
              const coinDetails = await getCoinDetails(coinId);

              if (!coinDetails) {
                  console.error(`Failed to get coin details for ${coinId}`);
                  continue;
              }
              const currentPrice = coinDetails.market_data.current_price?.usd || 0;
              const key = investedDatastore.key(['invested_cryptos', `${userEmail}_${coinId}`]);
              const entity = {
                  key: key,
                  data: {
                      ...coin,
                      current_price: currentPrice,
                      last_updated: new Date()
                  }
              };
              try {
                  await investedDatastore.save(entity);
                  console.log(`Updated current price for ${coinId} for user ${userEmail} in invested cryptos`);
              } catch (saveError) {
                  console.error(`Error saving to invested Datastore for ${coinId} for user ${userEmail}:`, saveError);
              }

          } catch (analysisError) {
              console.error(`Error updating ${coinId} for user ${userEmail} in invested cryptos:`, analysisError);
          }
      }

      return {
          userEmail,
          status: 'success',
          coinsUpdated: coins.length
      };
  } catch (error) {
      console.error(`Error in updateInvestedCryptoValuesForUser for ${userEmail}:`, error);
      return {
          userEmail,
          status: 'error',
          message: error.message
      };
  }
}

// Main handler for scheduler - updates all invested users
export const updateAllInvestedUsersCoins = async (req, res) => {
  try {
      // First verify if this is an authorized request from Cloud Scheduler
      const authHeader = req.headers.authorization;
      try {
          const payload = await verifyOidcToken(authHeader);
          if (!payload.email.endsWith('.iam.gserviceaccount.com')) {
              return res.status(403).json({
                  message: 'Only service accounts can call this endpoint'
              });
          }
          console.log("Scheduler authenticated successfully:", payload.email);
      } catch (authError) {
          console.error("Scheduler authentication failed:", authError);
          return res.status(401).json({
              message: 'Unauthorized access to scheduler endpoint'
          });
      }

      // Get all unique users who have invested coins
      console.log("Fetching all users with invested coins...");
      const query = investedDatastore.createQuery('invested_cryptos').select('userEmail');
      const [results] = await investedDatastore.runQuery(query);
      const userEmails = [...new Set(results.map(coin => coin.userEmail))];
      console.log(`Found ${userEmails.length} users with invested coins`);

      if (userEmails.length === 0) {
          return res.status(200).json({
              message: 'No users with invested coins found',
              usersProcessed: 0
          });
      }

      const updateResults = [];
      for (const email of userEmails) {
          const result = await updateInvestedCryptoValuesForUser(email);
          updateResults.push(result);
          await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return res.status(200).json({
          message: 'Invested crypto update completed for all users',
          usersProcessed: userEmails.length,
          results: updateResults
      });
  } catch (error) {
      console.error('Error in updateAllInvestedUsersCoins:', error);
      return res.status(500).json({
          message: 'Failed to update invested crypto values for all users',
          error: error.message
      });
  }
};

export default {
  saveCoin,
  getUserCoins,
  updateCryptoValues,
  triggerCryptoUpdate,
  updateAllUsersCoins,
  saveInvestedCrypto
};