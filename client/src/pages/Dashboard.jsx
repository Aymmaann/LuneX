import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import assets from '../assets/assets'
import Loading from '../components/Loading';
import NotFound from './NotFound';

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
          {/* Profile */}
          <div className="flex gap-3 items-center">
            <img src={assets.pfp} alt="" className="w-10 rounded-full border border-violet" />
            <p className="font-light">Mark Johnson</p>
          </div>
          {/* Search */}
          <div className="flex items-center justify-between border border-zinc-800 rounded-md py-2 px-3 w-[300px] gap-3">
            <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm placeholder:text-zinc-400 flex-1" onChange={(e) => setInput(e.target.value)}/>
            <assets.IoSearch className="text-zinc-400 cursor-pointer" onClick={handleSearch} />
          </div>
        </div>

        {/* Render all cryptos */}
        <div className='flex items-center gap-4 flex-wrap p-4'>
          {updatedCryptos.map((crypto) => (
            <div key={crypto.id} className='p-5 rounded-xl w-[350px] bg-[#0b0c19]'>
              <div className='flex justify-between items-center'>
                <div className='flex gap-3 items-center'>
                  <img src={crypto.image} className='w-[30px] rounded-md' alt="" />
                  <div>
                    <p className='text-zinc-500 text-xs'>Proof of Stake</p>
                    <p className='text-sm font-light'>{crypto.name} ({crypto.symbol})</p>
                  </div>
                </div>
                <assets.CiSaveDown1 className='text-zinc-500 text-[20px] cursor-pointer' />
              </div>

              <p className='text-xs text-zinc-500 mt-6'>Price:</p>
              <p className='text-3xl font-medium mt-2'>${crypto.current_price}</p>
              <div className="flex items-center gap-1 mt-2">
                <div className={`rounded-md ${crypto.price_change_percentage_24h > 0? 'bg-[#0d2218]' : 'bg-[#240d16]'}`}>
                  {crypto.price_change_percentage_24h > 0? (
                    <assets.IoArrowUpCircle className='text-[#43e643]' />
                  ) : (
                    <assets.IoArrowDownCircle className='text-[#ec3e44]' />
                  )}
                </div>
                <p className={`font-medium text-xs ${crypto.price_change_percentage_24h > 0? 'text-[#43e643]' : 'text-[#ec3e44]'}`}>{crypto.price_change_percentage_24h > 0? crypto.price_change_percentage_24h.toFixed(2) : crypto.price_change_percentage_24h.toFixed(2) * -1}%</p>
              </div>
              <div className='flex items-center justify-between mt-4 text-zinc-500'>
                <p className='text-sm font-light'>24H High: <span className='font-medium text-zinc-200'>${crypto.high_24h}</span></p>
                <p className='text-sm font-light'>24H Low: <span className='font-medium text-zinc-200'>${crypto.low_24h}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}

export default Dashboard