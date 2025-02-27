import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import assets from '../assets/assets'

const Dashboard = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true)
  
  return (
    <div className='flex text-zinc-200'>
      <Sidebar />

      <div className='flex-1 pl-64 bg-[#05060f] h-screen'>
        {/* Navbar */}
        <div className="flex justify-between items-center py-3 px-4">
          {/* Profile */}
          <div className="flex gap-3 items-center">
            <img src={assets.pfp} alt="" className="w-10 rounded-full border border-violet" />
            <p className="font-light">Mark Johnson</p>
          </div>
          {/* Search */}
          <div className="flex items-center justify-between border border-zinc-800 rounded-md py-2 px-3 w-[300px] gap-3">
            <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm placeholder:text-zinc-400 flex-1" />
            <assets.IoSearch className="text-zinc-400" />
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Dashboard