import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import SearchNav from '@/components/SearchNav'
import assets from '../assets/assets';

const Wallet = () => {
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    if (search === '') {
        return setUpdatedCryptos(cryptos);
    } else {
        const filteredCryptos = cryptos.filter(crypto => crypto.name.toLowerCase().includes(search.toLowerCase()));
        setUpdatedCryptos(filteredCryptos);
    }
  };
  return (
    <div className='flex text-zinc-300 bg-darkGray min-h-screen overscroll-none'>
      <Sidebar />
      
      <div className='flex-1 pl-64 bg-darkGray'>
        <SearchNav setSearch={setSearch} handleSearch={handleSearch} />
      </div>
    </div>
  )
}

export default Wallet