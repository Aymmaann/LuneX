import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const RefresHandler = ({ setIsAuthenticated }) => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const data = localStorage.getItem('user-info')
    const token = JSON.parse(data)?.token
    if(token) {
      setIsAuthenticated(true) 
      if(location.pathname === '/' || location.pathname === '/login') {
        navigate("/home", { replace: false })
      }
    }
  }, [location,navigate,setIsAuthenticated])

  return null
}

export default RefresHandler