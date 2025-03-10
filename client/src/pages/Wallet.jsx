import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar'
import SearchNav from '@/components/SearchNav'
import assets from '../assets/assets';

const Wallet = () => {
  const [search, setSearch] = useState('');
  const [invested, setInvested] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const fetchInterval = useRef(null)

  const handleSearch = () => {
    if (search === '') {
        return setUpdatedCryptos(cryptos);
    } else {
        const filteredCryptos = cryptos.filter(crypto => crypto.name.toLowerCase().includes(search.toLowerCase()));
        setUpdatedCryptos(filteredCryptos);
    }
  };

  const fetchInvestedCryptos = async() => {
    try {
        const token = localStorage.getItem('token')
        if(!token) {
            throw new Error("User not authenticated")
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-invested-cryptos`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": 'application/json'
            }
        })
        if(!response.ok) {
            throw new Error("Failed to fetch data")
        }
        const data = await response.json()
        setInvested(data)

        localStorage.setItem("invested-cryptos", JSON.stringify({
            data,
            timestamp: Date.now()
        }))
    } catch(error) {
        console.error("Error fetching invested cryptos: ", error)
        setDefaultResultOrder(error.message)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    const cachedData = localStorage.getItem("invested-cryptos")
    if(cachedData) {
      const { data, timestamp } = JSON.parse(cachedData)
      const now = Date.now()
      const cacheDuration = 5*60*1000

      if(now - timestamp < cacheDuration) {
        setInvested(data)
        setLoading(false)
        return
      }
    }
    fetchInvestedCryptos();
    fetchInterval.current = setInterval(fetchInvestedCryptos, 5*60*1000)

    return  () => {
      clearInterval(fetchInterval.current)
    }
  }, [])

  return (
    <div className='flex text-zinc-300 bg-darkGray min-h-screen overscroll-none'>
      <Sidebar />

      <div className='flex-1 pl-64 bg-darkGray'>
        <SearchNav setSearch={setSearch} handleSearch={handleSearch} />

        <div className="">
            {invested.length>0? (
                <div className='grid grid-cols-2 gap-4 p-4'>
                {invested.map((crypto) => (
                <div key={crypto.id} className='p-5 rounded-xl bg-darkBlue cursor-pointer'>
                    {/* <SavedCard crypto={crypto} /> */}
                    <p>{crypto.name}</p>
                </div>
                ))}
            </div>
            ) : (
                <p>No saved cryptos found</p>
            )}
        </div>
      </div>
    </div>
  )
}

export default Wallet