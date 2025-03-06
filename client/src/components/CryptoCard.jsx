// CryptoCard.jsx
import React, { useEffect, useState, memo } from 'react';
import assets from '../assets/assets';
import axios from 'axios';
import Toast from '../components/Toast';
import { getUserCoins } from '../services/api';

const CryptoCard = ({ crypto }) => {
    const [isSaved, setIsSaved] = useState(false);
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

    const handleSave = async () => {
        const userInfo = JSON.parse(localStorage.getItem('user-info'));
        if (!userInfo || !userInfo.token) {
            showToastMessage('Please log in to save coins', 'error');
            return;
        }
        try {
            console.log('Crypto ID: ', crypto.id);
            const response = await axios.post(`https://crypto-api-1078438493144.us-central1.run.app/api/save-coin`,
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
                console.log("Saved Coins Data:", savedCoins);
                const isCryptoSaved = savedCoins.some(coin => coin.id === crypto.id);
                setIsSaved(isCryptoSaved);
            } catch (error) {
                console.error('Error fetching saved coins:', error);
            }
        };

        fetchSavedCoins();
    }, [crypto.id]);

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
                <assets.CiSaveDown1 className={`text-[20px] cursor-pointer ${isSaved ? 'text-green-500' : 'text-zinc-500'}`} onClick={handleSave} />
            </div>

            <p className='text-sm text-zinc-500 mt-6'>Price:</p>
            <p className='text-3xl font-medium mt-1'>${crypto.current_price}</p>
            <div className="flex items-center gap-1 mt-2">
                <div className={`rounded-md ${crypto.price_change_percentage_24h > 0 ? 'bg-[#0d2218]' : 'bg-[#240d16]'}`}>
                    {crypto.price_change_percentage_24h > 0 ? (
                        <assets.IoArrowUpCircle className='text-[#43e643]' />
                    ) : (
                        <assets.IoArrowDownCircle className='text-[#ec3e44]' />
                    )}
                </div>
                <p className={`font-medium text-xs ${crypto.price_change_percentage_24h > 0 ? 'text-[#43e643]' : 'text-[#ec3e44]'}`}>{crypto.price_change_percentage_24h > 0 ? crypto.price_change_percentage_24h.toFixed(2) : crypto.price_change_percentage_24h.toFixed(2) * -1}%</p>
            </div>
            <div className='flex items-center justify-between mt-4 text-zinc-500'>
                <p className='text-sm font-light'>24H High: <span className='font-medium text-zinc-200'>${crypto.high_24h}</span></p>
                <p className='text-sm font-light'>24H Low: <span className='font-medium text-zingc-200'>${crypto.low_24h}</span></p>
            </div>

            <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />
        </div>
    );
};

export default memo(CryptoCard)