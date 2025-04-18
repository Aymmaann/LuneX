import React from 'react'
import assets from '../assets/assets';

const PortfolioSummary = ({ data }) => {
    const { riskProfile, performance, marketCap, trending } = data;
  
    const getPerformanceClass = (value) => {
      if (value > 5) return 'text-green-500';
      if (value > 0) return 'text-green-400';
      if (value > -5) return 'text-yellow-400';
      return 'text-red-400';
    };
    
    // Get performance label for context
    const getPerformanceLabel = (value) => {
      if (value > 10) return "Excellent";
      if (value > 5) return "Good";
      if (value > 0) return "Positive";
      if (value > -5) return "Slight Loss";
      return "Poor";
    };
    
    // Get risk label for context
    const getRiskLabel = (score) => {
      if (score < 3) return "Very Low";
      if (score < 5) return "Low";
      if (score < 7) return "Moderate";
      if (score < 9) return "High";
      return "Very High";
    };
    
    // Interpret Sharpe ratio
    const getSharpeInterpretation = (value) => {
      if (value > 2) return "Excellent";
      if (value > 1) return "Good";
      if (value > 0.5) return "Average";
      if (value > 0) return "Below Average";
      return "Poor";
    };
  
    return (
      <div className="mx-4 mt-4 bg-darkBlue rounded-xl overflow-hidden border border-gray-800">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-medium">Monitored Assets</h2>
          <div className="flex items-center bg-blue-900 bg-opacity-30 px-3 py-1 rounded-md">
            <assets.IoAnalyticsOutline className="mr-2 text-blue-400" />
            <span className="text-sm text-blue-300">Your Portfolio Health: {
              performance?.avg_price_change > 5 ? "Excellent" :
              performance?.avg_price_change > 0 ? "Good" :
              performance?.avg_price_change > -5 ? "Moderate" : "Needs Attention"
            }</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Risk Profile - More explanatory */}
          <div className="bg-gray-900 bg-opacity-50 rounded-xl p-4">
            <h3 className="text-sm text-zinc-400 mb-3 flex items-center">
              <assets.IoShieldCheckmarkOutline className="mr-2" /> Risk Assessment
            </h3>
            
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-zinc-500">Average Risk Score</p>
                <p className="text-xs text-zinc-400">{getRiskLabel(riskProfile?.avg_risk_score || 5)}</p>
              </div>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      (riskProfile?.avg_risk_score || 5) < 5 ? 'bg-green-500' : 
                      (riskProfile?.avg_risk_score || 5) < 7 ? 'bg-blue-400' : 
                      (riskProfile?.avg_risk_score || 5) < 8 ? 'bg-yellow-400' : 
                      'bg-red-400'
                    }`}
                    style={{ width: `${Math.min((riskProfile?.avg_risk_score || 5) * 10, 100)}%` }}
                  ></div>
                </div>
                <p className="ml-2 text-sm font-medium">{riskProfile?.avg_risk_score?.toFixed(1) || '5.0'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded-md">
                <p className="text-xs text-zinc-500">Risk Diversity</p>
                <p className="text-lg font-medium">{riskProfile?.risk_score_diversity?.toFixed(2) || 'N/A'}</p>
                <p className="text-xs text-zinc-400">
                  {(riskProfile?.risk_score_diversity || 0) > 1.5 ? "Well Diversified" : 
                   (riskProfile?.risk_score_diversity || 0) > 1 ? "Moderately Diversified" : 
                   "Low Diversity"}
                </p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded-md">
                <p className="text-xs text-zinc-500">High Risk Assets</p>
                <p className="text-lg font-medium">{riskProfile?.high_risk_concentration || '0'}%</p>
                <p className="text-xs text-zinc-400">
                  {(riskProfile?.high_risk_concentration || 0) > 50 ? "Very High Concentration" : 
                   (riskProfile?.high_risk_concentration || 0) > 30 ? "High Concentration" : 
                   (riskProfile?.high_risk_concentration || 0) > 10 ? "Moderate Concentration" : 
                   "Low Concentration"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Performance Metrics - More explanatory */}
          <div className="bg-gray-900 bg-opacity-50 rounded-xl p-4">
            <h3 className="text-sm text-zinc-400 mb-3 flex items-center">
              <assets.IoStatsChartOutline className="mr-2" /> Performance Metrics
            </h3>
            
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-zinc-500">Average Price Change</p>
                <p className="text-xs text-zinc-400">{getPerformanceLabel(performance?.avg_price_change || 0)}</p>
              </div>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getPerformanceClass(performance?.avg_price_change || 0)}`}
                    style={{ width: `${Math.min(((performance?.avg_price_change || 0) + 10) * 5, 100)}%` }}
                  ></div>
                </div>
                <p className={`ml-2 text-sm font-medium ${getPerformanceClass(performance?.avg_price_change || 0)}`}>
                  {performance?.avg_price_change > 0 ? '+' : ''}
                  {performance?.avg_price_change?.toFixed(2) || '0.00'}%
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded-md">
                <p className="text-xs text-zinc-500">Sharpe Ratio</p>
                <p className="text-lg font-medium">{performance?.sharpe_ratio_approx?.toFixed(2) || 'N/A'}</p>
                <p className="text-xs text-zinc-400">
                  {getSharpeInterpretation(performance?.sharpe_ratio_approx || 0)}
                  <span className="block italic">(Risk-adjusted return)</span>
                </p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded-md">
                <p className="text-xs text-zinc-500">30d Projection</p>
                <p className={`text-lg font-medium ${getPerformanceClass(performance?.projected_30d_return || 0)}`}>
                  {performance?.projected_30d_return > 0 ? '+' : ''}
                  {performance?.projected_30d_return?.toFixed(2) || '0.00'}%
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Market Cap Exposure - Improved visualization */}
          <div className="bg-gray-900 bg-opacity-50 rounded-xl p-4">
            <h3 className="text-sm text-zinc-400 mb-3 flex items-center">
              <assets.IoPieChartOutline className="mr-2" /> Market Cap Distribution
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded-md">
                <p className="text-xs text-zinc-500">Average Market Cap</p>
                <p className="text-lg font-medium">
                  ${(marketCap?.avg_market_cap / 1e9).toFixed(2) || '0'} B
                </p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded-md">
                <p className="text-xs text-zinc-500">Investment Focus</p>
                <p className="text-lg font-medium">{marketCap?.investment_style || 'Balanced'}</p>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Cap Size Distribution:</span>
              </div>
              
              {/* Visual distribution with labels */}
              <div className="flex mt-2">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-xs">Large Cap</p>
                    <p className="text-xs font-medium">{marketCap?.large_cap_percentage || '0'}%</p>
                  </div>
                  <div className="w-full h-5 bg-gray-800 rounded-md overflow-hidden mt-1">
                    <div 
                      className="h-full bg-blue-500 flex items-center justify-center" 
                      style={{ width: `${marketCap?.large_cap_percentage || 0}%` }} 
                    >
                      {marketCap?.large_cap_percentage >= 10 && 
                        <span className="text-xs text-white font-medium">Large</span>
                      }
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex mt-2">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-xs">Mid Cap</p>
                    <p className="text-xs font-medium">{marketCap?.mid_cap_percentage || '0'}%</p>
                  </div>
                  <div className="w-full h-5 bg-gray-800 rounded-md overflow-hidden mt-1">
                    <div 
                      className="h-full bg-green-500 flex items-center justify-center" 
                      style={{ width: `${marketCap?.mid_cap_percentage || 0}%` }} 
                    >
                      {marketCap?.mid_cap_percentage >= 10 && 
                        <span className="text-xs text-white font-medium">Mid</span>
                      }
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex mt-2">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-xs">Small Cap</p>
                    <p className="text-xs font-medium">{marketCap?.small_cap_percentage || '0'}%</p>
                  </div>
                  <div className="w-full h-5 bg-gray-800 rounded-md overflow-hidden mt-1">
                    <div 
                      className="h-full bg-yellow-500 flex items-center justify-center" 
                      style={{ width: `${marketCap?.small_cap_percentage || 0}%` }} 
                    >
                      {marketCap?.small_cap_percentage >= 10 && 
                        <span className="text-xs text-white font-medium">Small</span>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Market Timing - More explanatory */}
          <div className="bg-gray-900 bg-opacity-50 rounded-xl p-4">
            <h3 className="text-sm text-zinc-400 mb-3 flex items-center">
              <assets.IoTimeOutline className="mr-2" /> Market Sentiment Analysis
            </h3>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <p className="text-xs text-zinc-500">Market Sentiment Score</p>
                <p className="text-xs text-zinc-400">
                  {(trending?.sentiment_score || 0) > 7 ? "Very Bullish" :
                   (trending?.sentiment_score || 0) > 5 ? "Bullish" :
                   (trending?.sentiment_score || 0) > 4 ? "Neutral" :
                   (trending?.sentiment_score || 0) > 3 ? "Bearish" : "Very Bearish"}
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      (trending?.sentiment_score || 5) > 7 ? 'bg-green-500' : 
                      (trending?.sentiment_score || 5) > 5 ? 'bg-green-400' : 
                      (trending?.sentiment_score || 5) > 4 ? 'bg-yellow-400' : 
                      'bg-red-400'
                    }`}
                    style={{ width: `${Math.min((trending?.sentiment_score || 5) * 10, 100)}%` }}
                  ></div>
                </div>
                <p className="ml-2 text-sm font-medium">{trending?.sentiment_score?.toFixed(1) || '5.0'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded-md">
                <p className="text-xs text-zinc-500">Market Trend</p>
                <p className={`text-lg font-medium ${
                  trending?.market_trend === 'Bullish' ? 'text-green-500' :
                  trending?.market_trend === 'Bearish' ? 'text-red-400' : 'text-zinc-300'
                }`}>
                  {trending?.market_trend || 'Neutral'}
                </p>
                <p className="text-xs text-zinc-400">
                  {trending?.trend_strength || 'Moderate'} Momentum
                </p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded-md">
                <p className="text-xs text-zinc-500">Fear & Greed</p>
                <p className={`text-lg font-medium ${
                  (trending?.fear_greed_index || 50) > 70 ? 'text-green-500' :
                  (trending?.fear_greed_index || 50) > 50 ? 'text-green-400' :
                  (trending?.fear_greed_index || 50) > 30 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {trending?.fear_greed_index || 50}
                </p>
                <p className="text-xs text-zinc-400">
                  {(trending?.fear_greed_index || 50) > 70 ? 'Extreme Greed' :
                   (trending?.fear_greed_index || 50) > 50 ? 'Greed' :
                   (trending?.fear_greed_index || 50) > 30 ? 'Fear' : 'Extreme Fear'}
                </p>
              </div>
            </div>
            
            {/* Trending Assets */}
            {trending?.trending_assets && trending.trending_assets.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-zinc-500 mb-2">Market Trends (Top Assets)</p>
                <div className="flex flex-wrap gap-2">
                  {trending.trending_assets.map((asset, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center text-xs px-2 py-1 rounded-full ${
                        asset.trending_direction === 'up' ? 'bg-green-900 bg-opacity-30 text-green-400' : 
                        'bg-red-900 bg-opacity-30 text-red-400'
                      }`}
                    >
                      {asset.symbol}
                      {asset.trending_direction === 'up' ? 
                        <assets.IoArrowUpOutline className="ml-1" /> : 
                        <assets.IoArrowDownOutline className="ml-1" />
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Recommendations - New section */}
        {data.recommendations && (
          <div className="p-4 border-t border-gray-800">
            <h3 className="text-sm text-zinc-400 mb-3 flex items-center">
              <assets.IoFlashOutline className="mr-2" /> Portfolio Recommendations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Risk Management */}
              {data.recommendations.risk_management && (
                <div className="bg-gray-900 bg-opacity-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-900 bg-opacity-40 flex items-center justify-center">
                      <assets.IoShieldOutline className="text-blue-400" />
                    </div>
                    <h4 className="font-medium">Risk Management</h4>
                  </div>
                  <p className="text-sm text-zinc-400">{data.recommendations.risk_management}</p>
                </div>
              )}
              
              {/* Diversification */}
              {data.recommendations.diversification && (
                <div className="bg-gray-900 bg-opacity-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-900 bg-opacity-40 flex items-center justify-center">
                      <assets.IoGridOutline className="text-green-400" />
                    </div>
                    <h4 className="font-medium">Diversification Strategy</h4>
                  </div>
                  <p className="text-sm text-zinc-400">{data.recommendations.diversification}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
}

export default PortfolioSummary