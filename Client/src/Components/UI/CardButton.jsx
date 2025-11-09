import React from 'react'

const CardButton = ({text,icon:Icon }) => {
  return (
    <button className='flex gap-1 items-center cursor-pointer text-sm text-gray-700 px-3 py-1'>
      <Icon />
      <p>{text}</p>
    </button>
  )
}

export default CardButton
