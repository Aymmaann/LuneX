// import React from 'react'
// import assets from '../assets/assets'
// import { Link, useNavigate } from 'react-router-dom'

// const Navbar = () => {
//   const navigate = useNavigate()

//   const handleLogout = () => {
//     localStorage.removeItem('user-info')
//     localStorage.removeItem("crypto-analysis");
//     localStorage.removeItem("saved-cryptos");
//     navigate("/login")
//   }

//   return (
//     <div className='relative flex items-center justify-between py-5 px-6 text-zinc-300'>
//         <div className='flex gap-2 items-center w-[100px]'>
//             <img src={assets.noBgLogo} alt="" className='w-[25px]'/>
//             <p className='text-lg font-light'>Lune<span className='font-semibold'>X</span></p>
//         </div>

//         <div>
//             <ul className='flex items-center gap-28 text-sm'>
//               <Link to='/market' className='smoothTransition hover:text-zinc-400'>Market</Link>
//               <Link to='/wallet' className='smoothTransition hover:text-zinc-400'>Wallet</Link>
//               <Link to='/finbot' className='smoothTransition hover:text-zinc-400'>FinBot</Link>
//             </ul>
//         </div>

//         <div className='text-sm flex items-center gap-1 smoothTransition hover:text-zinc-400 cursor-pointer' onClick={handleLogout}>
//             <span>Log out</span>
//             <assets.IoMdLogOut className='mt-0.5 text-[16px]' />
//         </div>
//     </div>
//   )
// }

// export default Navbar
import React, { useState, useEffect } from 'react'
import assets from '../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user-info')
    localStorage.removeItem("crypto-analysis")
    localStorage.removeItem("saved-cryptos")
    navigate("/login")
  }

  const navLinks = [
    { path: '/market', label: 'Market' },
    { path: '/wallet', label: 'Wallet' },
    { path: '/finbot', label: 'FinBot' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-3 bg-[#18153c]/90 backdrop-blur-md shadow-lg shadow-violet/10' : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-zinc-300">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <img 
              src={assets.noBgLogo} 
              alt="LuneX Logo" 
              className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-violet/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          </div>
          <p className="text-xl font-light tracking-wide">
            Lune<span className="font-semibold bg-gradient-to-r from-violet to-[#a264e3] bg-clip-text text-transparent">X</span>
          </p>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:block">
          <ul className="flex items-center gap-32">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className={`relative py-2 px-1 text-sm font-medium transition-all duration-300 ${
                      isActive ? 'text-violet' : 'hover:text-zinc-100'
                    }`}
                  >
                    {link.label}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-violet transform origin-left transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 py-1.5 px-4 rounded-full border border-zinc-700/50 text-sm font-medium text-zinc-300 hover:bg-zinc-800/30 transition-all duration-300"
          >
            <span>Log out</span>
            <assets.IoMdLogOut className="text-base" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar