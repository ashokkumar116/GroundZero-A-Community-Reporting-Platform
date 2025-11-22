import Skeleton from '@mui/material/Skeleton'
import React from 'react'

const SingleReportSkeleton = () => {
  return (
    <div className='px-20 py-10 flex flex-col gap-3'>
        <div className='flex gap-20 items-start'>
            <div className='flex gap-10 flex-col'>
                <div className='flex items-center gap-2'>
                <Skeleton variant="circular" height={60} width={60} animation="wave" />
                <div>
                    <Skeleton variant="text" width={160} animation="wave" />
                    <Skeleton variant="text" width={100} animation="wave" />
                </div>
            </div>
            <div className='flex flex-col gap-2 flex-1'>
                <Skeleton variant='rectangle' width={550} height={200} animation="wave" className='rounded-lg' />
            </div>
            </div>
            <div className='flex-1'>
                <Skeleton variant='rectangle' height={300} animation="wave" className='rounded-lg flex-1' />
            </div>
        </div>
         <div>
            <Skeleton variant='rectangle' height={200} animation="wave" className='rounded-lg' />
        </div>
    </div>
  )
}

export default SingleReportSkeleton
