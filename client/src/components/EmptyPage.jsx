import React from 'react'
import assets from '../assets/assets'
import { Link } from 'react-router-dom';

const EmptyPage = ({ text }) => {
  return (
    <div className='w-full p-16 flex items-center justify-center '>
        <div className='bg-darkBlue p-6 rounded-lg border border-zinc-800 text-center'>

            <div className='bg-mediumBlue w-full h-[192px] rounded-t-lg p-5'>
            <div className='bg-darkBlue w-full h-[40px] rounded-md flex items-center justify-between px-4'>
                <div className='h-[10px] rounded-full w-[10px] bg-zinc-400'></div>
                <div className='h-[10px] rounded-lg w-[150px] bg-zinc-400'></div>
                <div className='h-[10px] rounded-lg w-[60px] bg-zinc-400'></div>
            </div>
            <div className='bg-darkBlue w-full h-[40px] rounded-md flex items-center justify-between px-4 mt-4'>
                <div className='h-[10px] rounded-lg w-[120px] bg-zinc-400'></div>
                <div className='h-[10px] rounded-full w-[100px] bg-zinc-400'></div>
                <div className='h-[10px] rounded-lg w-[40px] bg-zinc-400'></div>
            </div>
            <div className='bg-darkBlue w-full h-[40px] rounded-md flex items-center justify-between px-4 mt-4'>
                <div className='h-[10px] rounded-full w-[70px] bg-zinc-400'></div>
                <div className='h-[10px] rounded-lg w-[10px] bg-zinc-400'></div>
                <div className='h-[10px] rounded-lg w-[170px] bg-zinc-400'></div>
            </div>
            </div>

            <p className='font-semibold text-xl mt-8'>Your {text} is empty</p>
            <p className='w-[500px] text-zinc-500 text-sm mt-4'>Kickstart your crypto journey by exploring the market and building your {text}.</p>
            <Link to="/market">
            <button className='mt-6 py-2 px-4 bg-white text-darkBlue rounded-md smoothTransition font-medium text-sm hover:bg-zinc-300 hover:cursor-pointer'>Browse Market</button>
            </Link>
        </div>
    </div>
  )
}

export default EmptyPage