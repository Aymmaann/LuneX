import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import NotFound from './NotFound';
import CryptoCard from '../components/CryptoCard';
import SearchNav from '../components/SearchNav';
import Modal from '../components/Modal';

const Market = () => {
    const [cryptos, setCryptos] = useState([]);
    const [updatedCryptos, setUpdatedCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedCrypto, setSelectedCrypto] = useState(null);

    const handleSearch = () => {
        if (search === '') {
            return setUpdatedCryptos(cryptos);
        } else {
            const filteredCryptos = cryptos.filter(crypto => crypto.name.toLowerCase().includes(search.toLowerCase()));
            setUpdatedCryptos(filteredCryptos);
        }
    };

    const openModal = (crypto) => {
        setSelectedCrypto(crypto);
    };

    const closeModal = () => {
        setSelectedCrypto(null);
    };

    useEffect(() => {
        const fetchCryptos = async () => {
            try {
                const response = await fetch("https://crypto-api-1078438493144.us-central1.run.app/api/cryptos");
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                setCryptos(data);
                setUpdatedCryptos(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCryptos();
    }, []);

    if (loading) return <Loading />;
    if (error) return <NotFound />;

    return (
        <div className='flex text-zinc-300 bg-darkGray min-h-screen overscroll-none'>
            <Sidebar />

            <div className='flex-1 pl-64 bg-darkGray'>
                <SearchNav setSearch={setSearch} handleSearch={handleSearch} />

                <div className='grid grid-cols-3 gap-4 p-4'>
                    {updatedCryptos.map((crypto) => (
                        <div key={crypto.id} className='p-5 rounded-xl bg-darkBlue cursor-pointer' onClick={() => openModal(crypto)}>
                            <CryptoCard crypto={crypto} />
                        </div>
                    ))}
                </div>
            </div>
            {selectedCrypto && <Modal selectedCrypto={selectedCrypto} closeModal={closeModal} />}
        </div>
    );
};

export default Market;