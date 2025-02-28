import React from 'react'
import { Link } from 'react-router-dom'
import assets from '../assets/assets'
import Navbar from '../components/Navbar'

const NotFound = () => {
  return (
    // <div className='notfound relative h-screen overflow-hidden'>
    //   <div className='flex gap-2 items-center w-[100px] p-6'>
    //     <img src={assets.noBgLogo} alt="" className='w-[30px]'/>
    //     <p className='text-xl font-light text-white'>Lune<span className='font-semibold'>X</span></p>
    //   </div>
    //   <div className='pt-[220px]'>
    //     <p className='text-5xl font-bold mb-10 text-center text-white'>Page not found.</p>
    //     <Link to="/" className='flex justify-center'>
    //       <button className='bg-white py-3 px-6 rounded-xl smoothTransition mt-2 glow text-black z-10'>Back to Home Page</button>
    //     </Link>
    //   </div>

    //   <p className='text-zinc-800 absolute text-[400px] font-extrabold bottom-[-170px] left-[-80px] z-0'>404</p>
    // </div>
    <div className='h-screen overflow-hidden bg-[#05060f] text-zinc-300 bg-[url("/Users/ayman/Desktop/Lunex/client/src/assets/images/error-bg.jpg")] bg-top text-center'>
      <Navbar />

      <div className='mt-32'>
        <p className='font-bold tracking-tight text-[150px]'>404</p>
        <p>Uh-oh! Something went wrong while loading the page.</p>
        <p className='mt-2'>Give it a moment, or try refreshing the page..</p>
      </div>

      <Link to="/">
        <button className='bg-white text-black py-2 px-4 rounded-md text-sm mt-8'>Back to Home Page</button>
      </Link>

    </div>
  )
}

export default NotFound