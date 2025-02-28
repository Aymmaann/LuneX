import React from 'react'
import assets from '../assets/assets'

const CryptoCard = ({ crypto }) => {
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
            <assets.CiSaveDown1 className='text-zinc-500 text-[20px] cursor-pointer' />
        </div>

        <p className='text-sm text-zinc-500 mt-6'>Price:</p>
        <p className='text-3xl font-medium mt-1'>${crypto.current_price}</p>
        <div className="flex items-center gap-1 mt-2">
            <div className={`rounded-md ${crypto.price_change_percentage_24h > 0? 'bg-[#0d2218]' : 'bg-[#240d16]'}`}>
                {crypto.price_change_percentage_24h > 0? (
                <assets.IoArrowUpCircle className='text-[#43e643]' />
                ) : (
                <assets.IoArrowDownCircle className='text-[#ec3e44]' />
                )}
            </div>
            <p className={`font-medium text-xs ${crypto.price_change_percentage_24h > 0? 'text-[#43e643]' : 'text-[#ec3e44]'}`}>{crypto.price_change_percentage_24h > 0? crypto.price_change_percentage_24h.toFixed(2) : crypto.price_change_percentage_24h.toFixed(2) * -1}%</p>
        </div>
        <div className='flex items-center justify-between mt-4 text-zinc-500'>
            <p className='text-sm font-light'>24H High: <span className='font-medium text-zinc-200'>${crypto.high_24h}</span></p>
            <p className='text-sm font-light'>24H Low: <span className='font-medium text-zinc-200'>${crypto.low_24h}</span></p>
        </div>
    </div>
  )
}

export default CryptoCard