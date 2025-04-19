import React, { useContext, useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import SearchNav from '../components/SearchNav';
import assets from '@/assets/assets';
import { GeminiContext } from '@/context/GeminiContext';
import ReactMarkdown from 'react-markdown';

const FinBot = () => {
  const { onSent, input, setInput, recentPrompt, showResult, response, loading } = useContext(GeminiContext);
  const [search, setSearch] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([
    "What are the current crypto market trends?",
    "Explain decentralized finance (DeFi) simply",
    "How do I start investing with a small budget?",
    "What's the difference between stocks and bonds?"
  ]);

  const handleSearch = () => {
    if (search === '') {
      return setUpdatedCryptos(cryptos);
    } else {
      const filteredCryptos = cryptos.filter(crypto => crypto.name.toLowerCase().includes(search.toLowerCase()));
      setUpdatedCryptos(filteredCryptos);
    }
  };

  const handleSend = () => {
    if (input.trim() === '') {
      return;
    }
    onSent();
    setInput('');
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response, recentPrompt]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const userInfo = JSON.parse(localStorage.getItem("user-info"));

  return (
    <div className="flex text-zinc-300 bg-darkGray min-h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 pl-64 bg-darkGray flex flex-col h-screen">
        <SearchNav setSearch={setSearch} handleSearch={handleSearch} />

        <div className="flex-1 flex flex-col px-8 md:px-12 lg:px-20 overflow-hidden">
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto pb-4 scroll-smooth">
            {!showResult ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="bg-gradient-to-b from-zinc-300 to-zinc-600 bg-clip-text text-transparent text-3xl md:text-5xl pb-6">
                  Hello, {userInfo?.name || 'there'}
                </p>
                <p className="text-zinc-400 text-center mb-8">Ask me anything about finance, crypto, or investments</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-4">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="bg-zinc-800/50 hover:bg-zinc-700/60 border border-zinc-700 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                    >
                      <p className="text-zinc-300 text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 pt-6">
                {/* User Message */}
                <div className="flex gap-3 justify-end">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-zinc-500 mb-1 mr-2">You</span>
                    <div className="bg-violet/10 border border-violet/30 px-4 py-2 rounded-2xl rounded-tr-md max-w-[80%]">
                      <p className="leading-relaxed text-sm text-zinc-200">{recentPrompt}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
                    <img src={assets.bgPlain} alt="User" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Bot Response */}
                <div className="flex gap-3">
                  <div className="p-2 h-8 rounded-full bg-violet/20 flex items-center justify-center">
                    <assets.RiRobot2Fill 
                      className={`text-xl text-violet ${loading ? 'animate-pulse' : ''}`}
                      style={loading ? {
                        animation: 'rotateRobot 2s linear infinite',
                        transformOrigin: 'center center',
                      } : {}}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-500 mb-1 ml-2">FinBot</span>
                    <div className="bg-zinc-800/80 border border-zinc-700/50 px-4 py-3 rounded-2xl rounded-tl-md max-w-[90%]">
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      ) : (
                        <div className="text-sm leading-7 prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{response.trim()}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 sticky bottom-0 bg-darkGray">
            <div className={`flex items-center border ${isInputFocused ? 'border-violet/50 ring-1 ring-violet/30' : 'border-zinc-700'} rounded-xl transition-all duration-200 bg-zinc-800/30 backdrop-blur-sm`}>
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Ask FinBot about finance, crypto, or investments..." 
                className="bg-transparent outline-none text-sm py-4 px-4 flex-1 placeholder:text-zinc-500 h-full"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
              <button 
                onClick={handleSend}
                disabled={input.trim() === ''}
                className={`py-2 px-4 mr-2 rounded-lg flex items-center justify-center ${input.trim() ? 'bg-violet hover:bg-violet/90 cursor-pointer' : 'bg-zinc-700 cursor-not-allowed'} transition-colors duration-200`}
              >
                <assets.BiRightArrow className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinBot;