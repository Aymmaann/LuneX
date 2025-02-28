import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import assets from '../assets/assets'
import Loading from '../components/Loading';
import NotFound from './NotFound';
import CryptoCard from '../components/CryptoCard';

const Dashboard = () => {
  const [cryptos, setCryptos] = useState([]);
  const [updatedCryptos, setUpdatedCryptos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [input, setInput] = useState('')

  const handleSearch = () => {
    if(input === '') {
      return setUpdatedCryptos(cryptos)
    } else {
      const filteredCryptos = cryptos.filter(crypto => crypto.name.toLowerCase().includes(input.toLowerCase()))
      setUpdatedCryptos(filteredCryptos)
    }
  }

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await fetch("https://crypto-api-1078438493144.us-central1.run.app/api/cryptos")
        if(!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json()
        setCryptos(data)
        setUpdatedCryptos(data)
        
      } catch(error) {
        setError(error.message)
      } finally {
        setLoading(false)
      } 
    }
    fetchCryptos()
  }, [])

  if(loading) return <Loading />
  if(error) return <NotFound />
  
  return (
    <div className='flex text-zinc-300 bg-[#05060f] min-h-screen overscroll-none'>
      <Sidebar />

      <div className='flex-1 pl-64 bg-[#05060f]'>
        {/* Navbar */}
        <div className="flex justify-between items-center py-3 px-4">
          <div className="flex gap-3 items-center">
            <img src={assets.pfp} alt="" className="w-10 rounded-full border border-violet" />
            <p className="font-light">Mark Johnson</p>
          </div>
          <div className="flex items-center justify-between border border-zinc-800 rounded-md py-2 px-3 w-[300px] gap-3">
            <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm placeholder:text-zinc-400 flex-1" onChange={(e) => setInput(e.target.value)}/>
            <assets.IoSearch className="text-zinc-400 cursor-pointer" onClick={handleSearch} />
          </div>
        </div>

        {/* Rendering all cryptos */}
        <div className='flex items-center gap-4 flex-wrap p-4'>
          {updatedCryptos.map((crypto) => (
            <div key={crypto.id} className='p-5 rounded-xl w-[350px] bg-[#0b0c19]'>
              <CryptoCard crypto={crypto} />
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}

export default Dashboard