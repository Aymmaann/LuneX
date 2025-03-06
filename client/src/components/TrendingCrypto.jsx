import React, { useState } from 'react'
import assets from '../assets/assets'
import axios from 'axios'

const TrendingCrypto = ({ crypto }) => {
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = async () => {
    const userInfo = JSON.parse(localStorage.getItem('user-info'))

    if(!userInfo || !userInfo.token) {
      alert('Please log in to save coins')
      return
    }

    try {
      console.log('Crypto ID: ', crypto.id)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/save-coin`, 
        { coin: crypto },
        {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`
          }
        }
      )
      setIsSaved(true)
      alert('Coin saved successfully!')
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      alert(`Failed to save coin: ${error.response?.data?.message || error.message}`)
    }
  }


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
            <assets.CiSaveDown1 className={`text-[20px] cursor-pointer ${isSaved ? 'text-green-500' : 'text-zinc-500'}`}  onClick={handleSave} />
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
        
        <p className='text-sm font-light mt-4 text-zinc-500'>Market Cap Rank: <span className='font-medium text-zinc-300'>{crypto.item.market_cap_rank}</span></p>
    </div>
  )
}

export default TrendingCrypto