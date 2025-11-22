import React from 'react'
import Skeleton from '@mui/material/Skeleton'
const ProfileSkeleton = () => {
  return (
    <div className='px-20 py-30 flex flex-col gap-5'>
        <div className='flex items-center justify-between gap-5'>
            <div className='flex gap-5 items-center'>
                <div>
                <Skeleton variant="rectangular" height={100} width={100} animation="wave" className='rounded-lg' />
            </div>
            <div>
                <Skeleton variant="text" width={400} animation="wave" />
                <Skeleton variant="text" width={800} animation="wave" />
                <Skeleton variant="text" width={700} animation="wave" />
            </div>
            </div>
            <div>
                <Skeleton variant="rectangle" height={40} width={150} animation="wave" className='rounded-lg' />
            </div>
        </div>
        <div className='flex gap-5'>
            <div className='flex-2'>
                <Skeleton variant='rectangle' height={500} animation="wave" className='rounded-lg' />
            </div>
            <div className='flex-1'>
                <Skeleton variant='rectangle' height={500} animation="wave" className='rounded-lg' />
            </div>
        </div>
    </div>
  )
}

export default ProfileSkeleton