import React from 'react'
import assets from '../assets/assets'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='relative flex items-center justify-between py-5 px-6'>
        <div className='flex gap-2 items-center w-[100px]'>
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

        <div>
          <Link to="/login" className='text-zinc-300 text-sm flex items-center gap-2 smoothTransition hover:-translate-y-0.5'>
            <span>Log out</span>
            <assets.BsArrowRight className='mt-1' />
          </Link>
        </div>
    </div>
  )
}

export default Navbar