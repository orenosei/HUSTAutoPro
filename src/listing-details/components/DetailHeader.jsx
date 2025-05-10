import React from 'react'
import { PiCalendarDotsFill } from "react-icons/pi";
import { IoSpeedometer } from "react-icons/io5";
import { GiGearStick } from "react-icons/gi";
import { FaGasPump } from "react-icons/fa";



function DetailHeader({carDetail}) {
  return (
    <div>
        {carDetail?.listingTitle ?
        <div>
            <h2 className='font-bold text-3xl'>{carDetail?.listingTitle}</h2>
            <p className='text-sm'>{carDetail?.tagline}</p>
            <div className='flex gap-2 mt-3'>
                <div className='flex gap-2 items-center mt-4 bg-blue-50 p-2 px-3 rounded-full'>
                    <PiCalendarDotsFill className='h-7 w-7 text-blue-600'/>
                    <h2 className='text-blue-600 text-sm'>{carDetail?.year}</h2>
                </div>
                <div className='flex gap-2 items-center mt-4 bg-blue-50 p-2 px-3 rounded-full'>
                    <IoSpeedometer className='h-7 w-7 text-blue-600'/>
                    <h2 className='text-blue-600 text-sm'>{carDetail?.mileage}</h2>
                </div>
                <div className='flex gap-2 items-center mt-4 bg-blue-50 p-2 px-3 rounded-full'>
                    <GiGearStick className='h-7 w-7 text-blue-600'/>
                    <h2 className='text-blue-600 text-sm'>{carDetail?.transmission}</h2>
                </div>
                <div className='flex gap-2 items-center mt-4 bg-blue-50 p-2 px-3 rounded-full'>
                    <FaGasPump className='h-7 w-7 text-blue-600'/>
                    <h2 className='text-blue-600 text-sm'>{carDetail?.fuelType}</h2>
                </div>
            </div>
        </div> 
        :
        <div className='w-full rounded-2xl h-[100px] bg-slate-200 animate-pulse'></div>
        }

        
    </div>
  )
}

export default DetailHeader