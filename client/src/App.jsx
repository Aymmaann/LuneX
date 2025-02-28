import { Route, Routes, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion' 
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import FinBot from './pages/FinBot'
import Trending from './pages/Trending'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <Home />
          </motion.div>
        } />
        <Route path='/dashboard' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <Dashboard />
          </motion.div>
        } />
        <Route path='/login' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <Login />
          </motion.div>
        } />
        <Route path='/signup' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <SignUp />
          </motion.div>
        } />
        <Route path='/profile' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <Profile />
          </motion.div>
        } />
        <Route path='/finbot' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <FinBot />
          </motion.div>
        } />
        <Route path='/trending' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <Trending />
          </motion.div>
        } />
        <Route path='*' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <NotFound />
          </motion.div>
        } />
      </Routes>
    </div>
  )
}

export default App