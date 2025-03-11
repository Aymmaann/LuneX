import React from 'react'
import assets from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user-info')
    navigate("/login")
  }

  return (
    <div className='relative flex items-center justify-between py-5 px-6 text-zinc-300'>
        <div className='flex gap-2 items-center w-[100px]'>
            <img src={assets.noBgLogo} alt="" className='w-[25px]'/>
            <p className='text-lg font-light'>Lune<span className='font-semibold'>X</span></p>
        </div>

        <div>
            <ul className='flex items-center gap-28 text-sm'>
              <Link to='/market' className='smoothTransition hover:text-zinc-400'>Market</Link>
              <Link to='/wallet' className='smoothTransition hover:text-zinc-400'>Wallet</Link>
              <Link to='/finbot' className='smoothTransition hover:text-zinc-400'>FinBot</Link>
            </ul>
        </div>

        <div className='text-sm flex items-center gap-1 smoothTransition hover:text-zinc-400 cursor-pointer' onClick={handleLogout}>
            <span>Log out</span>
            <assets.IoMdLogOut className='mt-0.5 text-[16px]' />
        </div>
    </div>
  )
}

export default Navbar