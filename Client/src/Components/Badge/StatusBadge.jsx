import React from 'react'
import { formatStatus } from '../../utils/formatStatus'

const StatusBadge = ({text,severity}) => {
  return (
    <div className={`capitalize px-2 py-1 rounded-full ${severity === "reported" ? "bg-red-100/90 text-red-700" : severity === "in_progress" ? "bg-yellow-100/90 text-yellow-700" : severity === "resolved" ? "bg-green-100/90 text-green-700" : "bg-gray-100/90 text-gray-700"} text-sm flex items-center justify-center text-sm`}>
        <p>{formatStatus(text)}</p>
    </div>
  )
}

export default StatusBadge