import React from 'react'
import assets from '../assets/assets'

const SearchNav = ({ setSearch, handleSearch }) => {
  const userInfo = JSON.parse(localStorage.getItem("user-info"))

  return (
    <div className="flex justify-between items-center py-3 px-4">
        <div className="flex gap-3 items-center">
            <img src={assets.pfp} alt="" className="w-10 rounded-full border border-violet" />
            <p className="font-medium">{userInfo?.name}</p>
        </div>
        <div className="flex items-center justify-between border border-zinc-800 rounded-md py-2 px-3 w-[300px] gap-3">
            <input type="text" 
                   placeholder="Search..." 
                   className="bg-transparent outline-none text-sm placeholder:text-zinc-400 flex-1" 
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
            />
            <assets.IoSearch className="text-zinc-400 cursor-pointer" onClick={handleSearch} />
        </div>
    </div>
  )
}

export default SearchNav