import React from 'react'
import assets from '../assets/assets'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='w-full h-screen bg-gradient-to-br from-[#070808] to-[#2b1f2e]'>
      {/* Navbar */}
      <div className='relative flex items-center justify-center py-5'>
        <div className='flex gap-2 items-center w-[100px] absolute left-6 top-4'>
          <img src={assets.noBgLogo} alt="" className='w-[25px]'/>
          <p className='text-lg font-light'>Lune<span className='font-semibold'>X</span></p>
        </div>

        <div>
          <ul className='flex items-center gap-32'>
            <Link to='/dashboard' className='smoothTransition hover:-translate-y-0.5 text-sm'>Dashboard</Link>
            <Link to='/profile' className='smoothTransition hover:-translate-y-0.5 text-sm'>Profile</Link>
            <Link to='/dashboard' className='smoothTransition hover:-translate-y-0.5 text-sm'>FinBot</Link>
          </ul>
        </div>
      </div>

      <div className='w-[750px] mx-auto mt-24'>
        <div className='flex items-center gap-3 rounded-2xl bg-[#483e54] p-1 w-[257px] mx-auto'>
          <div className='bg-gradient-to-b from-[#6671ea] to-[#a264e3] text-xs rounded-xl py-1 px-2 font-semibold'>New</div>
          <p className='text-xs mr-3 font-light'>Assess Crypto Volatility Instantly</p>
        </div>

        <div className='text-center mt-11'>
          <p className='text-5xl font-semibold text-zinc-200'>Meet LuneX</p>
          <p className='font-light text-zinc-400 mt-6'>Advanced crypto tracking with real-time insights. Analyze market trends and assess risk effortlessly.</p>
        </div>

        <div className='mt-16'>
          <p className='text-2xl font-semibold'>Why LuneX?</p>
          <div className='flex-col items-center mt-7'>
            <div className='flex justify-between items-center text-sm w-full'>
              <div className='flex gap-2 w-[300px]'>
                <assets.BiSolidAnalyse className='text-violet text-3xl'/>
                <div className='leading-6'>
                  <p className='font-semibold mt-1'>Smart Risk Analysis</p>
                  <p className='text-zinc-400'>Instantly assess crypto volatility based on last month's market trends</p>
                </div>
              </div>
              <div className='flex gap-2 w-[300px]'>
                <assets.MdSpatialTracking className='text-violet text-3xl'/>
                <div className='leading-6'>
                  <p className='font-semibold mt-1'>Real-Time Tracking</p>
                  <p className='text-zinc-400'>Stay updated with live price movements and market data</p>
                </div>
              </div>
            </div>

            <div className='flex justify-between items-center text-sm w-full mt-7'>
              <div className='flex gap-2 w-[300px]'>
                <assets.FaBell className='text-violet text-xl mt-1'/>
                <div className='leading-6'>
                  <p className='font-semibold'>Personalized Alerts</p>
                  <p className='text-zinc-400'>Get notified about key market changes tailored to your portfolio</p>
                </div>
              </div>
              <div className='flex gap-2 w-[300px]'>
                <assets.FaReact className='text-violet text-3xl'/>
                <div className='leading-6'>
                  <p className='font-semibold mt-1'>Intuitive Interface</p>
                  <p className='text-zinc-400'>A seamless, user-friendly experience for effortless crypto monitoring</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home