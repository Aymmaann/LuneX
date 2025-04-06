import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar'
import assets from '../assets/assets'
import NotFound from './NotFound';
import Loading from '../components/Loading';
import SearchNav from '../components/SearchNav';
import SavedCard from '../components/SavedCard';
import EmptyPage from '@/components/EmptyPage';
import { io } from 'socket.io-client'; 

const Saved = () => {
  const [saved, setSaved] = useState([]);
  const [updatedSaved, setUpdatedSaved] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fetchInterval = useRef(null)
  const socket = useRef(null);
  
  const handleSearch = () => {
      if(search === '') {
        return setSaved(cryptos)
      } else {
        const filteredCryptos = saved.filter((crypto) => crypto.name.toLowerCase().includes(search.toLowerCase()))
        setSaved(filteredCryptos)
      }
  }

  const fetchSavedCryptos = async() => {
    try {
      const token = localStorage.getItem("token")
      if(!token) {
        throw new Error("User not authenticated")
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-user-coins`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json',
        }
      })
      if(!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json()
      setSaved(data)

      localStorage.setItem("saved-cryptos", JSON.stringify({
        data,
        timestamp: Date.now()
      }))

    } catch(err) {
      console.error("Error fetching saved cryptos: ", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_API_URL); 
    socket.current.on('savedCryptoUpdated', (updatedCrypto) => {
        setSaved((prevSaved) => {
            const existingIndex = prevSaved.findIndex((crypto) => crypto.id === updatedCrypto.id);
            if (existingIndex !== -1) {
                const newSaved = [...prevSaved];
                newSaved[existingIndex] = updatedCrypto;
                return newSaved;
            } else {
                return [...prevSaved, updatedCrypto];
            }
        });
    });
    return () => {
        if (socket.current) {
            socket.current.disconnect(); 
        }
    };
  }, []);

  useEffect(() => {
    const cachedData = localStorage.getItem("saved-cryptos")
    if(cachedData) {
      const { data, timestamp } = JSON.parse(cachedData)
      const now = Date.now()
      const cacheDuration = 60*1000

      if(now - timestamp < cacheDuration) {
        setSaved(data)
        setLoading(false)
        return
      }
    }
    fetchSavedCryptos();
    fetchInterval.current = setInterval(fetchSavedCryptos, 5*60*1000)

    return  () => {
      clearInterval(fetchInterval.current)
    }
  }, [])

  if(loading) return <Loading />
  if(error) return <NotFound />

return (
    <div className='flex text-zinc-300 bg-[#05060f] min-h-screen overscroll-none'>
        <Sidebar />

        <div className='flex-1 pl-64 bg-[#05060f]'>
          <SearchNav setSearch={setSearch} handleSearch={handleSearch} />

          <div className="">
            {saved.length>0? (
              <div className='grid grid-cols-2 gap-4 p-4'>
              {saved.map((crypto) => (
                <div key={crypto.id} className='p-5 rounded-xl bg-darkBlue cursor-pointer'>
                  <SavedCard crypto={crypto} />
                </div>
              ))}
            </div>
            ) : (
              <EmptyPage text='watchlist' />
              // <div className='w-full p-16 flex items-center justify-center '>
              //   <div className='bg-darkBlue p-6 rounded-lg border border-zinc-800 text-center'>

              //     <div className='bg-mediumBlue w-full h-[192px] rounded-t-lg p-5'>
              //       <div className='bg-darkBlue w-full h-[40px] rounded-md flex items-center justify-between px-4'>
              //         <div className='h-[10px] rounded-full w-[10px] bg-zinc-400'></div>
              //         <div className='h-[10px] rounded-lg w-[150px] bg-zinc-400'></div>
              //         <div className='h-[10px] rounded-lg w-[60px] bg-zinc-400'></div>
              //       </div>
              //       <div className='bg-darkBlue w-full h-[40px] rounded-md flex items-center justify-between px-4 mt-4'>
              //         <div className='h-[10px] rounded-lg w-[120px] bg-zinc-400'></div>
              //         <div className='h-[10px] rounded-full w-[100px] bg-zinc-400'></div>
              //         <div className='h-[10px] rounded-lg w-[40px] bg-zinc-400'></div>
              //       </div>
              //       <div className='bg-darkBlue w-full h-[40px] rounded-md flex items-center justify-between px-4 mt-4'>
              //         <div className='h-[10px] rounded-full w-[70px] bg-zinc-400'></div>
              //         <div className='h-[10px] rounded-lg w-[10px] bg-zinc-400'></div>
              //         <div className='h-[10px] rounded-lg w-[170px] bg-zinc-400'></div>
              //       </div>
              //     </div>

              //     <p className='font-semibold text-xl mt-8'>Your watchlist is empty</p>
              //     <p className='w-[500px] text-zinc-500 text-sm mt-4'>Kickstart your crypto journey by exploring the market and building your watchlist.</p>
              //     <Link to="/market">
              //       <button className='mt-6 py-2 px-4 bg-white text-darkBlue rounded-md smoothTransition font-medium text-sm hover:bg-zinc-300 hover:cursor-pointer'>Browse Market</button>
              //     </Link>
              //   </div>
              // </div>
            )}
          </div>
        </div>
    </div>
  )
}

export default Saved