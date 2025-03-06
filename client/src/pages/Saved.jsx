import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import assets from '../assets/assets'
import NotFound from './NotFound';
import Loading from '../components/Loading';
import SearchNav from '../components/SearchNav';
import SavedCard from '../components/SavedCard';

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
        const filteredCryptos = saved.filter((crypto) => crypto.name.toLowerCase().includes(search.toLowerCase()))
        setSaved(filteredCryptos)
      }
  }

  useEffect(() => {
    const fetchSavedCryptos = async() => {
      try {
        const token = localStorage.getItem("token")
        console.log(token)
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
        console.log(data)
      } catch(err) {
        console.log(localStorage.getItem("token"))
        console.error("Error fetching saved cryptos: ", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSavedCryptos();
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
              <p>No saved cryptos found</p>
            )}
          </div>
        </div>
    </div>
  )
}

export default Saved