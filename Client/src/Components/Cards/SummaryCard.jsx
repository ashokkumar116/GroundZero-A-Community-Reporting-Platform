import React from 'react'

const SummaryCard = ({title,icon:Icon,data,iconColor,backgroundColor}) => {
  return (
    <div className='flex items-center border border-gray-200 gap-5 p-5 rounded-lg hover:border-gray-400 transition-all cursor-pointer'>
        <div className={`flex items-center justify-center ${backgroundColor} rounded-lg p-2`}>
            <Icon className={`text-2xl ${iconColor}`}/>
        </div>
        <div>
            <p className='text-gray-700 text-sm'>{title}</p>
            <p className='font-bold text-lg'>{data}</p>
        </div>
    </div>
  )
}

export default SummaryCard