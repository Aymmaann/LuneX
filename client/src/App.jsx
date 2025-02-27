import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import FinBot from './pages/FinBot'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/finbot' element={<FinBot />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App