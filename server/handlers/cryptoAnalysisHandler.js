import { Storage } from '@google-cloud/storage';
import 'dotenv/config'

const storage = new Storage({
  projectId: 'lunex-452314',
  keyFilename: process.env.GCP_KEY_FILE
});

async function downloadFile(bucketName, fileName) {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);
  
  const [fileContent] = await file.download();
  return fileContent.toString();
}

export const getCryptoBigQueryAnalysis = async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    if (!userEmail) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Fetch analysis results from GCS bucket
    const bucketName = process.env.GCP_ANALYSIS_BUCKET_ID;
    
    // Load all JSON files
    const riskProfileFile = await downloadFile(bucketName, 'risk_profile_analysis.json');
    const correlationFile = await downloadFile(bucketName, 'correlation_analysis.json');
    const performanceFile = await downloadFile(bucketName, 'performance_analysis.json');
    const marketCapFile = await downloadFile(bucketName, 'market_cap_exposure.json');
    const trendingFile = await downloadFile(bucketName, 'trending_analysis.json');
    const coinPerformanceFile = await downloadFile(bucketName, 'individual_coin_performance_insights.json');
    const durationFile = await downloadFile(bucketName, 'save_duration_analysis.json');
    const combinedScoringFile = await downloadFile(bucketName, 'combined_scoring_system.json');
    
    // Parse JSON files
    const riskProfiles = JSON.parse(riskProfileFile);
    const correlations = JSON.parse(correlationFile);
    const performances = JSON.parse(performanceFile);
    const marketCaps = JSON.parse(marketCapFile);
    const trendingData = JSON.parse(trendingFile);
    const coinPerformances = JSON.parse(coinPerformanceFile);
    const durations = JSON.parse(durationFile);
    const combinedScoring = JSON.parse(combinedScoringFile);
    
    // Get user-specific data
    const userRiskProfile = riskProfiles.find(item => item.userEmail === userEmail) || {};
    const userPerformance = performances.find(item => item.userEmail === userEmail) || {};
    const userMarketCap = marketCaps.find(item => item.userEmail === userEmail) || {};
    const userTrending = trendingData.find(item => item.userEmail === userEmail) || {};
    
    // Get all coins for this user
    const userCoins = combinedScoring.filter(item => item.userEmail === userEmail);
    
    // Enrich coin data with additional metrics
    const enrichedCoins = userCoins.map(coin => {
      const performanceData = coinPerformances.find(
        item => item.userEmail === userEmail && item.id === coin.id
      ) || {};
      
      const durationData = durations.find(
        item => item.userEmail === userEmail && item.id === coin.id
      ) || {};
      
      return {
        ...coin,
        ...performanceData,
        ...durationData
      };
    });
    
    const analysisResult = {
      portfolio: {
        riskProfile: userRiskProfile,
        performance: userPerformance,
        marketCap: userMarketCap,
        trending: userTrending
      },
      coins: enrichedCoins
    };
    
    return res.status(200).json(analysisResult);
    
  } catch (error) {
    console.error('Error fetching crypto analysis:', error);
    return res.status(500).json({ error: 'Failed to retrieve analysis data' });
  }
};