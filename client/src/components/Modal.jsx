import React, { useState, useEffect, useRef } from 'react'
import assets from '../assets/assets'
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const Modal = ({ selectedCrypto, closeModal }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(selectedCrypto.current_price)
  const [error, setError] = useState(null);
  const [selectedRange, setSelectedRange] = useState(30); 

  const chartData = {
    labels: history.map(entry => new Date(entry[0]).toLocaleDateString()),
    datasets: [
      {
        label: `${selectedCrypto.name} Price`,
        data: history.map(entry => entry[1]),
        borderColor: '#43e643',
        backgroundColor: 'rgba(67, 230, 67, 0.1)',
        borderWidth: 2,
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => `${selectedCrypto.name} Price: $${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { ticks: { display: false }, grid: { display: false } },
      y: { ticks: { color: "#d4d4d8" }, grid: { color: "rgba(255, 255, 255, 0.1)" } },
    },
  };

  const handleValue = (num) => {
    setValue(num * selectedCrypto.current_price)
  }

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [])

  useEffect(() => {
    const fetchHistory = async () => {
        setLoading(true);
        try {
          const response = await fetch(`https://crypto-api-1078438493144.us-central1.run.app/api/crypto/${selectedCrypto.id}/history?days=${selectedRange}`);
          if (!response.ok) throw new Error("Failed to fetch historical data");
          const data = await response.json();
          setHistory(data.prices);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
    };
    fetchHistory();
  }, [selectedCrypto, selectedRange])

  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 text-zinc-300'>
        <div className='bg-[#0b0c19] relative rounded-lg p-5'>
            <div className='flex justify-between items-center w-full'>
                <div className='flex gap-3 items-center'>
                    <img src={selectedCrypto.image} className='w-[40px]' alt="" />
                    <div>
                        <p className='text-xs text-zinc-600'>Proof of Stake</p>
                        <p className='font-medium text-sm mt-1'>{selectedCrypto.name}({selectedCrypto.symbol})</p>
                    </div>
                </div>
                <assets.IoMdClose className='text-white cursor-pointer text-xl smoothTransition hover:text-zinc-400' onClick={() => closeModal('info')} />
            </div>
            <hr className="my-4 h-[1px] bg-gradient-to-r from-[#1c1e39] via-[#343850] to-[#1c1e39] border-0 mx-1" />
            <div className='flex gap-4'>
              <div className='flex flex-col justify-between min-w-[280px]'>
                  <div className='w-full rounded-md bg-darkGray p-3'>
                      <p className='text-xs text-zinc-400'>Price: </p>
                      <p className='text-3xl mt-1 font-medium'>${selectedCrypto.current_price}</p>
                      <div className='flex items-center justify-between'>
                          <div className="flex items-center gap-1 mt-2">
                              <div className={`rounded-md ${selectedCrypto.price_change_percentage_24h > 0? 'bg-[#0d2218]' : 'bg-[#240d16]'}`}>
                                  {selectedCrypto.price_change_percentage_24h > 0? (
                                  <assets.IoArrowUpCircle className='text-[#43e643]' />
                                  ) : (
                                  <assets.IoArrowDownCircle className='text-[#ec3e44]' />
                                  )}
                              </div>
                              <p className={`font-medium text-xs ${selectedCrypto.price_change_percentage_24h > 0? 'text-[#43e643]' : 'text-[#ec3e44]'}`}>{selectedCrypto.price_change_percentage_24h > 0? selectedCrypto.price_change_percentage_24h.toFixed(2) : selectedCrypto.price_change_percentage_24h.toFixed(2) * -1}%</p>
                          </div>
                          <div className=''>
                              {selectedCrypto.price_change_percentage_24h > 1 ? (
                                  <button className='text-darkGray text-xs bg-[#43e643] rounded-md py-1 px-2 font-semibold'>
                                      Promising
                                  </button>
                              ) : selectedCrypto.price_change_percentage_24h > -1 && selectedCrypto.price_change_percentage_24h < 1 ? (
                                  <button className='text-darkGray text-xs bg-[#f4c430] rounded-md py-1 px-2 font-semibold'>
                                      Caution
                                  </button>
                              ) : (
                                  <button className='text-darkGray text-xs bg-[#ec3e44] rounded-md py-1 px-2 font-semibold'>
                                      Risky
                                  </button>
                              )}
                          </div>
                      </div>
                  </div>
                  <div className='text-xs mt-4 px-2 rounded-md shadow-md'>
                      <h3 className='text-sm font-semibold text-zinc-300 mb-3'>Market Details</h3>
                      <div className='grid grid-cols-2 gap-y-3 text-zinc-400'>
                          <p className='font-medium text-zinc-500'>Market Cap Rank:</p>
                          <p className='text-right text-zinc-300'>{selectedCrypto.market_cap_rank}</p>

                          <p className='font-medium text-zinc-500'>Market Cap:</p>
                          <p className='text-right text-zinc-300'>${selectedCrypto.market_cap.toLocaleString()}</p>

                          <p className='font-medium text-zinc-500'>Circulating Supply:</p>
                          <p className='text-right text-zinc-300'>{selectedCrypto.circulating_supply.toLocaleString()}</p>

                          <p className='font-medium text-zinc-500'>Total Supply:</p>
                          <p className='text-right text-zinc-300'>{selectedCrypto.total_supply ? selectedCrypto.total_supply.toLocaleString() : 'N/A'}</p>

                          <p className='font-medium text-zinc-500'>Max Supply:</p>
                          <p className='text-right text-zinc-300'>{selectedCrypto.max_supply ? selectedCrypto.max_supply.toLocaleString() : 'N/A'}</p>

                          <p className='font-medium text-zinc-500'>Last Updated:</p>
                          <p className='text-right text-zinc-300'>{new Date(selectedCrypto.last_updated).toLocaleString()}</p>
                      </div>
                  </div>
                  <div>
                      <div className='flex items-center justify-between border border-zinc-800 rounded-t-md gap-3 py-1.5 px-2.5 w-full mt-3'>
                          <input type="number" className='outline-none bg-transparent text-sm flex-1' defaultValue={1} onChange={(e) => handleValue(e.target.value)} />
                          <p className='text-zinc-400 text-sm'>{selectedCrypto.symbol}</p>
                      </div>
                      <div className='flex items-center justify-between border gap-3 border-zinc-800 rounded-b-md py-1.5 px-2.5 w-full'>
                          <p className='text-sm'>${value}</p>
                          <p className='text-zinc-400 text-sm'>usd</p>
                      </div>
                  </div>
              </div>


              <div className='p-3 bg-darkGray rounded-md w-[760px] min-h-[432px]'>
                  <div className="flex gap-2 mb-4">
                      {[30, 15, 1].map(days => (
                      <button 
                          key={days} 
                          className={`text-darkGray text-xs rounded-md py-1 px-2 font-semibold ${selectedRange === days ? 'bg-[#43e643] text-darkGray' : 'bg-zinc-700 text-zinc-300'}`} 
                          onClick={() => setSelectedRange(days)}
                      >
                          {days === 1 ? 'Last 24 Hours' : `Last ${days} Days`}
                      </button>
                      ))}
                  </div>

                  {!loading ? (
                      <Line data={chartData} options={options} />
                  ) : (
                      <div className='flex flex-col items-center justify-center h-full pb-2'>
                      <svg xmlns='http://www.w3.org/2000/svg' width="60px" viewBox='0 0 300 150'>
                          <path fill='none' stroke='#A392F9' strokeWidth='11' strokeLinecap='round' strokeDasharray='300 385' strokeDashoffset='0' d='M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z'>
                          <animate attributeName='stroke-dashoffset' calcMode='spline' dur='2' values='685;-685' keySplines='0 0 1 1' repeatCount='indefinite'></animate>
                          </path>
                      </svg>
                      <p className='text-zinc-200 mt-4 text-sm'>Hang tight while we fetch the graph...</p>
                      </div>
                  )}
              </div>
           </div>
        </div>
    </div>
  )
}

export default Modal







