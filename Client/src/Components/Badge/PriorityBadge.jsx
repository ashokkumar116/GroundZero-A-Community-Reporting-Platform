import React from 'react'

const PriorityBadge = ({text,severity}) => {
  return (
    <div className={`capitalize px-2 py-1 rounded-full ${severity ==="critical" ? "bg-red-100/90 text-red-700" : severity === "high" ? "bg-orange-100/90 text-orange-700" : severity === "medium" ? "bg-yellow-100/90 text-yellow-700" : "bg-green-100/90 text-green-700"} text-sm flex items-center justify-center text-sm`}>
        <p>{text}</p>
    </div>
  )
}

export default PriorityBadge