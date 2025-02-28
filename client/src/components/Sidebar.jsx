import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import assets from "../assets/assets.js"

const Sidebar = () => {
  const location = useLocation();
  console.log(location.pathname);

//   const [active, setActive] = useState(getActiveLocation);

  return (
    <div className='block fixed overflow-y-auto w-64 h-screen bg-[#0b0c19] p-4'>
        <div className='flex gap-2 items-center w-[100px] pl-2'>
          <img src={assets.noBgLogo} alt="" className='w-[25px]'/>
          <p className='text-lg font-light'>Lune<span className='font-semibold'>X</span></p>
        </div>
        <hr className="my-3 h-[1px] bg-gradient-to-r from-[#1c1e39] via-[#343850] to-[#1c1e39] border-0 mx-3" />

        <div className='mt-4 h-full'>
            <Link to='/' className={`flex items-center gap-2 p-1.5 rounded-lg ${location.pathname === '/'? 'bg-[#1a1f37]' : 'bg-transparent'}`}>
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

            <Link to='/profile' className={`flex items-center gap-2 p-1.5 rounded-lg ${location.pathname === '/profile'? 'bg-[#131627]' : 'bg-transparent'}`}>
                <div className="p-2 rounded-md">
                    <assets.MdPerson className={`text-[18px] ${location.pathname === '/profile'? 'text-violet' : 'text-white'}`} />
                </div>
                <p className={`text-sm font-semibold ${location.pathname === '/profile'? 'text-violet' : 'text-white'}`}>Profile</p>
            </Link>
        </div>
        {/* <div className='p-4 h-full'>
          <div>
            <div className='flex gap-2 items-center w-[100px] absolute left-6 top-4'>
                <img src={assets.noBgLogo} alt="" className='w-[25px]'/>
                <p className='text-lg font-light'>Lune<span className='font-semibold'>X</span></p>
            </div>

            <hr className="my-2 h-[1px] bg-gradient-to-r from-[#1c1e39] via-[#343850] to-[#1c1e39] border-0" />

            <div className='mt-4 text-gray-100'>
              <Link to='/' onClick={() => setActive('home')} className={`flex items-center gap-3 p-2.5 rounded-2xl ${active === 'home'? 'bg-[#1a1f37]' : 'bg-transparent'}`}>
                <div className={`p-2 rounded-xl ${active === 'home'? 'bg-[#1a1f37]' : 'bg-[#1a1f37]'}`}>
                  <assets.FaHome className={`${active === 'home'? 'text-white' : 'text-[#0275ff]'}`} />
                </div>
                <p className='text-sm font-semibold'>Home</p>
              </Link>

              <Link to='/dashboard' onClick={() => setActive('dashboard')} className={`flex items-center gap-3 p-2.5 rounded-2xl ${active === 'dashboard'? 'bg-[#1a1f37]' : 'bg-transparent'}`}>
                <div className={`p-2 rounded-xl ${active === 'dashboard'? 'bg-[#0275ff]' : 'bg-[#1a1f37]'}`}>
                  <assets.MdDashboard className={`${active === 'dashboard'? 'text-white' : 'text-[#0275ff]'}`} />
                </div>
                <p className='text-sm font-semibold'>Dashboard</p>
              </Link>

              <Link to='/transaction' onClick={() => setActive('transaction')} className={`flex items-center gap-3 p-2.5 rounded-2xl ${active === 'transaction'? 'bg-[#1a1f37]' : 'bg-transparent'}`}>
                <div className={`p-2 rounded-xl ${active === 'transaction'? 'bg-[#0275ff]' : 'bg-[#1a1f37]'}`}>
                  <assets.FaCreditCard className={`${active === 'transaction'? 'text-white' : 'text-[#0275ff]'}`} />
                </div>
                <p className='text-sm font-semibold'>Transaction</p>
              </Link>

              <Link to='/budget' onClick={() => setActive('budget')} className={`flex items-center gap-3 p-2.5 rounded-2xl ${active === 'budget'? 'bg-[#1a1f37]' : 'bg-transparent'}`}>
                <div className={`p-2 rounded-xl ${active === 'budget'? 'bg-[#0275ff]' : 'bg-[#1a1f37]'}`}>
                  <assets.FaWallet className={`${active === 'budget'? 'text-white' : 'text-[#0275ff]'}`} />
                </div>
                <p className='text-sm font-semibold'>Budget Planner</p>
              </Link>

              <Link to='/reciept' onClick={() => setActive('budget')} className={`flex items-center gap-3 p-2.5 rounded-2xl ${active === 'budget'? 'bg-[#1a1f37]' : 'bg-transparent'}`}>
                <div className={`p-2 rounded-xl ${active === 'budget'? 'bg-[#0275ff]' : 'bg-[#1a1f37]'}`}>
                  <assets.RiBillFill className={`${active === 'budget'? 'text-white' : 'text-[#0275ff]'}`} />
                </div>
                <p className='text-sm font-semibold'>Reciepts</p>
              </Link>

              <Link to='/chatbot' onClick={() => setActive('chatbot')} className={`flex items-center gap-3 p-2.5 rounded-2xl ${active === 'chatbot'? 'bg-[#1a1f37]' : 'bg-transparent'}`}>
                <div className={`p-2 rounded-xl ${active === 'chatbot'? 'bg-[#0275ff]' : 'bg-[#1a1f37]'}`}>
                  <assets.RiRobot2Fill className={`${active === 'chatbot'? 'text-white' : 'text-[#0275ff]'}`} />
                </div>
                <p className='text-sm font-semibold'>FinBot</p>
              </Link>
            </div>

            <div className='text-gray-100'>
              <p className='uppercase font-semibold text-xs mt-6 mb-2 ml-2 pl-2'>Account Pages</p>
              <Link to='/signin' onClick={() => setActive('signin')} className={`flex items-center gap-3 p-2.5 rounded-2xl ${active === 'signin'? 'bg-[#1a1f37]' : 'bg-transparent'}`}>
                <div className={`p-2 rounded-xl ${active === 'signin'? 'bg-[#0275ff]' : 'bg-[#1a1f37]'}`}>
                  <assets.MdContactPage className={`${active === 'signin'? 'text-white' : 'text-[#0275ff]'}`} />
                </div>
                <p className='text-sm font-semibold'>Sign In</p>
              </Link>

              <Link to='/signup' onClick={() => setActive('signup')} className={`flex items-center gap-3 p-2.5 rounded-2xl ${active === 'signup'? 'bg-[#1a1f37]' : 'bg-transparent'}`}>
                <div className={`p-2 rounded-xl ${active === 'signup'? 'bg-[#0275ff]' : 'bg-[#1a1f37]'}`}>
                  <assets.IoIosRocket className={`${active === 'signup'? 'text-white' : 'text-[#0275ff]'}`} />
                </div>
                <p className='text-sm font-semibold'>Sign Up</p>
              </Link>
            </div>
          </div>
        </div> */}
    </div> 
  )
}

export default Sidebar