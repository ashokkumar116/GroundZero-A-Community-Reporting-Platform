import React from 'react'
import { useAuthStore } from '../lib/authStore'

const Home = () => {
    const {logout} = useAuthStore();
  return (
    <div>
      Home
      <button className='btn btn-error' onClick={logout}>Logout</button>
    </div>
  )
}

export default Home
