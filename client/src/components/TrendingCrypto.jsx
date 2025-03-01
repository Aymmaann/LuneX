import React from 'react'
import assets from '../assets/assets'

const TrendingCrypto = ({ crypto }) => {
  return (
    <div className='text-zinc-300'>
        <div className='flex justify-between items-center'>
            <div className='flex gap-3 items-center'>
                <img src={crypto.item.large} className='w-[30px] rounded-md' alt="" />
                <div>
                <p className='text-zinc-500 text-xs'>Proof of Stake</p>
                <p className='text-sm font-light'>{crypto.item.name} ({crypto.item.symbol})</p>
                </div>
            </div>
            <assets.CiSaveDown1 className='text-zinc-500 text-[25px] cursor-pointer' />
        </div>

        <p className='text-sm text-zinc-500 mt-6'>Price:</p>
        <p className='text-3xl font-medium mt-2'>${crypto.item.data.price.toFixed(5)}</p>
        
        <div className="flex items-center gap-1 mt-2">
            <div className={`rounded-md ${crypto.item.data.price_change_percentage_24h.usd > 0? 'bg-[#0d2218]' : 'bg-[#240d16]'}`}>
                {crypto.item.data.price_change_percentage_24h.usd > 0? (
                <assets.IoArrowUpCircle className='text-[#43e643]' />
                ) : (
                <assets.IoArrowDownCircle className='text-[#ec3e44]' />
                )}
            </div>
            <p className={`font-medium text-xs ${crypto.item.data.price_change_percentage_24h.usd > 0? 'text-[#43e643]' : 'text-[#ec3e44]'}`}>{crypto.item.data.price_change_percentage_24h.usd > 0? crypto.item.data.price_change_percentage_24h.usd.toFixed(2) : crypto.item.data.price_change_percentage_24h.usd.toFixed(2) * -1}%</p>
        </div>
        
        <div className='mt-4 text-zinc-500'>
            <p className='text-sm font-light'>Market Cap Rank: <span className='font-medium text-zinc-300'>{crypto.item.market_cap_rank}</span></p>
            {/* <p className='text-sm font-light mt-1'>Market Cap: <span className='font-medium text-zinc-300'>{crypto.item.data.market_cap}</span></p>
            <p className='text-sm font-light mt-1'>Total Volume: <span className='font-medium text-zinc-300'>{crypto.item.data.total_volume}</span></p> */}
        </div>
    </div>
  )
}

export default TrendingCrypto