import React, { useEffect } from 'react'
import assets from '../assets/assets'

const Modal = ({ selectedCrypto, closeModal }) => {
  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [])

  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 text-zinc-300'>
        <div className='bg-[#0b0c19] w-[400px] relative rounded-lg p-5'>
            <div className='flex justify-between items-center w-full'>
                <div className='flex gap-3 items-center'>
                    <img src={selectedCrypto.image} className='w-[40px]' alt="" />
                    <div>
                        <p className='text-xs text-zinc-600'>Proof of Stake</p>
                        <p className='font-medium text-sm mt-1'>{selectedCrypto.name}({selectedCrypto.symbol})</p>
                    </div>
                </div>
                <assets.IoMdClose className='text-white cursor-pointer text-xl smoothTransition hover:text-zinc-400' onClick={closeModal} />
            </div>
            <hr className="my-4 h-[1px] bg-gradient-to-r from-[#1c1e39] via-[#343850] to-[#1c1e39] border-0 mx-3" />
            <div className='w-full rounded-md bg-darkGray p-3'>
                <p className='text-xs text-zinc-400'>Price: </p>
                <p className='text-3xl mt-1 font-medium'>${selectedCrypto.current_price}</p>
                <div className='flex items-center justify-between'>
                    <div className="flex items-center gap-1 mt-2">
                        <div className={`rounded-md ${selectedCrypto.price_change_percentage_24h > 0? 'bg-[#0d2218]' : 'bg-[#240d16]'}`}>
                            {selectedCrypto.price_change_percentage_24h > 0? (
                            <assets.IoArrowUpCircle className='text-[#43e643]' />
                            ) : (
                            <assets.IoArrowDownCircle className='text-[#ec3e44]' />
                            )}
                        </div>
                        <p className={`font-medium text-xs ${selectedCrypto.price_change_percentage_24h > 0? 'text-[#43e643]' : 'text-[#ec3e44]'}`}>{selectedCrypto.price_change_percentage_24h > 0? selectedCrypto.price_change_percentage_24h.toFixed(2) : selectedCrypto.price_change_percentage_24h.toFixed(2) * -1}%</p>
                    </div>
                    <div className=''>
                        {selectedCrypto.price_change_percentage_24h > 1 ? (
                            <button className='text-darkGray text-xs bg-[#43e643] rounded-md py-1 px-2 font-semibold'>
                                Promising
                            </button>
                        ) : selectedCrypto.price_change_percentage_24h > -1 && selectedCrypto.price_change_percentage_24h < 1 ? (
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
            <div className='text-xs mt-6 p-4  rounded-md shadow-md'>
                <h3 className='text-sm font-semibold text-zinc-300 mb-3'>Market Details</h3>
                <div className='grid grid-cols-2 gap-y-3 text-zinc-400'>
                    <p className='font-medium text-zinc-500'>Market Cap Rank:</p>
                    <p className='text-right text-zinc-300'>{selectedCrypto.market_cap_rank}</p>

                    <p className='font-medium text-zinc-500'>Market Cap:</p>
                    <p className='text-right text-zinc-300'>${selectedCrypto.market_cap.toLocaleString()}</p>

                    <p className='font-medium text-zinc-500'>Circulating Supply:</p>
                    <p className='text-right text-zinc-300'>{selectedCrypto.circulating_supply.toLocaleString()}</p>

                    <p className='font-medium text-zinc-500'>Total Supply:</p>
                    <p className='text-right text-zinc-300'>{selectedCrypto.total_supply ? selectedCrypto.total_supply.toLocaleString() : 'N/A'}</p>

                    <p className='font-medium text-zinc-500'>Max Supply:</p>
                    <p className='text-right text-zinc-300'>{selectedCrypto.max_supply ? selectedCrypto.max_supply.toLocaleString() : 'N/A'}</p>

                    <p className='font-medium text-zinc-500'>Last Updated:</p>
                    <p className='text-right text-zinc-300'>{new Date(selectedCrypto.last_updated).toLocaleString()}</p>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Modal