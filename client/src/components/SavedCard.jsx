import React, { memo, useState } from 'react';
import assets from '../assets/assets';

const SavedCard = ({ crypto }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Enhanced helper functions for more intuitive formatting and styling
  const getRecommendationClass = (rec) => {
    switch(rec) {
      case 'Strong Buy': return 'text-green-500 font-medium';
      case 'Buy': return 'text-green-400';
      case 'Hold': return 'text-yellow-400';
      case 'Sell': return 'text-red-400';
      default: return 'text-zinc-300';
    }
  };
  
  const getPerformanceClass = (category) => {
    switch(category) {
      case 'Strong Performer': return 'text-green-500';
      case 'Moderate Performer': return 'text-blue-400';
      case 'Slight Underperformer': return 'text-yellow-400';
      case 'Underperformer': return 'text-red-400';
      default: return 'text-zinc-300';
    }
  };
  
  // Enhanced price formatting for better readability
  const formatPrice = () => {
    if (crypto.current_price) {
      if (crypto.current_price.float !== null) {
        return crypto.current_price.float < 1 ? 
          crypto.current_price.float.toFixed(crypto.current_price.float < 0.01 ? 6 : 2) : 
          new Intl.NumberFormat('en-US').format(crypto.current_price.float.toFixed(2));
      } else if (crypto.current_price.integer !== null) {
        return new Intl.NumberFormat('en-US').format(crypto.current_price.integer);
      }
    }
    return 'N/A';
  };
  
  // Format large numbers with K, M, B suffixes
  const formatLargeNumber = (num, prefix = '') => {
    if (num === undefined || num === null) return 'N/A';
    
    if (num >= 1e9) return `${prefix}${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${prefix}${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${prefix}${(num / 1e3).toFixed(2)}K`;
    return `${prefix}${num.toFixed(2)}`;
  };
  
  // Add explanation for risk score
  const getRiskExplanation = (score) => {
    if (score < 3) return "Very Low Risk";
    if (score < 5) return "Low Risk";
    if (score < 7) return "Moderate Risk";
    if (score < 9) return "High Risk";
    return "Very High Risk";
  };

  const getDaysExplanation = (days) => {
    if (days < 10) return "Newly monitored";
    if (days < 20) return "Monitored for a bit";
    if (days < 30) return "Actively monitored";
    if (days < 40) return "Closely tracked";
    return "Long-term watch";
  };
  
  

  return (
    <div>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div className='flex gap-3 items-center'>
          <div className="w-[30px] h-[30px] bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold uppercase">{crypto.symbol.charAt(0)}</span>
          </div>
          <div>
            <p className='text-sm font-light'>{crypto.name} ({crypto.symbol.toUpperCase()})</p>
            {crypto.performance_category && (
              <p className={`text-xs ${getPerformanceClass(crypto.performance_category)}`}>
                {crypto.performance_category}
              </p>
            )}
          </div>
        </div>
        
        {crypto.recommendation && (
          <div className={`text-sm rounded-md px-2 py-1 ${
            crypto.recommendation === 'Strong Buy' ? 'bg-green-900 bg-opacity-40' : 
            crypto.recommendation === 'Buy' ? 'bg-green-800 bg-opacity-30' : 
            crypto.recommendation === 'Hold' ? 'bg-yellow-800 bg-opacity-30' : 
            'bg-red-900 bg-opacity-30'
          } ${getRecommendationClass(crypto.recommendation)}`}>
            {crypto.recommendation}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mt-4 flex justify-between items-end">
        <div>
          <p className='text-xs text-zinc-500'>Current Price</p>
          <p className='text-2xl font-medium mt-1'>${formatPrice()}</p>
        </div>
        
        {/* Price Change - More visual with better context */}
        <div className="text-right">
          <p className='text-xs text-zinc-500'>24h Change</p>
          <div className="flex items-center gap-1 mt-1 justify-end">
            <div className={`rounded-md p-1 ${crypto.price_change_percentage >= 0 ? 'bg-[#0d2218]' : 'bg-[#240d16]'}`}>
              {crypto.price_change_percentage >= 0 ? (
                <assets.IoArrowUpCircle className='text-[#43e643]' />
              ) : (
                <assets.IoArrowDownCircle className='text-[#ec3e44]' />
              )}
            </div>
            <p className={`font-medium text-base ${crypto.price_change_percentage >= 0 ? 'text-[#43e643]' : 'text-[#ec3e44]'}`}>
              {Math.abs(crypto.price_change_percentage).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
      
      {/* Investment Score - Now with explanation */}
      {crypto.investment_score && (
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-zinc-500">Investment Score</p>
            <p className="text-xs text-zinc-400">
              {crypto.investment_score >= 8 ? "Excellent" : 
              crypto.investment_score >= 6 ? "Good" : 
              crypto.investment_score >= 4 ? "Average" : "Poor"}
            </p>
          </div>
          <div className="flex items-center mt-1">
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  crypto.investment_score > 8 ? 'bg-green-500' : 
                  crypto.investment_score > 6 ? 'bg-green-400' : 
                  crypto.investment_score > 4 ? 'bg-blue-400' : 
                  'bg-yellow-400'
                }`}
                style={{ width: `${Math.min(crypto.investment_score * 10, 100)}%` }}
              ></div>
            </div>
            <p className="ml-2 text-sm font-medium">{crypto.investment_score.toFixed(1)}</p>
          </div>
        </div>
      )}
      
      {/* Key Metrics Summary - New section */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="bg-gray-900 bg-opacity-40 p-2 rounded-md">
          <p className="text-xs text-zinc-500">Risk</p>
          <p className="text-sm font-medium">{crypto.risk_score?.toFixed(1) || 'N/A'}</p>
          <p className="text-xs text-zinc-400">{getRiskExplanation(crypto.risk_score)}</p>
        </div>
        
        <div className="bg-gray-900 bg-opacity-40 p-2 rounded-md">
          <p className="text-xs text-zinc-500">Days Since Saved</p>
          <p className="text-sm font-medium">{crypto.days_since_saved? crypto.days_since_saved : 'N/A'}</p>
          <p className="text-xs text-zinc-400">{getDaysExplanation(crypto.days_since_saved)}</p>
        </div>
        
        {/* <div className="bg-gray-900 bg-opacity-40 p-2 rounded-md">
          <p className="text-xs text-zinc-500">Volume (24h)</p>
          <p className="text-sm font-medium">
            {crypto.total_volume ? formatLargeNumber(crypto.total_volume, '$') : 'N/A'}
          </p>
        </div> */}
      </div>
      
      {/* Expand/Collapse Button */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className="mt-4 flex items-center text-xs bg-gray-800 rounded-md px-3 py-2 hover:bg-gray-700"
      >
        {expanded ? 'Show Less' : 'Show More Details'}
        <span className="ml-1">{expanded ? '▲' : '▼'}</span>
      </button>
      
      {/* Expanded Details - More organized with better grouping */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          {/* Performance Metrics */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Performance Category */}
              <div>
                <p className="text-xs text-zinc-500">Overall Performance</p>
                <p className={`text-sm ${getPerformanceClass(crypto.performance_category)}`}>
                  {crypto.performance_category || 'N/A'}
                </p>
              </div>
              
              {/* Sentiment */}
              {crypto.sentiment && (
                <div>
                  <p className="text-xs text-zinc-500">Market Sentiment</p>
                  <p className={`text-sm ${
                    crypto.sentiment === 'Bullish' ? 'text-green-500' :
                    crypto.sentiment === 'Bearish' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {crypto.sentiment}
                  </p>
                </div>
              )}
              
              {/* Gain/Loss Since Saved */}
              {crypto.gain_loss_since_saved !== undefined && (
                <div>
                  <p className="text-xs text-zinc-500">Since Added</p>
                  <p className={`text-sm font-medium ${
                    crypto.gain_loss_since_saved > 0 ? 'text-green-500' : 'text-red-400'
                  }`}>
                    {crypto.gain_loss_since_saved > 0 ? '+' : ''}
                    {crypto.gain_loss_since_saved.toFixed(2)}%
                  </p>
                </div>
              )}
              
              {/* Volatility */}
              {crypto.volatility !== undefined && (
                <div>
                  <p className="text-xs text-zinc-500">Volatility</p>
                  <div className="flex items-center">
                    <p className={`text-sm ${
                      crypto.volatility < 0.5 ? 'text-blue-400' :
                      crypto.volatility < 1 ? 'text-green-400' :
                      crypto.volatility < 2 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {crypto.volatility.toFixed(2)}
                    </p>
                    <span className="text-xs ml-1 text-zinc-500">
                      ({crypto.volatility < 0.5 ? 'Low' :
                        crypto.volatility < 1 ? 'Medium' :
                        crypto.volatility < 2 ? 'High' : 'Very High'})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Technical Indicators */}
          {crypto.technical_indicators && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Technical Indicators</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-900 bg-opacity-40 p-2 rounded-md">
                  <p className="text-xs text-zinc-500">RSI</p>
                  <p className={`text-sm ${
                    crypto.technical_indicators.rsi < 30 ? 'text-green-500' :
                    crypto.technical_indicators.rsi > 70 ? 'text-red-400' : 'text-zinc-300'
                  }`}>
                    {crypto.technical_indicators.rsi.toFixed(1)}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {crypto.technical_indicators.rsi < 30 ? 'Oversold' :
                     crypto.technical_indicators.rsi > 70 ? 'Overbought' : 'Neutral'}
                  </p>
                </div>
                
                <div className="bg-gray-900 bg-opacity-40 p-2 rounded-md">
                  <p className="text-xs text-zinc-500">MACD</p>
                  <p className={`text-sm ${
                    crypto.technical_indicators.macd_signal > 0 ? 'text-green-500' : 'text-red-400'
                  }`}>
                    {crypto.technical_indicators.macd_signal > 0 ? 'Bullish' : 'Bearish'}
                  </p>
                </div>
                
                <div className="bg-gray-900 bg-opacity-40 p-2 rounded-md">
                  <p className="text-xs text-zinc-500">50 Day MA</p>
                  <p className={`text-sm ${
                    crypto.technical_indicators.above_ma_50 ? 'text-green-500' : 'text-red-400'
                  }`}>
                    {crypto.technical_indicators.above_ma_50 ? 'Above' : 'Below'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Saved Info */}
          <div className="grid grid-cols-2 gap-3">
            {/* Saved Date */}
            {crypto.saved_date && (
              <div>
                <p className="text-xs text-zinc-500">Added On</p>
                <p className="text-sm font-medium">
                  {new Date(crypto.saved_date).toLocaleDateString()}
                </p>
              </div>
            )}
            
            {/* Hold Duration */}
            {crypto.hold_duration_days && (
              <div>
                <p className="text-xs text-zinc-500">Hold Duration</p>
                <p className="text-sm font-medium">{crypto.hold_duration_days} days</p>
              </div>
            )}
          </div>
          
          {/* Analysis Notes */}
          {crypto.analysis_notes && (
            <div className="mt-4">
              <p className="text-xs text-zinc-500 mb-1">Analysis Summary</p>
              <p className="text-sm text-zinc-300 bg-gray-900 bg-opacity-40 p-2 rounded-md">
                {crypto.analysis_notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(SavedCard);