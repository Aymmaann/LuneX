import express from 'express';
import { googleLogin } from '../controllers/authController.js';
import { saveCoin, getUserCoins, updateCryptoValues, triggerCryptoUpdate } from "../controllers/coinController.js"

const router = express.Router();

router.get("/test", (req,res) => {
    res.send('Passed the test')
})

router.get('/google', googleLogin)

router.post('/save-coin', saveCoin);
router.get('/saved-coins', getUserCoins);
router.post('/update-crypto-values', updateCryptoValues);
router.get('/api/trigger-crypto-update', triggerCryptoUpdate);

export default router;