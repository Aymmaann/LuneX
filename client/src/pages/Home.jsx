import React from 'react'
import assets from '../assets/assets'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Home = () => {
  const features = [
    {
      icon: <assets.BiSolidAnalyse className="text-3xl" />,
      title: "Smart Risk Analysis",
      description: "Instantly assess crypto volatility based on market trends",
      gradient: "from-violet to-purple-500"
    },
    {
      icon: <assets.MdSpatialTracking className="text-3xl" />,
      title: "Real-Time Tracking",
      description: "Stay updated with live price movements and market data",
      gradient: "from-[#a392f9] to-[#8a70f7]"
    },
    {
      icon: <assets.FaBell className="text-xl" />,
      title: "Personalized Alerts",
      description: "Get notified about key market changes tailored to your portfolio",
      gradient: "from-violet to-indigo-500"
    },
    {
      icon: <assets.RiRobot2Fill className="text-3xl" />,
      title: "FinBot Assistant",
      description: "Chat with FinBot for real-time investment insights and personalized crypto tracking",
      gradient: "from-violet to-blue-500"
    },
    {
      icon: <assets.IoAnalyticsOutline className="text-3xl" />,
      title: "Advanced Analytics Dashboard",
      description: "Dive deep into performance metrics for the cryptos you're monitoring, all in one place",
      gradient: "from-violet to-blue-500"
    },
    {
      icon: <assets.FaReact className="text-3xl" />,
      title: "Intuitive Interface",
      description: "A seamless, user-friendly experience for effortless crypto monitoring",
      gradient: "from-violet to-blue-500"
    }
  ];

  return (
    <div className="w-full min-h-screen text-zinc-200 bg-[url('/src/assets/images/error-bg.jpg')] bg-top bg-cover bg-fixed flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center px-4 py-20 max-w-6xl mx-auto w-full mt-20">
        <div className='flex items-center gap-3 rounded-2xl bg-[#18153c] p-1 w-[257px] mx-auto'>
          <div className='bg-gradient-to-b from-[#6671ea] to-[#a264e3] text-xs rounded-xl py-1 px-2 font-semibold'>New</div>
          <p className='text-xs mr-3 font-light'>Assess Crypto Volatility Instantly</p>
       </div>

        {/* Hero Section */}
        <div className="text-center mt-6 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-medium bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
            Meet <span className="bg-gradient-to-r from-violet to-[#a264e3] bg-clip-text text-transparent">LuneX</span>
          </h1>
          <p className="font-light mt-6 text-base text-zinc-300 leading-relaxed">
            Advanced crypto tracking with real-time insights. Analyze market trends and assess risk effortlessly.
          </p>
          <div className="mt-16">
            <Link to="/market">
              <button className="py-3 px-8 bg-gradient-to-r from-violet to-[#a264e3] text-white rounded-lg hover:shadow-lg hover:shadow-violet/30 transition-all duration-300 font-medium text-sm">
                Get started
              </button>
            </Link>
            <Link to="/finbot" className="ml-4 py-3 px-8 border border-violet/30 text-zinc-200 rounded-lg hover:bg-violet/10 transition-all duration-300 font-medium text-sm">
              Learn more
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why <span className="bg-gradient-to-r from-violet to-[#a264e3] bg-clip-text text-transparent">LuneX</span>?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#18153c]/70 backdrop-blur-sm rounded-2xl p-6 border border-violet/10 hover:shadow-lg hover:shadow-violet/10 transition-all duration-300 hover:translate-y-[-5px]">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-md shadow-violet/20`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="w-full mt-20 bg-gradient-to-r from-[#18153c]/80 to-[#262063]/80 backdrop-blur-md rounded-2xl p-8 border border-violet/20 shadow-xl shadow-violet/10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3">
              <h3 className="text-xl font-bold mb-3">Ready to start your crypto journey?</h3>
              <p className="text-zinc-400">Join thousands of traders using LuneX for smarter crypto decisions.</p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link to="/signup">
                <button className="py-3 px-8 bg-gradient-to-r from-violet to-[#a264e3] text-white rounded-lg hover:shadow-lg hover:shadow-violet/30 transition-all duration-300 font-medium text-sm">
                  Sign up for free
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full bg-[#18153c]/80 backdrop-blur-sm py-6 mt-16 border-t border-violet/10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={assets.noBgLogo} alt="LuneX Logo" className="w-6 h-6" />
            <p className="text-base font-light">Lune<span className="font-semibold">X</span></p>
          </div>
          <p className="text-xs text-zinc-400 mt-4 md:mt-0">© 2025 LuneX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
