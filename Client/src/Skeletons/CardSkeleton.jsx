import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const CardSkeleton = () => {
  return (
    <Stack>
        <div className='flex justify-between items-center mb-2 pr-6'>
            <div className='flex items-center gap-2'>
                <Skeleton variant="circular" height={40} width={40} animation="wave" />
                <Skeleton variant="text" width={200} height={40} animation="wave" />
            </div>
        </div>
        <Skeleton variant='rectangle' height={230} width={300} animation="wave" />
        <Skeleton variant="text" animation="wave" width={300} />
        <Skeleton variant="text" animation="wave" width={300} />
        <Skeleton variant="text" animation="wave" width={300} />
    </Stack>
  )
}

export default CardSkeleton
