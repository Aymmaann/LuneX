import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import NotFound from './NotFound';
import Loading from '../components/Loading';
import SearchNav from '../components/SearchNav';
import SavedCard from '../components/SavedCard';
import EmptyPage from '../components/EmptyPage';
import { io } from 'socket.io-client';
import CryptoAnalysisService from '../services/cryptoAnalysisService';
import PortfolioSummary from '../components/PortfolioSummary';

const Saved = () => {
  const [saved, setSaved] = useState([]);
  const [originalSaved, setOriginalSaved] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [sortBy, setSortBy] = useState('investment_score');
  const [sortOrder, setSortOrder] = useState('desc');
  const fetchInterval = useRef(null);
  const socket = useRef(null);
  
  const handleSearch = () => {
    if(search === '') {
      setSaved(originalSaved);
    } else {
      const filteredCryptos = originalSaved.filter((crypto) => 
        crypto.name.toLowerCase().includes(search.toLowerCase()) || 
        crypto.symbol.toLowerCase().includes(search.toLowerCase())
      );
      setSaved(filteredCryptos);
    }
  };

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('desc'); 
    }
  };

  const sortCryptos = (list) => {
    return [...list].sort((a, b) => {
      let valueA, valueB;
      
      switch(sortBy) {
        case 'name':
          return sortOrder === 'asc' 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
          
        case 'price':
          valueA = a.current_price?.float || a.current_price?.integer || 0;
          valueB = b.current_price?.float || b.current_price?.integer || 0;
          break;
          
        case 'price_change_percentage':
          valueA = a.price_change_percentage || 0;
          valueB = b.price_change_percentage || 0;
          break;
          
        case 'investment_score':
          valueA = a.investment_score || 0;
          valueB = b.investment_score || 0;
          break;
          
        case 'risk_score':
          valueA = a.risk_score || 0;
          valueB = b.risk_score || 0;
          break;
          
        case 'performance':
          // Map performance categories to numeric values
          const performanceRank = {
            'Strong Performer': 4,
            'Moderate Performer': 3,
            'Slight Underperformer': 2,
            'Underperformer': 1
          };
          valueA = performanceRank[a.performance_category] || 0;
          valueB = performanceRank[b.performance_category] || 0;
          break;
          
        default:
          valueA = 0;
          valueB = 0;
      }
      
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    });
  };

  const fetchCryptoData = async () => {
    try {
      // First get the saved coins basic data
      const token = localStorage.getItem("token");
      if(!token) {
        throw new Error("User not authenticated");
      }
      
      // Then fetch the analysis data
      const analysisData = await CryptoAnalysisService.getAnalysisData();
      
      if (!analysisData || !analysisData.coins || analysisData.coins.length === 0) {
        throw new Error("No analysis data available");
      }
      
      setPortfolioData(analysisData.portfolio);
      setOriginalSaved(analysisData.coins);
      setSaved(analysisData.coins);
      
      localStorage.setItem("saved-cryptos", JSON.stringify({
        data: analysisData.coins,
        timestamp: Date.now()
      }));
      
    } catch(err) {
      console.error("Error fetching crypto data: ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set up socket connection for real-time updates
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
    // Check for cached data first
    const cachedData = localStorage.getItem("saved-cryptos");
    if(cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      const cacheDuration = 5 * 60 * 1000; // 5 minutes

      if(now - timestamp < cacheDuration) {
        setOriginalSaved(data);
        setSaved(data);
        setLoading(false);
        
        // Still fetch in background to update
        fetchCryptoData();
        return;
      }
    }
    
    // No valid cache, need to fetch
    fetchCryptoData();
    fetchInterval.current = setInterval(fetchCryptoData, 5 * 60 * 1000);

    return () => {
      clearInterval(fetchInterval.current);
    };
  }, []);

  // Apply sorting when sortBy or sortOrder changes
  useEffect(() => {
    setSaved(sortCryptos(saved));
  }, [sortBy, sortOrder]);

  if(loading) return <Loading />;
  if(error) return <NotFound />;

  return (
    <div className='flex text-zinc-300 bg-[#05060f] min-h-screen overscroll-none'>
      <Sidebar />

      <div className='flex-1 pl-64 bg-[#05060f]'>
        <SearchNav setSearch={setSearch} handleSearch={handleSearch} />

        {/* Portfolio Summary */}
        {portfolioData && <PortfolioSummary data={portfolioData} />}

        {/* Sorting Controls */}
        <div className="flex flex-wrap gap-2 px-4 pt-4">
          <button
            onClick={() => handleSort('investment_score')}
            className={`px-3.5 py-2 rounded-md text-xs ${sortBy === 'investment_score' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Investment Score {sortBy === 'investment_score' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          
          <button
            onClick={() => handleSort('price_change_percentage')}
            className={`px-3 py-1 rounded-md text-xs ${sortBy === 'price_change_percentage' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Price Change {sortBy === 'price_change_percentage' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          
          <button
            onClick={() => handleSort('performance')}
            className={`px-3 py-1 rounded-md text-xs ${sortBy === 'performance' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Performance {sortBy === 'performance' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          
          <button
            onClick={() => handleSort('risk_score')}
            className={`px-3 py-1 rounded-md text-xs ${sortBy === 'risk_score' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Risk {sortBy === 'risk_score' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          
          <button
            onClick={() => handleSort('price')}
            className={`px-3 py-1 rounded-md text-xs ${sortBy === 'price' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Price {sortBy === 'price' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          
          <button
            onClick={() => handleSort('name')}
            className={`px-3 py-1 rounded-md text-xs ${sortBy === 'name' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Name {sortBy === 'name' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
        </div>

        {/* Cryptocurrencies Grid */}
        <div className="">
          {saved.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
              {saved.map((crypto) => (
                <div key={crypto.id} className='p-5 rounded-xl bg-darkBlue cursor-pointer'>
                  <SavedCard crypto={crypto} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyPage text='watchlist' />
          )}
        </div>
      </div>
    </div>
  );
};

export default Saved;