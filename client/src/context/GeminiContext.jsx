import getResponse from "@/config/gemini";
import { createContext, useEffect, useState } from "react";

export const GeminiContext = createContext();

const ContextProvider = ({ children }) => {
    const [input, setInput] = useState('');
    const [recentPrompt, setRecentPrompt] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [savedCryptos, setSavedCryptos] = useState([]);
    const [investedCryptos, setInvestedCryptos] = useState([]);

    const fetchSavedCryptos = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User not authenticated');
            }
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-user-coins`, {
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
            localStorage.setItem('savedCryptosCache', JSON.stringify({ data, timestamp: Date.now() }));
            setSavedCryptos(data);
        } catch (error) {
            console.error('Error fetching saved cryptos: ', error);
        }
    };

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
            localStorage.setItem('investedCryptosCache', JSON.stringify({ data, timestamp: Date.now() }));
            setInvestedCryptos(data);
        } catch (error) {
            console.error('Error fetching invested cryptos: ', error);
        }
    };

    useEffect(() => {
        const cachedSaved = localStorage.getItem('savedCryptosCache');
        const cachedInvested = localStorage.getItem('investedCryptosCache');
        const cacheDuration = 24 * 60 * 60 * 1000;

        if (cachedSaved) {
            const { data, timestamp } = JSON.parse(cachedSaved);
            if (Date.now() - timestamp < cacheDuration) {
                setSavedCryptos(data);
            } else {
                fetchSavedCryptos();
            }
        } else {
            fetchSavedCryptos();
        }

        if (cachedInvested) {
            const { data, timestamp } = JSON.parse(cachedInvested);
            if (Date.now() - timestamp < cacheDuration) {
                setInvestedCryptos(data);
            } else {
                fetchInvestedCryptos();
            }
        } else {
            fetchInvestedCryptos();
        }
    }, []);

    const delayResponse = (text, delay) => {
        if (!text) {
            setResponse(''); 
            return;
        }
        setResponse(text[0] || ''); 
        let charIndex = 0;
        const intervalId = setInterval(() => {
            if (charIndex < text.length) {
                setResponse((prev) => prev + (text[charIndex] || '')); 
                charIndex++;
            } else {
                clearInterval(intervalId);
            }
        }, delay);
    };

    const onSent = async () => {
        setResponse("");
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(input);

        const context = `
            User's Invested Cryptocurrencies:
            ${JSON.stringify(investedCryptos)}

            User's Saved Cryptocurrencies:
            ${JSON.stringify(savedCryptos)}

            Important: You have access to the user's saved and invested cryptocurrency data. This data includes details like current prices, invested prices, quantities, and potentially other relevant information.
            Your primary goal is to provide accurate and helpful responses to the user's questions regarding their cryptocurrencies.

            Flexibility: Be flexible in how you use the provided data. The user might ask about current prices, investment performance, volatility, or any other relevant information.
            Data Priority: Prioritize the data I've given you for answering the user's questions. Do not refer to external sources for the cryptocurrencies I provided unless explicitly asked about things the given data does not provide.
            Enhancements: Feel free to enhance the user experience by providing additional relevant information or insights, if applicable. For example, you could offer comparisons, potential trends, or summaries of the data.
            User Focus: Always keep the user's needs in mind and strive to provide clear, concise, and informative responses.
            Adaptability: Be prepared to adapt to different question styles and formats and be flexible and do not give fixed responses try to make yourself seem like a helper companion for the user in guiding or advising them.
            Use the provided data to answer the user's question below. Do not mention that you are using the provided data, just answer the question as if you have access to the information or else if the user asks about something 
            else you're free to answer how you deem worthy either by referring external sources or from your own knowledge and fyi your name is 'finbot' but you dont have to refer to this often but that's just to let you know.

            User's Question: ${input}
        `;
        
        const result = await getResponse(context);

        delayResponse(result, 4);
        setLoading(false);
        setInput('');
        console.log(response);
    };

    const contextValue = {
        input,
        setInput,
        onSent,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        response,
        savedCryptos,
        investedCryptos,
    };

    return (
        <GeminiContext.Provider value={contextValue}>
            {children}
        </GeminiContext.Provider>
    );
};

export default ContextProvider;