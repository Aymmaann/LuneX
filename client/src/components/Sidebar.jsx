import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import assets from "../assets/assets.js"

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user-info')
    localStorage.removeItem("crypto-analysis");
    localStorage.removeItem("saved-cryptos");
    navigate("/login")
  }

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const navLinks = [
    { path: '/home', icon: <assets.FaHome className="text-lg" />, label: 'Home' },
    { path: '/market', icon: <assets.RiDashboardFill className="text-lg" />, label: 'Market' },
    { path: '/trending', icon: <assets.IoMdTrendingUp className="text-lg" />, label: 'Trending' },
    { path: '/wallet', icon: <assets.IoWallet className="text-lg" />, label: 'Wallet' },
    { path: '/saved', icon: <assets.LuFileDown className="text-lg" />, label: 'Saved' },
    { path: '/finbot', icon: <assets.RiRobot2Fill className="text-lg" />, label: 'FinBot' },
  ];

  return (
    <div className="fixed overflow-y-auto w-64 min-h-screen flex flex-col justify-between bg-darkBlue shadow-lg">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 pb-5">
          <div className="flex items-center gap-3">
            <img src={assets.noBgLogo} alt="LuneX Logo" className="w-7 h-7" />
            <p className="text-xl font-light tracking-wide">
              Lune<span className="font-semibold">X</span>
            </p>
          </div>
        </div>

        {/* Divider with gradient */}
        <div className="">
          <hr className="h-px bg-gradient-to-r from-[#1c1e39] via-[#343850] to-[#1c1e39] border-0" />
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 px-4 flex-1">
          <div className="space-y-1">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-mediumBlue' 
                      : 'bg-transparent hover:bg-[#1a1f37] hover:translate-x-1'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-opacity-20 bg-violet' : ''}`}>
                    <div className={`${isActive ? 'text-violet' : 'text-white'}`}>
                      {item.icon}
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${isActive ? 'text-violet' : 'text-white'}`}>
                    {item.label}
                  </p>
                  {isActive && (
                    <div className="ml-auto w-1 h-5 bg-violet rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 mb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-[#1a1f37] border border-transparent hover:border-[#343850]"
        >
          <div className="p-2 rounded-lg">
            <assets.IoMdLogOut className="text-lg text-white" />
          </div>
          <p className="text-sm font-medium">Log out</p>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;