import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import assets from "../assets/assets.js"

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className='block fixed overflow-y-auto w-64 min-h-screen  bg-[#0b0c19] p-4'>
        <div className='flex gap-2 items-center w-[100px] pl-2'>
          <img src={assets.noBgLogo} alt="" className='w-[25px]'/>
          <p className='text-lg font-light'>Lune<span className='font-semibold'>X</span></p>
        </div>
        <hr className="my-3 h-[1px] bg-gradient-to-r from-[#1c1e39] via-[#343850] to-[#1c1e39] border-0 mx-3" />

        <div className='mt-4 h-full'>
            <Link to='/home' className={`flex items-center gap-2 p-1.5 rounded-lg ${location.pathname === '/home'? 'bg-[#1a1f37]' : 'bg-transparent'}`}>
                <div className="p-2 rounded-xl">
                    <assets.FaHome className='text-[18px]' />
                </div>
                <p className='text-sm font-semibold'>Home</p>
            </Link>

            <Link to='/dashboard' className={`flex items-center gap-2 p-1.5 rounded-lg ${location.pathname === '/dashboard'? 'bg-[#131627]' : 'bg-transparent'}`}>
                <div className="p-2 rounded-md">
                    <assets.RiDashboardFill className={`text-[18px] ${location.pathname === '/dashboard'? 'text-violet' : 'text-white'}`} />
                </div>
                <p className={`text-sm font-semibold ${location.pathname === '/dashboard'? 'text-violet' : 'text-white'}`}>Dashboard</p>
            </Link>

            <Link to='/trending' className={`flex items-center gap-2 p-1.5 rounded-lg ${location.pathname === '/trending'? 'bg-[#131627]' : 'bg-transparent'}`}>
                <div className="p-2 rounded-md">
                    <assets.IoMdTrendingUp className={`text-[18px] ${location.pathname === '/trending'? 'text-violet' : 'text-white'}`} />
                </div>
                <p className={`text-sm font-semibold ${location.pathname === '/trending'? 'text-violet' : 'text-white'}`}>Trending</p>
            </Link>

            <Link to='/saved' className={`flex items-center gap-2 p-1.5 rounded-lg ${location.pathname === '/saved'? 'bg-[#131627]' : 'bg-transparent'}`}>
                <div className="p-2 rounded-md">
                    <assets.LuFileDown className={`text-[18px] ${location.pathname === '/saved'? 'text-violet' : 'text-white'}`} />
                </div>
                <p className={`text-sm font-semibold ${location.pathname === '/saved'? 'text-violet' : 'text-white'}`}>Saved</p>
            </Link>

            <Link to='/profile' className={`flex items-center gap-2 p-1.5 rounded-lg ${location.pathname === '/profile'? 'bg-[#131627]' : 'bg-transparent'}`}>
                <div className="p-2 rounded-md">
                    <assets.MdPerson className={`text-[18px] ${location.pathname === '/profile'? 'text-violet' : 'text-white'}`} />
                </div>
                <p className={`text-sm font-semibold ${location.pathname === '/profile'? 'text-violet' : 'text-white'}`}>Profile</p>
            </Link>
        </div>
    </div> 
  )
}

export default Sidebar