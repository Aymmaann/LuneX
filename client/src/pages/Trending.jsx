import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Loading from '../components/Loading';
import NotFound from './NotFound';
import TrendingCrypto from '../components/TrendingCrypto';
import SearchNav from '../components/SearchNav';
import Modal from '../components/Modal';
import TrendingModal from '../components/TrendingModal';

const Trending = () => {
  const [trending, setTrending] = useState([]);
  const [updatedCryptos, setUpdatedCryptos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState(null)

  const handleSearch = () => {
    if(search === '') {
        setUpdatedCryptos(trending)
    } else {
        const filteredCryptos = trending.filter(crypto => crypto.item.name.toLowerCase().includes(search.toLowerCase()))  
        setUpdatedCryptos(filteredCryptos)
    }
  }

  const openModal = (crypto) => {
    setSelectedCrypto(crypto)
  }

  const closeModal = () => {
    setSelectedCrypto(null)
  }

  useEffect(() => {
    const fetchTrendingCrypto = async() => {
        try {
            const response = await fetch("https://crypto-api-1078438493144.us-central1.run.app/trending")
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
    <div className='flex text-zinc-300 bg-darkGray min-h-screen overscroll-none'>
        <Sidebar />

        <div className='flex-1 pl-64 bg-darkGray'>
            <SearchNav setSearch={setSearch} handleSearch={handleSearch} updatedCryptos={updatedCryptos} />

            <div className='grid grid-cols-3 gap-4 p-4'>
                {updatedCryptos.map(crypto => (
                    <div key={crypto.item.id} className='p-5 rounded-xl bg-darkBlue' onClick={() => openModal(crypto)}>
                        <TrendingCrypto crypto={crypto}/>
                    </div>
                ))}
            </div>

            {selectedCrypto && <TrendingModal selectedCrypto={selectedCrypto} closeModal={closeModal} />}
        </div>
    </div>
  )
}

export default Trending