import { useState, useEffect } from 'react';
import React from 'react'
import assets from '../assets/assets';

const WalletCard = ({ crypto }) => {
  const [priceChangePercent, setPriceChangePercent] = useState()

  useEffect(() => {
    console.log(crypto)
    setPriceChangePercent((((crypto.current_price - crypto.invested_price) / crypto.invested_price)*100).toFixed(2))
  }, [crypto])
  

  return (
    <div>
        <div className='flex justify-between items-center'>
            <div className='flex gap-3 items-center'>
                <img src={crypto.image} className='w-[30px] rounded-md' alt="" />
                <div>
                    <p className='text-zinc-500 text-xs'>Proof of Stake</p>
                    <p className='text-sm font-light'>{crypto.name} ({crypto.symbol})</p>
                </div>
            </div>
        </div>

        <div className='flex justify-between'>
            <div>
                <p className='text-sm text-zinc-500 mt-6'>Market Price:</p>
                <p className='text-3xl font-medium mt-1'>${crypto.current_price}</p>
                <div className="flex items-center gap-1 mt-2">
                    <div className={`rounded-md ${priceChangePercent > 0 ? 'bg-[#0d2218]' : 'bg-[#240d16]'}`}>
                        {priceChangePercent >= 0 ? (
                            <assets.IoArrowUpCircle className='text-[#43e643]' />
                        ) : (
                            <assets.IoArrowDownCircle className='text-[#ec3e44]' />
                        )}
                    </div>
                    <p className={`font-medium text-xs ${priceChangePercent >= 0 ? 'text-[#43e643]' : 'text-[#ec3e44]'}`}>{priceChangePercent >= 0 ? priceChangePercent : priceChangePercent * -1}%</p>
                </div>
            </div>
            <div>
                <p className='text-sm text-zinc-500 mt-6'>Purchase Price:</p>
                <p className='text-3xl font-medium mt-1'>${crypto.invested_price}</p>
            </div>
        </div>

        <div className='grid grid-cols-2 gap-y-1 text-zinc-400 text-sm mt-4'>
            <p className='font-medium text-zinc-500'>Quantity invested:</p>
            <p className='text-right text-zinc-300'>{crypto.quantity}</p>

            <p className='font-medium text-zinc-500'>Market Cap:</p>
            <p className='text-right text-zinc-300'>${crypto.market_cap.toLocaleString()}</p>

            <p className='font-medium text-zinc-500'>Prediction:</p>
            <p className='text-right text-zinc-300'>{crypto.prediction}</p>

            <p className='font-medium text-zinc-500'>Risk Score(Out of 10):</p>
            <p className='text-right text-zinc-300'>{crypto.risk_score}</p>

            <p className='font-medium text-zinc-500'>Volatility Score:</p>
            <p className='text-right text-zinc-300'>{crypto.volatility_score}</p>

            <p className='font-medium text-zinc-500'>Last Updated:</p>
            <p className='text-right text-zinc-300'>{crypto.last_updated}</p>
        </div>
    </div>
  )
}

export default WalletCard