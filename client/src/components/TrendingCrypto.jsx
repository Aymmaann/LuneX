import React, { useEffect, useState } from 'react'
import assets from '../assets/assets'
import axios from 'axios'
import Toast from '../components/Toast';
import { getUserCoins } from '../services/api';
import InvestModal from './InvestModal';
import TrendingModal from './TrendingModal';

const TrendingCrypto = ({ crypto }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [investCrypto, setInvestCrypto] = useState(null)
  const [selectedCrypto, setSelectedCrypto] = useState(null)
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "success",
  });

 const handleCloseToast = () => {
    setShowToastMsg({
        isShown: false,
        message: "",
    });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
        isShown: true,
        message,
        type,
    });
  };

  const openModal = (crypto,type) => {
    type==="info"? setSelectedCrypto(crypto) : setInvestCrypto(crypto);
  };

  const closeModal = (type) => {
    type==="info"? setSelectedCrypto(null) : setInvestCrypto(null);
  };

  const handleSave = async () => {
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    if (!userInfo || !userInfo.token) {
        showToastMessage('Please log in to save coins', 'error');
        return;
    }
    try {
        console.log('Crypto ID: ', crypto.id);
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/save-coin`,
            { coin: crypto },
            {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                }
            }
        );
        setIsSaved(true);
        showToastMessage('Coin saved successfully!', 'success');
    } catch (error) {
        console.error('Full error object:', error);
        console.error('Error response:', error.response);
        showToastMessage('Failed to save coin', 'error');
    }
  };

  useEffect(() => {
    const fetchSavedCoins = async () => {
        try {
            const response = await getUserCoins();
            const savedCoins = response.data;
            const isCryptoSaved = savedCoins.some(coin => coin.id === crypto.id);
            setIsSaved(isCryptoSaved);
        } catch (error) {
            console.error('Error fetching saved coins:', error);
        }
    };

    fetchSavedCoins();
  }, [crypto.id]);


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

        <div className='flex justify-between items-center gap-8 mt-4'>
            <button className='py-2 px-3 flex-1 bg-[#131627] text-zinc-300 rounded-md smoothTransition cursor-pointer font-medium text-sm hover:bg-violet hover:text-zinc-900' onClick={() => openModal(crypto,'info')}>More info</button>
            <button className='py-2 px-3 flex-1 bg-[#131627] text-zinc-300 rounded-md smoothTransition cursor-pointer font-medium text-sm hover:bg-violet hover:text-zinc-900' onClick={() => openModal(crypto,'invest')}>Invest</button>
        </div>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
      {selectedCrypto && <TrendingModal selectedCrypto={selectedCrypto} closeModal={closeModal} />}
      {investCrypto && <InvestModal selectedCrypto={investCrypto} closeModal={closeModal} />}
    </div>
  )
}

export default TrendingCrypto