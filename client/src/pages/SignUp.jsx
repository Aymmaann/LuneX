import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import AuthService from '../services/auth';
import { useGoogleAuth } from '../services/GoogleAuth'
import { useGoogleLogin } from '@react-oauth/google'
import { googleAuth } from '../services/api';


const SignUp = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async(e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await AuthService.login(email, password)
      setLoading(false)
      navigate("/")
    } catch(error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const responseGoogle = async(authResult) => {
    try {
      if(authResult['code']) {
        const result = await googleAuth(authResult['code'])
        const { name, email, image } = result.data.user
        const token = result.data.token
        const obj = {email,name,image,token}
        localStorage.setItem('user-info', JSON.stringify(obj))
        navigate("/home")
      }
    } catch(error) {
      console.error("Error while requesting google code: ", error)
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code'
  })


  return (
    <div className='h-screen text-white'>
        <div className='flex'>
          {/* Left Side */}
          <div className='w-1/2 h-screen bg-[#090909] p-6'>
            {/* Logo */}
            <div className='flex gap-2 items-center w-[100px]'>
              <img src={assets.logo} alt="" className='w-[30px]'/>
              <p className='text-xl font-light'>Lune<span className='font-semibold'>X</span></p>
            </div>

            <div className='mt-28 flex justify-center'>
              <div className='min-w-[300px]'>
                <p className='text-3xl font-medium inline-block'>Get started!</p>
                <p className='text-xs font-light text-zinc-400 mt-2'>Smarter Insights for Your Crypto Journey</p>
                <button className='mt-6 w-[300px] bg-[#111111] border border-borderGray rounded-md py-2.5 flex justify-center items-center gap-2 smoothTransition hover:bg-borderGray'
                        onClick={handleGoogleSignUp}
                >
                  <img src={assets.googleLogo} alt="" className='w-[20px]'/>
                  <p className='text-sm text-gray-300'>Sign up with Google</p>
                </button>
                {/* <div id="google-signup-button" className='mt-6'></div> */}

                <div className='text-gray-700 flex justify-center items-center gap-2 mt-5'>
                  <div className='flex-1 h-[2px] bg-borderGray rounded-md'></div>
                  <p className='text-sm font-light text-zinc-600'>OR</p>
                  <div className='flex-1 h-[2px] bg-borderGray rounded-md'></div>
                </div>

                {error && (
                  <div className="mt-4 text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignUp}>
                  <p className='text-sm ml-1 mt-5 text-zinc-300'>Name</p>
                  <input type="text" 
                         placeholder='Mark Johnson' 
                         className='w-full mt-2 bg-transparent text-sm border border-borderGray rounded-md py-2.5 px-3 outline-none placeholder:text-zinc-600'
                         onChange={(e) => setFullName(e.target.value)}
                  />

                  <p className='text-sm ml-1 mt-5 text-zinc-300'>Email</p>
                  <input type="email" 
                         placeholder='mark@gmail.com' 
                         className='w-full mt-2 bg-transparent text-sm border border-borderGray rounded-md py-2.5 px-3 outline-none placeholder:text-zinc-600'
                         onChange={(e) => setEmail(e.target.value)}
                  />

                  <div className='flex justify-between items-center text-sm mt-5'>
                    <p className=' ml-1 text-zinc-300'>Password</p>
                    <p className='text-violet cursor-pointer text-xs font-light'>Forgot your password?</p>
                  </div>
                  <input type="password" 
                         placeholder='mark@12345' 
                         className='w-full mt-2 bg-transparent text-sm border border-borderGray rounded-md py-2.5 px-3 outline-none placeholder:text-zinc-600'
                         onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className='mt-6 text-sm w-full bg-[#111111] border border-borderGray rounded-md py-2.5 flex justify-center items-center gap-1 smoothTransition hover:bg-borderGray' 
                          type='submit'
                          disabled={loading}
                  >
                    {loading ? 'Signing up...' : 'Sign up'}
                  </button>
                </form>

                <Link to="/login">
                  <p className='text-[13px] mt-4 text-center font-light'>Already have an account? <span className='text-violet font-medium'>Log in</span></p>
                </Link>
                </div>
              </div>
          </div>
          
          {/* Right Side */}
          <div className='w-1/2 h-screen bg-[#000000] relative text-center'>
              <div className='z-10 absolute left-1/2 -translate-x-1/2 w-full'>
                <p className='text-[40px] mt-24 text-zinc-300 z-10'>Every tick matters</p>
                <p className='text-[40px] bg-gradient-to-b from-zinc-400 to-zinc-700 bg-clip-text text-transparent z-10'>Monitor the market in real time.</p>
              </div>
              <img src={assets.loginImg} className='absolute w-full bottom-0 z-0' alt="" />
          </div>
       </div>
    </div>
  )
}

export default SignUp