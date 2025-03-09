import React from 'react'
import assets from '../assets/assets'

const InvestModal = ({ investCrypto, closeModal }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 text-zinc-300'>
        <div className='bg-[#0b0c19] relative rounded-lg p-5 min-w-[500px]'>
            <div className='flex justify-between items-center w-full'>
                <div className='flex gap-3 items-center'>
                    <img src={investCrypto.image} className='w-[40px]' alt="" />
                    <div>
                        <p className='text-xs text-zinc-600'>Proof of Stake</p>
                        <p className='font-medium text-sm mt-1'>{investCrypto.name}({investCrypto.symbol})</p>
                    </div>
                </div>
                <assets.IoMdClose className='text-white cursor-pointer text-xl smoothTransition hover:text-zinc-400' onClick={closeModal} />
            </div>
        </div>
    </div>
  )
}

export default InvestModal