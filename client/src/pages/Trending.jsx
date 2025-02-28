import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import assets from '../assets/assets'
import Loading from '../components/Loading';
import NotFound from './NotFound';
import CryptoCard from '../components/CryptoCard';
import TrendingCrypto from '../components/TrendingCrypto';

const Trending = () => {
  const [trending, setTrending] = useState([]);
  const [updatedCryptos, setUpdatedCryptos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  const handleSearch = () => {
    if(search === '') {
        setUpdatedCryptos(trending)
    } else {
        const filteredCryptos = trending.filter(crypto => crypto.item.name.toLowerCase().includes(search.toLowerCase()))  
        setUpdatedCryptos(filteredCryptos)
    }
  }

  useEffect(() => {
    const fetchTrendingCrypto = async() => {
        try {
            const response = await fetch("http://localhost:8080/trending")
            if(!response.ok) throw new Error("Failed to fetch data");
            const data = await response.json()
            setTrending(data)
            setUpdatedCryptos(data)
        } catch(error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }
    fetchTrendingCrypto()
  }, [])

  if(loading) return <Loading />
  if(error) return <NotFound />

  return (
    <div className='flex text-zinc-300 bg-[#05060f] min-h-screen overscroll-none'>
        <Sidebar />

        <div className='flex-1 pl-64 bg-[#05060f]'>
            <div className="flex justify-between items-center py-3 px-4">
                <div className="flex gap-3 items-center">
                    <img src={assets.pfp} alt="" className="w-10 rounded-full border border-violet" />
                    <p className="font-light">Mark Johnson</p>
                </div>
                <div className="flex items-center justify-between border border-zinc-800 rounded-md py-2 px-3 w-[300px] gap-3">
                    <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm placeholder:text-zinc-400 flex-1" onChange={(e) => setSearch(e.target.value)}/>
                    <assets.IoSearch className="text-zinc-400 cursor-pointer" onClick={handleSearch} />
                </div>
            </div>

            <div className='grid grid-cols-2 gap-4 p-4'>
                {updatedCryptos.map(crypto => (
                    <div key={crypto.item.id} className='p-5 rounded-xl bg-[#0b0c19]'>
                        <TrendingCrypto crypto={crypto}/>
                    </div>
                ))}
            </div>

        </div>
    </div>
  )
}

export default Trending