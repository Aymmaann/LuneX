import React from 'react'
import assets from '../assets/assets'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='relative flex items-center justify-center py-5'>
        <div className='flex gap-2 items-center w-[100px] absolute left-6 top-4'>
            <img src={assets.noBgLogo} alt="" className='w-[25px]'/>
            <p className='text-lg font-light'>Lune<span className='font-semibold'>X</span></p>
        </div>

        <div>
            <ul className='flex items-center gap-28'>
            <Link to='/dashboard' className='smoothTransition hover:-translate-y-0.5 text-sm'>Dashboard</Link>
            <Link to='/profile' className='smoothTransition hover:-translate-y-0.5 text-sm'>Profile</Link>
            <Link to='/finbot' className='smoothTransition hover:-translate-y-0.5 text-sm'>FinBot</Link>
            </ul>
        </div>
    </div>
  )
}

export default Navbar