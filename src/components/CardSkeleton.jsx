import React from 'react'

const CardSkeleton = () => {
  return (
    <div className='block bg-gray-800 rounded-3xl p-4 animate-pulse'>
    <div className='flex flex-col items-center'>
      <div className='w-full h-auto aspect-square bg-gray-700 rounded-2xl mb-4'></div>
      <div className='h-4 bg-gray-700 rounded w-3/4 mb-2'></div>
      <div className='h-3 bg-gray-700 rounded w-1/2'></div>
    </div>
  </div>
  )
}

export default CardSkeleton

