import React from 'react'

const Badge = ({text,severity,inLine}) => {
return (
  <div className={`${inLine ? "w-fit" : "absolute z-20 top-2 right-2"} bg-gradient-to-br drop-shadow-md ${severity === "high" ? "from-rose-500 to-rose-800 text-white" : severity === "medium" ? "from-yellow-500 to-yellow-800 text-white" : severity === "low" ? "from-emerald-500 to-emerald-800 text-white" : severity === "critical" ? "from-red-500 to-red-800 text-white" : "from-green-500 to-green-800 text-white" } px-3 py-1 rounded-full text-xs`}>
    <p className='capitalize'>{text}</p>
  </div>
)
}

export default Badge
