import React from 'react'
import { FiClock } from 'react-icons/fi'

const ManageSupport = () => {
  return (
    <div className='flex flex-col gap-5 items-center justify-center h-[calc(100vh-15rem)]'>
    
          <FiClock className="text-5xl text-gray-600" />
          <p className="mt-2 text-gray-700 font-medium">Coming Soon</p>
          <p className="text-xs text-gray-500">This feature is under development</p>
    
    </div>
  )
}

export default ManageSupport