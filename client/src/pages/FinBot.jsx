import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import SearchNav from '../components/SearchNav';
import assets from '@/assets/assets';
import { GeminiContext } from '@/context/GeminiContext';
import ReactMarkdown from 'react-markdown';

const FinBot = () => {
  const { onSent, input, setInput, recentPrompt, showResult, response, loading } = useContext(GeminiContext)
  const [search, setSearch] = useState('');
  const handleSearch = () => {
    if (search === '') {
        return setUpdatedCryptos(cryptos);
    } else {
        const filteredCryptos = cryptos.filter(crypto => crypto.name.toLowerCase().includes(search.toLowerCase()));
        setUpdatedCryptos(filteredCryptos);
    }
  };

  const handleSend = () => {
    if(input === '') {
      alert('Please enter a message')
      return
    }
    onSent() 
    setInput('')
  }

  const userInfo = JSON.parse(localStorage.getItem("user-info"))

  return (
    <div className='flex text-zinc-300 bg-darkGray min-h-screen overscroll-none'>
      <Sidebar />

      <div className='flex-1 pl-64 bg-darkGray overflow-y-hidden'>
        <SearchNav setSearch={setSearch} handleSearch={handleSearch} />

        <div className='px-28 pb-24 pt-10 flex flex-col justify-between h-full'>

          {!showResult? (
            <div className='flex items-center justify-center pt-36'>
              <p className="bg-gradient-to-b from-zinc-300 to-zinc-600 bg-clip-text text-transparent text-[45px]">Hello, {userInfo?.name}.</p>
            </div>
          ) : (
            <div className='max-h-[80vh]'>
              <div className='flex gap-5 justify-end'>
                <img src={assets.bgPlain} alt="" className='w-[35px] h-[35px]'/>
                <p className='bg-zinc-700 px-4 py-2 rounded-3xl rounded-tr-[5px] leading-8 tracking-wide max-h-[20vh] overflow-y-scroll text-sm'>{recentPrompt}</p>
              </div>
              <div className='flex gap-5 mt-5'>
                <div className='w-[35px] h-[35px]'>
                  <assets.RiRobot2Fill className='text-[30px] text-violet' 
                      style={
                        loading? {
                          animation: 'rotateRobot 2s linear infinite',
                          transformOrigin: 'center center',
                        } : {}
                      }
                  />
                </div>
                {loading? (
                  <p className='leading-8 tracking-wide text-sm'>Loading...</p>
                ) : (
                  <div className='leading-8 tracking-wide max-h-[60vh] overflow-y-scroll text-sm'>
                    <ReactMarkdown>{response.trim()}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}


          <div className='flex items-center justify-between border border-zinc-800 rounded-lg gap-3'>
            <input type="text" 
                   placeholder='Ask FinBot' 
                   className='bg-transparent outline-none text-sm py-4 px-4 flex-1 placeholder:text-zinc-400 h-full'
                   onChange={(e) => setInput(e.target.value)}
                   value={input}
                   onKeyDown={(e) => e.key==='Enter' && handleSend()}
            />
            <div className='py-4 px-4 cursor-pointer'>
              <assets.BiRightArrow className='text-zinc-200' onClick={handleSend} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinBot