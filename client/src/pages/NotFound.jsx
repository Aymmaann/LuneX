import React from 'react'
import { Link } from 'react-router-dom'
import assets from '../assets/assets'
import Navbar from '../components/Navbar'

const NotFound = () => {
  return (
    <div className='h-screen overflow-hidden bg-[#05060f] text-zinc-300 bg-[url("/Users/ayman/Desktop/Lunex/client/src/assets/images/error-bg.jpg")] bg-top text-center'>
      <Navbar />

      <div className='mt-32'>
        <p className='font-bold tracking-tight text-[150px]'>404</p>
        <p>Uh-oh! Something went wrong while loading the page.</p>
        <p className='mt-2'>Give it a moment, or try refreshing the page.</p>
      </div>

      <Link to="/">
        <button className='mt-6 py-2 px-4 bg-white text-[#262063] rounded-md smoothTransition cursor-pointer font-medium text-sm hover:bg-zinc-300'>Back to Home Page</button>
      </Link>

    </div>
  )
}

export default NotFound