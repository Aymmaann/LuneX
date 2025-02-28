import React from 'react'
import assets from '../assets/assets'

const Loading = () => {
  return (
    <div className='w-screen h-screen bg-[#05060f] flex justify-center items-center pb-14'>
        <div className='flex gap-2 items-center w-[100px] absolute left-6 top-4'>
          <img src={assets.noBgLogo} alt="" className='w-[25px]'/>
          <p className='text-lg font-light text-zinc-200'>Lune<span className='font-semibold'>X</span></p>
        </div>
        <div className='flex flex-col items-center justify-center'>
            <svg xmlns='http://www.w3.org/2000/svg' width="80px" viewBox='0 0 300 150'>
                <path fill='none' stroke='#A392F9' stroke-width='11' stroke-linecap='round' stroke-dasharray='300 385' stroke-dashoffset='0' d='M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z'>
                    <animate attributeName='stroke-dashoffset' calcMode='spline' dur='2' values='685;-685' keySplines='0 0 1 1' repeatCount='indefinite'></animate>
                </path>
            </svg>
            <p className='text-zinc-200 mt-4 text-sm'>Hang tight while we fetch your data...</p>
        </div>
    </div>
  )
}

export default Loading