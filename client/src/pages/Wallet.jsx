import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar'
import SearchNav from '@/components/SearchNav'
import WalletCard from '@/components/WalletCard';
import { io } from 'socket.io-client';
import Loading from '@/components/Loading';
import assets from '../assets/assets';

const Wallet = () => {
  const [search, setSearch] = useState('');
  const [invested, setInvested] = useState([])
  const [netWorth, setNetWorth] = useState(0)
  const [investments, setInvestments] = useState(0)
  const [top3Cryptos, setTop3Cryptos] = useState([])
  const [loading, setLoading] = useState(true)
  const [priceChangePercent, setPriceChangePercent] = useState()
  const fetchInterval = useRef(null)
  const socket = useRef(null);

  const handleSearch = () => {
    if (search === '') {
        return setUpdatedCryptos(cryptos);
    } else {
        const filteredCryptos = invested.filter(crypto => crypto.name.toLowerCase().includes(search.toLowerCase()));
        setUpdatedCryptos(filteredCryptos);
    }
  };

  const calculateWallet = () => {
    let totalNetWorth = 0, investment = 0
    let cryptoValues = invested.map(crypto => ({
        ...crypto,
        totalValue: Number(crypto.current_price) * Number(crypto.quantity),
        investedValue: Number(crypto.invested_price) * Number(crypto.quantity)
    }))
    cryptoValues.sort((a,b) => b.totalValue - a.totalValue)
    setTop3Cryptos(cryptoValues.slice(0,3))

    cryptoValues.forEach(crypto => {
        totalNetWorth += crypto.totalValue
    })
    cryptoValues.forEach(crypto => {
        investment += crypto.investedValue
    })
    setNetWorth(Number(totalNetWorth))
    setInvestments(Number(investment))
    if (investment !== 0) {
        const percent = (((totalNetWorth - investment) / investment) * 100).toFixed(2);
        setPriceChangePercent(percent);
    } else {
        setPriceChangePercent(0); 
    }
  }

  const fetchInvestedCryptos = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('User not authenticated');
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-invested-cryptos`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setInvested(data);

        localStorage.setItem('invested-cryptos', JSON.stringify({
            data,
            timestamp: Date.now(),
        }));
    } catch (error) {
        console.error('Error fetching invested cryptos: ', error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_API_URL); 
    socket.current.on('investedCryptoUpdated', (updatedCrypto) => {
        setInvested((prevInvested) => {
            const existingIndex = prevInvested.findIndex((crypto) => crypto.id === updatedCrypto.id);
            if (existingIndex !== -1) {
                // Update existing crypto
                const newInvested = [...prevInvested];
                newInvested[existingIndex] = updatedCrypto;
                return newInvested;
            } else {
                return [...prevInvested, updatedCrypto];
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
    const cachedData = localStorage.getItem('invested-cryptos');
    if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const now = Date.now();
        const cacheDuration = 60 * 1000;

        if (now - timestamp < cacheDuration) {
            setInvested(data);
            setLoading(false);
            return;
        }
    }
    fetchInvestedCryptos();
    fetchInterval.current = setInterval(fetchInvestedCryptos, 5 * 60 * 1000);

    return () => {
        clearInterval(fetchInterval.current);
    };
  }, []);

  useEffect(() => {
    calculateWallet()
    console.log("Investments: ", investments, "Net Worth: ", netWorth)
  }, [invested])

  if(loading) return <Loading />

  return (
    <div className='flex text-zinc-300 bg-darkGray min-h-screen overscroll-none'>
      <Sidebar />

      <div className='flex-1 pl-64 bg-darkGray'>
        <SearchNav setSearch={setSearch} handleSearch={handleSearch} />

        <div className='bg-darkBlue flex-1 rounded-xl p-5 m-4'>
            <p className='text-2xl'>Wallet</p>
            <hr className="my-4 h-[1px] bg-gradient-to-r from-[#1c1e39] via-[#343850] to-[#1c1e39] border-0 mx-1" />
            
            <div className='flex justify-between'>
                <div>
                    <p className='font-medium text-zinc-600 text-sm mt-3'>Total Net Worth:</p>
                    <div className="flex gap-0.5 items-end mt-1">
                        <p className='font-medium text-3xl'>${netWorth.toFixed(7)}</p>
                        <p className='text-zinc-600 text-xs font-semibold pb-1'>USD</p>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                        <div className={`rounded-md ${priceChangePercent > 0 ? 'bg-[#0d2218]' : 'bg-[#240d16]'}`}>
                            {priceChangePercent >= 0 ? (
                                <assets.IoArrowUpCircle className='text-[#43e643]' />
                            ) : (
                                <assets.IoArrowDownCircle className='text-[#ec3e44]' />
                            )}
                        </div>
                        <p className={`font-medium text-xs ${priceChangePercent >= 0 ? 'text-[#43e643]' : 'text-[#ec3e44]'}`}>{priceChangePercent >= 0 ? priceChangePercent : priceChangePercent * -1}%</p>
                    </div>
                    <p className='font-medium text-zinc-600 text-sm mt-6'>Total Investments:</p>
                    <div className="flex gap-0.5 items-end mt-1">
                        <p className='font-medium text-3xl'>${investments.toFixed(7)}</p>
                        <p className='text-zinc-600 text-xs font-semibold pb-1'>USD</p>
                    </div>
                </div>
                <div>
                    {top3Cryptos.length > 0 && (
                        <div className='border border-gray-600 rounded-lg w-full h-[30px] p-1 flex gap-1 mt-4'>
                            {top3Cryptos.map((crypto, index) => (
                                <div
                                    key={crypto.id}
                                    className={`h-[20px] rounded-md`}
                                    style={{
                                        width: `${(crypto.totalValue / netWorth) * 584}px`,
                                        backgroundColor: index === 0 ? '#4f46e5' : index === 1 ? '#232b43' : '#1dadc3',
                                    }}
                                ></div>
                            ))}
                            {netWorth - top3Cryptos.reduce((total, crypto) => total + crypto.totalValue, 0) > 0 && (
                                <div
                                    className='bg-[#eeeeee] h-[20px] rounded-md'
                                    style={{
                                        width: `${(
                                            (netWorth - top3Cryptos.reduce((total, crypto) => total + crypto.totalValue, 0)) /
                                            netWorth
                                        ) * 584}px`,
                                    }}
                                ></div>
                            )}
                        </div>
                    )}
                    {top3Cryptos.length > 0 && (
                        <div className='mt-4'>
                            {top3Cryptos.map((crypto, index) => (
                                <div key={crypto.id} className='flex items-center justify-between mt-2'>
                                    <div className='flex items-center gap-2'>
                                        <div
                                            className='w-[15px] h-[15px] rounded-sm'
                                            style={{ backgroundColor: index === 0 ? '#4f46e5' : index === 1 ? '#232b43' : '#1dadc3' }}
                                        ></div>
                                        <p className='text-zinc-400 font-light'>{crypto.name}</p>
                                    </div>
                                    <p className='font-medium text-md'>${crypto.totalValue.toFixed(2)}</p>
                                </div>
                            ))}
                            {netWorth - top3Cryptos.reduce((total, crypto) => total + crypto.totalValue, 0) > 0 && (
                                <div className='flex items-center justify-between mt-2'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-[15px] h-[15px] rounded-sm bg-[#eeeeee]'></div>
                                        <p className='text-zinc-400 font-medium'>Others</p>
                                    </div>
                                    <p className='font-medium text-md'>
                                        ${(netWorth - top3Cryptos.reduce((total, crypto) => total + crypto.totalValue, 0)).toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

        <p className='text-3xl mt-10 pl-4 mb-2'>Investments</p>
        <div>
            {invested.length>0? (
                <div className='grid grid-cols-3 gap-4 p-4'>
                {invested.map((crypto) => (
                <div key={crypto.id} className='p-5 rounded-xl bg-darkBlue cursor-pointer'>
                    <WalletCard crypto={crypto} />
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