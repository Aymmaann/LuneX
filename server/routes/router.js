import express from 'express';
import { googleLogin } from '../controllers/authController.js';
import { 
  saveCoin, 
  getUserCoins, 
  updateCryptoValues, 
  triggerCryptoUpdate,
  updateAllUsersCoins
} from "../controllers/coinController.js";
import { exportAllQueries } from '../utils/exportAnalysis.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getCryptoBigQueryAnalysis } from '../handlers/cryptoAnalysisHandler.js';

const router = express.Router();

router.get("/test", (req,res) => {
    res.send('Passed the test');
});

router.get('/google', googleLogin);
router.post('/save-coin', saveCoin);
router.get('/saved-coins', getUserCoins);
router.post('/update-crypto-values', updateCryptoValues);
router.get('/api/trigger-crypto-update', triggerCryptoUpdate);
router.get('/api/update-all-users', updateAllUsersCoins);

router.get('/api/crypto-analysis', authMiddleware, getCryptoBigQueryAnalysis);

router.post('/api/export/crypto-analytics', async(req,res) => {
  try {
    await exportAllQueries()
    res.status(200).json({ message: 'Export Complete' })
  } catch(error) {
    console.error('Export failed:', error.message);
    res.status(500).json({ error: 'Export failed' });
  }
})

export default router;