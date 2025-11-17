import React from 'react'

const PersonalInfoCard = ({icon:Icon,heading,data}) => {
  return (
    <div className='bg-green-50 border border-green-100 flex items-center gap-3 p-4 hover:shadow-xl transition rounded-2xl w-full lg:w-100'>
      <div className='bg-white rounded-full p-2'>
        <Icon className="text-2xl text-green-700" />
      </div>
      <div className='flex flex-col gap-2'>
        <h1 className='text-gray-700'>{heading}</h1>
        <p className='text-sm'>{data ? data : "Not Provided"}</p>
      </div>
    </div>
  )
}

export default PersonalInfoCard
