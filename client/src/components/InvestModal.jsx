import React, { useState } from 'react'
import assets from '../assets/assets'
import Toast from '../components/Toast';
import axios from 'axios';

const InvestModal = ({ selectedCrypto, closeModal }) => {
  const [invest, setInvest] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(selectedCrypto.item?.data?.price?.toFixed(10) || selectedCrypto.current_price)
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

  const fixQuantity = (value) => {
    if (value === "") {
        setQuantity(""); 
        setPrice(0);
    } else {
        const newQuantity = Number(value);
        setQuantity(newQuantity);
        setPrice(selectedCrypto.item?.data?.price?.toFixed(10) * newQuantity || selectedCrypto.current_price * newQuantity);
    }
};

  const handleBlur = () => {
    if (quantity === "" || quantity <= 0) {
        setQuantity(1);
        setPrice(selectedCrypto.item?.data?.price?.toFixed(10) || selectedCrypto.current_price);
    }
  };

  const handleInvest = async () => {
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    if (!userInfo || !userInfo.token) {
        showToastMessage('Please log in to invest', 'error');
        return;
    }
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/invest-crypto`,
            { coin: selectedCrypto, quantity: quantity },
            {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                }
            }
        );
        setInvest(true);
        showToastMessage('Investment successful!', 'success');
    } catch (error) {
        console.error('Full error object:', error);
        console.error('Error response:', error.response);
        showToastMessage('Failed to invest', 'error');
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 text-zinc-300'>
        <div className='bg-[#0b0c19] relative rounded-lg p-5 min-w-[450px]'>
            <div className='flex justify-between items-center w-full'>
                <div className='flex gap-3 items-center'>
                    <img src={selectedCrypto.item?.large || selectedCrypto.image} className='w-[40px]' alt="" />
                    <div>
                        <p className='text-xs text-zinc-600'>Proof of Stake</p>
                        <p className='font-medium text-sm mt-1'>{selectedCrypto.item?.name || selectedCrypto.name}({selectedCrypto.item?.symbol || selectedCrypto.symbol})</p>
                    </div>
                </div>
                <assets.IoMdClose className='text-white cursor-pointer text-xl smoothTransition hover:text-zinc-400' onClick={closeModal} />
            </div>
            <hr className="my-4 h-[1px] bg-gradient-to-r from-[#1c1e39] via-[#343850] to-[#1c1e39] border-0 mx-1" />
            <div className='w-full rounded-md bg-darkGray p-3'>
                <p className='text-xs text-zinc-400'>Price: </p>
                <p className='text-3xl mt-1 font-medium'>${selectedCrypto.item?.data?.price?.toFixed(10) || selectedCrypto.current_price}</p>
                <div className='flex items-center justify-between'>
                    <div className="flex items-center gap-1 mt-2">
                        <div className={`rounded-md ${(selectedCrypto.item?.data?.price_change_percentage_24h?.usd || selectedCrypto.price_change_percentage_24h)  > 0? 'bg-[#0d2218]' : 'bg-[#240d16]'}`}>
                            {(selectedCrypto.item?.data?.price_change_percentage_24h?.usd || selectedCrypto.price_change_percentage_24h)  > 0? (
                            <assets.IoArrowUpCircle className='text-[#43e643]' />
                            ) : (
                            <assets.IoArrowDownCircle className='text-[#ec3e44]' />
                            )}
                        </div>
                        <p className={`font-medium text-xs ${(selectedCrypto.item?.data?.price_change_percentage_24h?.usd || selectedCrypto.price_change_percentage_24h) > 0? 'text-[#43e643]' : 'text-[#ec3e44]'}`}>{(selectedCrypto.item?.data?.price_change_percentage_24h?.usd || selectedCrypto.price_change_percentage_24h)  > 0? (selectedCrypto.item?.data?.price_change_percentage_24h?.usd || selectedCrypto.price_change_percentage_24h).toFixed(2) : (selectedCrypto.item?.data?.price_change_percentage_24h?.usd || selectedCrypto.price_change_percentage_24h).toFixed(2) * -1}%</p>
                    </div>
                    <div className=''>
                        {(selectedCrypto.item?.data?.price_change_percentage_24h?.usd || selectedCrypto.price_change_percentage_24h) > 1 ? (
                            <button className='text-darkGray text-xs bg-[#43e643] rounded-md py-1 px-2 font-semibold'>
                                Promising
                            </button>
                        ) : (selectedCrypto.item?.data?.price_change_percentage_24h?.usd || selectedCrypto.price_change_percentage_24h) > -1 && (selectedCrypto.item?.data?.price_change_percentage_24h?.usd || selectedCrypto.price_change_percentage_24h) < 1 ? (
                            <button className='text-darkGray text-xs bg-[#f4c430] rounded-md py-1 px-2 font-semibold'>
                                Caution
                            </button>
                        ) : (
                            <button className='text-darkGray text-xs bg-[#ec3e44] rounded-md py-1 px-2 font-semibold'>
                                Risky
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <p className='text-sm mt-6'>Quantity</p>
            <input type="number" 
                placeholder="Enter quantity" 
                className="mt-2 bg-transparent outline-none text-sm placeholder:text-zinc-400 flex-1 border border-zinc-800 rounded-md py-2 px-3 w-full" 
                value={quantity}
                onChange={(e) => fixQuantity(e.target.value)}
                onBlur={handleBlur}
            />

            <hr className="my-4 h-[1px] bg-gradient-to-r from-[#1c1e39] via-[#343850] to-[#1c1e39] border-0 mx-1" />
            <p className='text-lg font-medium'>Order Summary</p>
            <div className='flex items-center justify-between mt-4'>
                <div className='flex gap-3 items-center'>
                    <img src={selectedCrypto.item?.large || selectedCrypto.image} className='w-[40px]' alt="" />
                    <div>
                        <p className='text-xs text-zinc-600'>Proof of Stake</p>
                        <p className='font-medium text-xs'>{selectedCrypto.item?.name || selectedCrypto.name}({selectedCrypto.item?.symbol || selectedCrypto.symbol})</p>
                    </div>
                </div>
                <p className='text-sm'>Quantity: {quantity}</p>
                <p>${price}</p>
            </div>
            <button className='mt-6 py-2 px-3 w-full bg-[#131627] text-zinc-300 rounded-md smoothTransition cursor-pointer font-medium text-sm hover:bg-violet hover:text-zinc-900' 
                    disabled={quantity == 0 || quantity == ''} 
                    onClick={handleInvest}
            >
                Invest
            </button>
            <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />
        </div>
    </div>
  )
}

export default InvestModal