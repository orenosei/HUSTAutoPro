import { Button } from '@/components/ui/button'
import React from 'react'
import { MdOutlineLocalOffer } from 'react-icons/md'

function Pricing({carDetail}) {
  return (
    <div className='p-10 rounded-xl bg-white shadow-md border border-gray-200 '>
        <h2>Our Price</h2>
        <h2 className='text-4xl font-bold mt-5'>${carDetail?.sellingPrice}</h2>

        <Button className='w-full mt-10 bg-blue-500 hover:bg-blue-600 text-white'>
            <MdOutlineLocalOffer className='text-white text-lg mr-2' />
            Make an Offer Price
        </Button>
    </div>
  )
}

export default Pricing