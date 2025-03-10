import { useState, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion' 
import { GoogleOAuthProvider } from '@react-oauth/google'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import Market from './pages/Market'
import NotFound from './pages/NotFound'
import FinBot from './pages/FinBot'
import Trending from './pages/Trending'
import Saved from './pages/Saved'
import RefresHandler from './components/RefreshHandler'
import Wallet from './pages/Wallet'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const GoogleAuthProvider = () => {
      return (
        <GoogleOAuthProvider clientId='1078438493144-7sklkbbp49detn9eh5gstfstuskcr3g4.apps.googleusercontent.com'>
          <Login></Login>
        </GoogleOAuthProvider>
      )
  }

  const PrivateRoute = ({ element }) => {
    return isAuthenticated? element : <Navigate to="/login" />
  }

  return (
    <div>
      <RefresHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <Navigate to="/login" />
          </motion.div>
        } />
        <Route path='/home' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <PrivateRoute element={<Home />} />
          </motion.div>
        } />
        <Route path='/market' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <PrivateRoute element={<Market />} />
          </motion.div>
        } />
        <Route path='/login' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <GoogleAuthProvider />
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
            <PrivateRoute element={<Profile />} />
          </motion.div>
        } />
        <Route path='/finbot' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <PrivateRoute element={<FinBot />} />
          </motion.div>
        } />
        <Route path='/trending' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <PrivateRoute element={<Trending />} />
          </motion.div>
        } />
        <Route path='/saved' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <PrivateRoute element={<Saved />} />
          </motion.div>
        } />
        <Route path='/wallet' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <PrivateRoute element={<Wallet />} />
          </motion.div>
        } />
        <Route path='*' element={
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <PrivateRoute element={<NotFound />} />
          </motion.div>
        } />
      </Routes>
    </div>
  )
}

export default App