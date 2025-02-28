import React from 'react'
import { Link } from 'react-router-dom'
import assets from '../assets/assets'

const NotFound = () => {
  return (
    <div className='notfound relative h-screen overflow-hidden'>
      <div className='flex gap-2 items-center w-[100px] p-6'>
        <img src={assets.noBgLogo} alt="" className='w-[30px]'/>
        <p className='text-xl font-light text-white'>Lune<span className='font-semibold'>X</span></p>
      </div>
      <div className='pt-[220px]'>
        <p className='text-5xl font-bold mb-10 text-center text-white'>Page not found.</p>
        <Link to="/" className='flex justify-center'>
          <button className='bg-white py-3 px-6 rounded-xl smoothTransition mt-2 glow text-black z-10'>Back to Home Page</button>
        </Link>
      </div>

      <p className='text-zinc-800 absolute text-[400px] font-extrabold bottom-[-170px] left-[-80px] z-0'>404</p>
    </div>
  )
}

export default NotFound