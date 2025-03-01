import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import assets from '../assets/assets'
import NotFound from './NotFound';
import Loading from '../components/Loading';
import SearchNav from '../components/SearchNav';

const Saved = () => {
  const [saved, setSaved] = useState([]);
  const [updatedSaved, setUpdatedSaved] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
const handleSearch = () => {
    if(search === '') {
    return setSaved(cryptos)
    } else {
    const filteredCryptos = saved.filter(crypto => saved.name.toLowerCase().includes(search.toLowerCase()))
    setSaved(filteredCryptos)
    }
}

if(loading) return <Loading />
if(error) return <NotFound />

return (
    <div className='flex text-zinc-300 bg-[#05060f] min-h-screen overscroll-none'>
        <Sidebar />

        <div className='flex-1 pl-64 bg-[#05060f]'>
            <SearchNav setSearch={setSearch} handleSearch={handleSearch} />
        </div>
    </div>
  )
}

export default Saved