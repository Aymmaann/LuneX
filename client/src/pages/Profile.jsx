import React from 'react'
import Sidebar from '../components/Sidebar'

const Profile = () => {
  return (
    <div className='text-zinc-200 flex'>
      <Sidebar />
      <div className='flex-1 h-screen bg-[#050505]'></div>
    </div>
  )
}

export default Profile