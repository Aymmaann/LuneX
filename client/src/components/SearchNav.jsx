import React, { useState } from 'react'
import assets from '../assets/assets'

const SearchNav = ({ setSearch, handleSearch }) => {
  const [isFocused, setIsFocused] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("user-info"))

  return (
    <div className="flex justify-between items-center py-4 px-6 sticky top-0 z-10 backdrop-blur-md bg-darkGray/80 border-b border-zinc-800/50">
      {/* User Profile */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img 
            src={assets.pfp} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover border-2 border-violet shadow-md shadow-violet/20" 
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-darkGray"></div>
        </div>
        <div>
          <p className="font-medium text-zinc-200">{userInfo?.name || 'User'}</p>
          <p className="text-xs text-zinc-400">Online</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`flex items-center min-w-[400px] justify-between ${isFocused ? 'border-violet/60 bg-zinc-800/30' : 'border-zinc-700 bg-zinc-800/10'} rounded-xl py-2 px-4 w-64 transition-all duration-200 shadow-sm`}>
        <assets.IoSearch className={`text-lg ${isFocused ? 'text-violet' : 'text-zinc-500'}`} />
        <input 
          type="text" 
          placeholder="Search crypto..." 
          className="bg-transparent outline-none text-sm placeholder:text-zinc-500 flex-1 ml-3" 
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button 
          onClick={handleSearch}
          className="text-xs font-medium px-2 py-1 rounded-lg bg-violet/10 hover:bg-violet/20 text-violet transition-colors"
        >
          Search
        </button>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4">
        <div className="relative cursor-pointer p-2 hover:bg-zinc-800/50 rounded-full transition-colors">
          <assets.IoMdNotificationsOutline className="text-zinc-400 text-xl hover:text-zinc-200 transition-colors" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-violet rounded-full"></div>
        </div>
        <div className="cursor-pointer p-2 hover:bg-zinc-800/50 rounded-full transition-colors">
          <assets.IoSettingsOutline className="text-zinc-400 text-xl hover:text-zinc-200 transition-colors" />
        </div>
      </div>
    </div>
  )
}

export default SearchNav