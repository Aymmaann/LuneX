import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import SearchNav from '../components/SearchNav';
import assets from '@/assets/assets';

const FinBot = () => {
  const [search, setSearch] = useState('');
  const handleSearch = () => {
    if (search === '') {
        return setUpdatedCryptos(cryptos);
    } else {
        const filteredCryptos = cryptos.filter(crypto => crypto.name.toLowerCase().includes(search.toLowerCase()));
        setUpdatedCryptos(filteredCryptos);
    }
  };

  const userInfo = JSON.parse(localStorage.getItem("user-info"))

  return (
    <div className='flex text-zinc-300 bg-darkGray min-h-screen overscroll-none'>
      <Sidebar />

      <div className='flex-1 pl-64 bg-darkGray'>
        <SearchNav setSearch={setSearch} handleSearch={handleSearch} />

        <div className='p-28 pt-16 flex flex-col justify-between h-full'>
          <div className='flex items-center justify-center pt-36'>
            <p className="bg-gradient-to-b from-zinc-400 to-zinc-700 bg-clip-text text-transparent text-[45px]">Hello, {userInfo?.name}.</p>
            {/* <p className='bg-gradient-to-b from-zinc-400 to-zinc-700 bg-clip-text text-transparent text-[40px]'>How may I help you today?</p> */}
          </div>

          <div className='flex items-center justify-between border border-zinc-800 rounded-2xl gap-3'>
            <input type="text" placeholder='Ask FinBot' className='bg-transparent outline-none text-sm py-4 px-4 flex-1 placeholder:text-zinc-400 h-full' />
            <div className='py-4 px-4 cursor-pointer'>
              <assets.BiRightArrow className='text-zinc-200' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinBot