import React, { useContext, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import assets from "../assets/assets.js"
import { ThemeContext } from '../context/ThemeProvider.jsx'

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const { theme, setTheme } = useContext(ThemeContext)
  const text = theme==='dark'? 'text-zinc-300' : 'text-zinc-800';
  const background = theme==='dark'? 'bg-[#0b0c19]' : 'bg-[#ffffff]';

  const handleLogout = () => {
    localStorage.removeItem('user-info')
    navigate("/login")
  }

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    const text = theme==='dark'? 'text-zinc-300' : 'text-zinc-800';
    const background = theme==='dark'? 'bg-[#0b0c19]' : 'bg-[#ffffff]';
  }, [theme])

  return (
    <div className={`fixed overflow-y-auto w-64 min-h-screen p-4 flex flex-col justify-between`}>
        <div>
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

                <Link to='/market' className={`flex items-center gap-2 p-1.5 rounded-lg ${location.pathname === '/market'? 'bg-[#131627]' : 'bg-transparent'}`}>
                    <div className="p-2 rounded-md">
                        <assets.RiDashboardFill className={`text-[18px] ${location.pathname === '/market'? 'text-violet' : 'text-white'}`} />
                    </div>
                    <p className={`text-sm font-semibold ${location.pathname === '/market'? 'text-violet' : 'text-white'}`}>Market</p>
                </Link>

                <Link to='/trending' className={`flex items-center gap-2 p-1.5 rounded-lg ${location.pathname === '/trending'? 'bg-[#131627]' : 'bg-transparent'}`}>
                    <div className="p-2 rounded-md">
                        <assets.IoMdTrendingUp className={`text-[18px] ${location.pathname === '/trending'? 'text-violet' : 'text-white'}`} />
                    </div>
                    <p className={`text-sm font-semibold ${location.pathname === '/trending'? 'text-violet' : 'text-white'}`}>Trending</p>
                </Link>

                <Link to='/wallet' className={`flex items-center gap-2 p-1.5 rounded-lg ${location.pathname === '/wallet'? 'bg-[#131627]' : 'bg-transparent'}`}>
                    <div className="p-2 rounded-md">
                        <assets.IoWallet className={`text-[18px] ${location.pathname === '/wallet'? 'text-violet' : 'text-white'}`} />
                    </div>
                    <p className={`text-sm font-semibold ${location.pathname === '/wallet'? 'text-violet' : 'text-white'}`}>Wallet</p>
                </Link>

                <Link to='/saved' className={`flex items-center gap-2 p-1.5 rounded-lg ${location.pathname === '/saved'? 'bg-[#131627]' : 'bg-transparent'}`}>
                    <div className="p-2 rounded-md">
                        <assets.LuFileDown className={`text-[18px] ${location.pathname === '/saved'? 'text-violet' : 'text-white'}`} />
                    </div>
                    <p className={`text-sm font-semibold ${location.pathname === '/saved'? 'text-violet' : 'text-white'}`}>Saved</p>
                </Link>

                <Link to='/finbot' className={`flex items-center gap-2 p-1.5 rounded-lg ${location.pathname === '/finbot'? 'bg-[#131627]' : 'bg-transparent'}`}>
                    <div className="p-2 rounded-md">
                        <assets.RiRobot2Fill className={`text-[18px] ${location.pathname === '/finbot'? 'text-violet' : 'text-white'}`} />
                    </div>
                    <p className={`text-sm font-semibold ${location.pathname === '/finbot'? 'text-violet' : 'text-white'}`}>FinBot</p>
                </Link>
            </div>
        </div>
        
        <div className='flex items-center gap-2 p-1.5 rounded-lg cursor-pointer' onClick={handleLogout}>
            <div className="p-2 rounded-md">
                <assets.IoMdLogOut className="text-[18px]" />
            </div>
            <p className="text-sm font-semibold">Log out</p>
        </div>
    </div> 
  )
}

export default Sidebar