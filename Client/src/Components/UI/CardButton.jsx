import React from 'react'

const CardButton = ({text,icon:Icon,onClick , hasUserUpvoted}) => {

  const handleClick = (e) => {
    if (e && e.preventDefault) {
        e.preventDefault();
    }
    if (onClick) {
      onClick();
    }
  }


  return (
    <button className={`flex gap-1 items-center cursor-pointer text-sm text-gray-700 px-3 py-1 ${hasUserUpvoted ? "text-green-700" : "text-gray-700"}`} onClick={handleClick} >
      <Icon />
      <p className={`text-xs`}>{text}</p>
    </button>
  )
}

export default CardButton
