import React from 'react'
import { Link } from 'react-router-dom'
import assets from '../assets/assets'

const SignUp = () => {
  return (
    <div className='h-screen'>
        <div className='flex'>
          {/* Left Side */}
          <div className='w-1/2 h-screen bg-[#090909] p-6'>
            {/* Logo */}
            <div className='flex gap-2 items-center w-[100px]'>
              <img src={assets.logo} alt="" className='w-[30px]'/>
              <p className='text-xl font-light'>Lune<span className='font-semibold'>X</span></p>
            </div>

            <div className='mt-28 flex justify-center'>
              <div>
                <p className='text-3xl font-medium inline-block'>Get started!</p>
                <p className='text-xs font-light text-zinc-400 mt-2'>Smarter Insights for Your Crypto Journey</p>
                <button className='mt-6 w-[300px] bg-[#111111] border border-borderGray rounded-md py-2.5 flex justify-center items-center gap-2 smoothTransition hover:bg-borderGray'>
                  <img src={assets.googleLogo} alt="" className='w-[20px]'/>
                  <p className='text-sm text-gray-300'>Sign up with Google</p>
                </button>

                <div className='text-gray-700 flex justify-center items-center gap-2 mt-5'>
                  <div className='flex-1 h-[2px] bg-borderGray rounded-md'></div>
                  <p className='text-sm font-light text-zinc-600'>OR</p>
                  <div className='flex-1 h-[2px] bg-borderGray rounded-md'></div>
                </div>

                <form>
                  <p className='text-sm ml-1 mt-5 text-zinc-300'>Name</p>
                  <input type="text" placeholder='Mark Johnson' className='w-full mt-2 bg-transparent text-sm border border-borderGray rounded-md py-2.5 px-3 outline-none placeholder:text-zinc-600'/>
                  <p className='text-sm ml-1 mt-5 text-zinc-300'>Email</p>
                  <input type="email" placeholder='mark@gmail.com' className='w-full mt-2 bg-transparent text-sm border border-borderGray rounded-md py-2.5 px-3 outline-none placeholder:text-zinc-600'/>
                  <div className='flex justify-between items-center text-sm mt-5'>
                    <p className=' ml-1 text-zinc-300'>Password</p>
                    <p className='text-violet cursor-pointer text-xs font-light'>Forgot your password?</p>
                  </div>
                  <input type="password" placeholder='mark@12345' className='w-full mt-2 bg-transparent text-sm border border-borderGray rounded-md py-2.5 px-3 outline-none placeholder:text-zinc-600'/>
                  <button className='mt-6 text-sm w-full bg-[#111111] border border-borderGray rounded-md py-2.5 flex justify-center items-center gap-1 smoothTransition hover:bg-borderGray' type='submit'>Sign Up</button>
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