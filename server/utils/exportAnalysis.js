import { BigQuery } from '@google-cloud/bigquery';
import { Storage } from '@google-cloud/storage';
import "dotenv/config";

const projectId = process.env.GCP_PROJECT_ID;
const datasetId = process.env.GCP_BIGQUERY_ID_SAVED_CRYPTO;
const bucketName = process.env.GCP_ANALYSIS_BUCKET_ID;

const bigquery = new BigQuery({ projectId });

const storage = new Storage({ projectId });

const queries = [
  {
    name: 'risk_profile_analysis',
    query: `
    SELECT
        userEmail,
        COUNT(*) AS coins_saved,
        AVG(CAST(risk_score AS FLOAT64)) AS avg_risk_score,
        AVG(CAST(volatility_score AS FLOAT64)) AS avg_volatility,
        STDDEV(CAST(risk_score AS FLOAT64)) AS risk_score_diversity,
        MAX(CAST(risk_score AS FLOAT64)) AS highest_risk_asset,
        MIN(CAST(risk_score AS FLOAT64)) AS lowest_risk_asset,
        SUM(CASE WHEN prediction = 'Bearish' THEN 1 ELSE 0 END) / COUNT(*) * 100 AS bearish_percentage,
        -- Risk concentration calculation - how much of the portfolio is in high-risk assets
        SUM(CASE WHEN CAST(risk_score AS FLOAT64) >= 6 THEN 1 ELSE 0 END) / COUNT(*) * 100 AS high_risk_concentration
    FROM
        ${projectId}.${datasetId}.saved_crypto_table
    GROUP BY
        userEmail
    ORDER BY
        avg_risk_score DESC;
    `
  },
  {
    name: 'correlation_analysis',
    query: `
      WITH user_coins AS (
        SELECT 
            userEmail,
            ARRAY_AGG(STRUCT(id, name, symbol, price_change_percentage, current_price)) AS coins
        FROM
            ${projectId}.${datasetId}.saved_crypto_table
        GROUP BY 
            userEmail
      )
      SELECT
        uc.userEmail,
        (SELECT COUNT(*) FROM UNNEST(uc.coins) WHERE price_change_percentage > 0) / ARRAY_LENGTH(uc.coins) * 100 AS percentage_positive_performing,
        
        -- Correlation indicator - if too many coins move in the same direction, it suggests low diversification
        CASE
            WHEN ABS((SELECT COUNT(*) FROM UNNEST(uc.coins) WHERE price_change_percentage > 0) / ARRAY_LENGTH(uc.coins) * 100 - 50) > 40 THEN 'Highly Correlated Portfolio'
            WHEN ABS((SELECT COUNT(*) FROM UNNEST(uc.coins) WHERE price_change_percentage > 0) / ARRAY_LENGTH(uc.coins) * 100 - 50) > 25 THEN 'Moderately Correlated Portfolio'
            ELSE 'Well Diversified Portfolio'
        END AS portfolio_correlation_assessment,

        -- Standard deviation of price changes indicates how similar the coins move
        (SELECT STDDEV(price_change_percentage) FROM UNNEST(uc.coins)) AS price_movement_deviation,

        -- Check if Bitcoin/major coin is in portfolio
        (SELECT COUNT(*) > 0 FROM UNNEST(uc.coins) WHERE id IN ('bitcoin', 'ethereum')) AS has_major_coins

        FROM
            user_coins uc;
    `
  },
  {
    name: 'performance_analysis',
    query: `
      SELECT
        userEmail,
        AVG(price_change_percentage) AS avg_price_change,
        AVG(price_change_percentage) / NULLIF(AVG(CAST(risk_score AS FLOAT64)), 0) AS sharpe_ratio_approx,
        AVG(price_change_percentage) / NULLIF(AVG(CAST(volatility_score AS FLOAT64)), 0) AS return_per_volatility,

        -- Performance categories
        CASE
            WHEN AVG(price_change_percentage) > 5 
                AND AVG(price_change_percentage) / NULLIF(AVG(CAST(risk_score AS FLOAT64)), 0) > 1 THEN 'High Performer'
            WHEN AVG(price_change_percentage) > 0 THEN 'Moderate Performer'
            ELSE 'Underperformer'
        END AS performance_category,

        -- Expected 30-day return based on current performance (simplified projection)
        AVG(price_change_percentage) * 30 / 1.5 AS projected_30d_return
      FROM
        ${projectId}.${datasetId}.saved_crypto_table
      GROUP BY
        userEmail
      ORDER BY
        sharpe_ratio_approx DESC;
    `
  },
  {
    name: 'market_cap_exposure',
    query: `
      SELECT
        userEmail,
        AVG(CAST(market_cap AS FLOAT64)) AS avg_market_cap,

        -- Market cap classification
        SUM(CASE 
            WHEN CAST(market_cap AS FLOAT64) > 10000000000 THEN 1 
            ELSE 0 
        END) / COUNT(*) * 100 AS large_cap_percentage,

        SUM(CASE 
            WHEN CAST(market_cap AS FLOAT64) BETWEEN 1000000000 AND 10000000000 THEN 1 
            ELSE 0 
        END) / COUNT(*) * 100 AS mid_cap_percentage,

        SUM(CASE 
            WHEN CAST(market_cap AS FLOAT64) < 1000000000 THEN 1 
            ELSE 0 
        END) / COUNT(*) * 100 AS small_cap_percentage,

        -- Investment style classification
        CASE
            WHEN SUM(CASE WHEN CAST(market_cap AS FLOAT64) > 10000000000 THEN 1 ELSE 0 END) / COUNT(*) > 0.7
            THEN 'Conservative Large Cap Focus'
            WHEN SUM(CASE WHEN CAST(market_cap AS FLOAT64) < 1000000000 THEN 1 ELSE 0 END) / COUNT(*) > 0.5
            THEN 'Aggressive Small Cap Focus'
            ELSE 'Balanced Approach'
        END AS investment_style
      FROM
        ${projectId}.${datasetId}.saved_crypto_table
      GROUP BY
        userEmail;
    `
  },
  {
    name: 'trending_analysis',
    query: `
      SELECT
        userEmail,

        -- Bearish/Bullish alignment
        SUM(CASE WHEN prediction = 'Bearish' THEN 1 ELSE 0 END) / COUNT(*) * 100 AS bearish_holdings_pct,

        -- Overall sentiment score (-100 to 100 scale)
        SUM(CASE 
            WHEN prediction = 'Bearish' THEN -1 
            WHEN prediction = 'Bullish' THEN 1 
            ELSE 0 
        END) / COUNT(*) * 100 AS sentiment_score,

        -- Market timing score
        AVG(price_change_percentage) AS timing_performance,

        -- Timing assessment category
        CASE
            WHEN AVG(price_change_percentage) > 5 THEN 'Excellent Timing'
            WHEN AVG(price_change_percentage) > 0 THEN 'Good Timing'
            WHEN AVG(price_change_percentage) > -5 THEN 'Average Timing'
            ELSE 'Poor Timing'
        END AS market_timing_assessment
      FROM
        ${projectId}.${datasetId}.saved_crypto_table
      GROUP BY
        userEmail
      ORDER BY
        timing_performance DESC;
    `
  },
  {
    name: 'individual_coin_performance_insights',
    query: `
      SELECT
        userEmail,
        id,
        name,
        symbol,
        current_price AS current_price,  -- Updated field name here
        price_change_percentage,
        -- Calculate z-score (how many standard deviations from the mean)
        (price_change_percentage - 
            (SELECT AVG(price_change_percentage) FROM ${projectId}.${datasetId}.saved_crypto_table)) /
            (SELECT STDDEV(price_change_percentage) FROM ${projectId}.${datasetId}.saved_crypto_table) AS market_outperformance_zscore,
        -- Risk-adjusted return
        price_change_percentage / NULLIF(risk_score, 0) AS risk_adjusted_return,
        -- Performance categorization 
        CASE
            WHEN price_change_percentage > 5 THEN 'Strong Performer'
            WHEN price_change_percentage > 0 THEN 'Moderate Performer'
            WHEN price_change_percentage > -5 THEN 'Slight Underperformer'
            ELSE 'Weak Performer'
        END AS performance_category
      FROM
        ${projectId}.${datasetId}.saved_crypto_table
      ORDER BY
        userEmail, risk_adjusted_return DESC;
    `
  },
  {
    name: 'save_duration_analysis',
    query: `
      SELECT
        userEmail,
        id,
        name,
        symbol,
        TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), savedAt, DAY) AS days_since_saved,
        price_change_percentage,
        -- Duration categories
        CASE
            WHEN TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), savedAt, DAY) > 30 THEN 'Long-term Monitor'
            WHEN TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), savedAt, DAY) > 7 THEN 'Medium-term Monitor'
            ELSE 'Recent Addition'
        END AS monitoring_duration,
        -- Performance per day (simple calculation)
        price_change_percentage / NULLIF(TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), savedAt, DAY), 0) AS daily_performance
      FROM
        ${projectId}.${datasetId}.saved_crypto_table
      WHERE
        -- Ensure we exclude records where the save date is today (to avoid dividing by 0)
        TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), savedAt, DAY) > 0
      ORDER BY
        userEmail, days_since_saved DESC;
    `
  },
  {
    name: 'combined_scoring_system',
    query: `
      SELECT
        userEmail,
        id,
        name,
        symbol,
        current_price,
        risk_score,
        volatility_score,
        price_change_percentage,
        -- Combined score calculation (higher is better)
        price_change_percentage / NULLIF(risk_score, 0) * 2 + 
        (10 - risk_score) + 
        (CASE WHEN prediction != 'Bearish' THEN 5 ELSE 0 END) AS investment_score,
        -- Recommendation based on score
        CASE
            WHEN price_change_percentage / NULLIF(risk_score, 0) * 2 + (10 - risk_score) + (CASE WHEN prediction != 'Bearish' THEN 5 ELSE 0 END) > 10 THEN 'Strong Buy'
            WHEN price_change_percentage / NULLIF(risk_score, 0) * 2 + (10 - risk_score) + (CASE WHEN prediction != 'Bearish' THEN 5 ELSE 0 END) > 5 THEN 'Buy'
            WHEN price_change_percentage / NULLIF(risk_score, 0) * 2 + (10 - risk_score) + (CASE WHEN prediction != 'Bearish' THEN 5 ELSE 0 END) > 0 THEN 'Hold'
            ELSE 'Consider Selling'
        END AS recommendation
      FROM
        ${projectId}.${datasetId}.saved_crypto_table
      ORDER BY
        userEmail, investment_score DESC;
    `
  },
];


export const exportAllQueries = async () => {
  for (const q of queries) {
    try {
      const [rows] = await bigquery.query(q.query);
      const jsonData = JSON.stringify(rows, null, 2);

      await storage.bucket(bucketName).file(`${q.name}.json`).save(jsonData, {
        contentType: 'application/json',
      });

      console.log(`Exported ${q.name} to GCS`);
    } catch (error) {
      console.error(`Error exporting ${q.name}:`, error.message);
    }
  }
};
