// import express from 'express';
// import { googleLogin } from '../controllers/authController.js';
// import { 
//   saveCoin, 
//   getUserCoins, 
//   updateCryptoValues, 
//   triggerCryptoUpdate,
//   updateAllUsersCoins
// } from "../controllers/coinController.js";
// import { exportAllQueries } from '../utils/exportAnalysis.js';
// import { authMiddleware } from '../middleware/authMiddleware.js';
// import { getCryptoBigQueryAnalysis } from '../handlers/cryptoAnalysisHandler.js';
// import { google } from 'googleapis';
// import { GoogleAuth } from 'google-auth-library';

// const projectId = process.env.GCP_PROJECT_ID;
// const exportBucketName = process.env.GCP_DATASTORE_TO_GCS_BUCKET_ID;

// const auth = new GoogleAuth({
//   scopes: ['https://www.googleapis.com/auth/datastore']
// });

// const datastoreAPI = google.datastore({
//   version: 'v1',
//   auth
// });

// const router = express.Router();

// router.get("/test", (req,res) => {
//     res.send('Passed the test');
// });

// router.get('/google', googleLogin);
// router.post('/save-coin', saveCoin);
// router.get('/saved-coins', getUserCoins);
// router.post('/update-crypto-values', updateCryptoValues);
// router.get('/api/trigger-crypto-update', triggerCryptoUpdate);
// router.get('/api/update-all-users', updateAllUsersCoins);

// router.get('/api/crypto-analysis', authMiddleware, getCryptoBigQueryAnalysis);

// router.post('/api/export/crypto-analytics', async(req,res) => {
//   try {
//     await exportAllQueries()
//     res.status(200).json({ message: 'Export Complete' })
//   } catch(error) {
//     console.error('Export failed:', error.message);
//     res.status(500).json({ error: 'Export failed' });
//   }
// })

// router.post('/api/export-datastore', async (req, res) => {
//   console.log('Project ID:', projectId);
//   try {
//     if (!exportBucketName) {
//       return res.status(500).json({ error: 'GCP_DATASTORE_TO_GCS_BUCKET_ID not set.' });
//     }

//     // Build timestamp folder name like "2025-04-05T17:24:29_79290"
//     const now = new Date();
//     const isoTimestamp = now.toISOString().split('.')[0]; // remove milliseconds
//     const randomSuffix = Math.floor(Math.random() * 100000); // add random suffix to mimic GCP's default
//     const folderName = `${isoTimestamp.replace(/:/g, '-')}_${randomSuffix}`;
//     const outputUri = `gs://${exportBucketName}/${folderName}`;

//     console.log(`Exporting Datastore to: ${outputUri}`);

//     const exportRequest = {
//       projectId,
//       requestBody: {
//         outputUrlPrefix: outputUri,
//         entityFilter: {
//           kinds: ['UserCoin']
//         }
//       }
//     };

//     const response = await datastoreAPI.projects.export(exportRequest);

//     res.status(202).json({
//       message: 'Datastore export started.',
//       exportFolder: folderName,
//       gcsPath: outputUri,
//       operation: response.data.name
//     });
//   } catch (error) {
//     console.error('Datastore export failed:', error.message);
//     res.status(500).json({ error: 'Datastore export failed: ' + error.message });
//   }
// });


// export default router;
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
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

const exportBucketName = process.env.GCP_DATASTORE_TO_GCS_BUCKET_ID;
const configuredProjectId = process.env.GCP_PROJECT_ID;

const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/datastore', 'https://www.googleapis.com/auth/cloud-platform']
});

const router = express.Router();

const datastoreAPI = google.datastore({
  version: 'v1',
  auth
});

router.get("/test", (req, res) => {
  res.send('Passed the test');
});

router.get('/google', googleLogin);
router.post('/save-coin', saveCoin);
router.get('/saved-coins', getUserCoins);
router.post('/update-crypto-values', updateCryptoValues);
router.get('/api/trigger-crypto-update', triggerCryptoUpdate);
router.get('/api/update-all-users', updateAllUsersCoins);

router.get('/api/crypto-analysis', authMiddleware, getCryptoBigQueryAnalysis);

router.post('/api/export/crypto-analytics', async (req, res) => {
  try {
    await exportAllQueries();
    res.status(200).json({ message: 'Export Complete' });
  } catch (error) {
    console.error('Export failed:', error.message);
    res.status(500).json({ error: 'Export failed' });
  }
});

router.post('/api/export-datastore', async (req, res) => {
  try {
    if (!exportBucketName) {
      return res.status(500).json({ error: 'GCP_DATASTORE_TO_GCS_BUCKET_ID not set.' });
    }

    const client = await auth.getClient();
    const resolvedProjectId = await auth.getProjectId();

    // Debug logs
    console.log('Configured PROJECT_ID:', configuredProjectId);
    console.log('Resolved (auth) PROJECT_ID:', resolvedProjectId);
    console.log('Service account in use:', client.email || 'Unknown');

    const usedProjectId = configuredProjectId || resolvedProjectId;

    // Create folder like "2025-04-20T11:36:06_88898"
    const now = new Date();
    const isoTimestamp = now.toISOString().split('.')[0];
    const randomSuffix = Math.floor(Math.random() * 100000);
    const folderName = `${isoTimestamp.replace(/:/g, '-')}_${randomSuffix}`;
    const outputUri = `gs://${exportBucketName}/${folderName}`;

    console.log(`Exporting Datastore to: ${outputUri}`);

    const exportRequest = {
      projectId: usedProjectId,
      requestBody: {
        outputUrlPrefix: outputUri,
        entityFilter: {
          kinds: ['UserCoin']
        }
      }
    };

    const response = await datastoreAPI.projects.export(exportRequest);

    res.status(202).json({
      message: 'Datastore export started.',
      exportFolder: folderName,
      gcsPath: outputUri,
      operation: response.data.name
    });

  } catch (error) {
    console.error('Datastore export failed:', error.message);
    res.status(500).json({ error: 'Datastore export failed: ' + error.message });
  }
});

export default router;
