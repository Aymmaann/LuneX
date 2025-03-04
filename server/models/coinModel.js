import mongoose from 'mongoose';

const CoinSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  current_price: {
    type: Number,
    default: 0
  },
  market_cap: {
    type: Number,
    default: 0
  },
  savedAt: {
    type: Date,
    default: Date.now
  },
  analytics: {
    volatilityScore: {
      type: Number
    },
    expectedPriceChange: {
      type: Number
    },
    trendPrediction: {
      type: String,
      enum: ['Bullish', 'Bearish', 'Neutral']
    },
    lastCalculatedAt: {
      type: Date
    }
  }
}, { 
  timestamps: true 
});

// Compound index for efficient querying
CoinSchema.index({ userId: 1, id: 1 }, { unique: true });

export default mongoose.model('Coin', CoinSchema);