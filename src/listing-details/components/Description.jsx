import React from 'react'

function Description({carDetail}) {
  return (
    <div>
    {carDetail?.listingDescription? 
    <div className='p-10 rounded-xl bg-white shadow-md mt-6 border border-gray-200 '>
        <h2 className='text-2xl font-semibold'>Mô Tả</h2>
        <p className='text-gray-600  text-justify mt-10'>{carDetail?.listingDescription}</p>
    </div>
    :
    <div className='w-full mt-7 h-[100px] bg-slate-200 animate-pulse rounded-xl'></div>
    }
    </div>
  )
}

export default Description