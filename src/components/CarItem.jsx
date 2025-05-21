import React from 'react';
import { LuFuel } from "react-icons/lu";
import { Separator } from './ui/separator';
import { TbBrandSpeedtest } from "react-icons/tb";
import { GiGearStickPattern } from "react-icons/gi";
import { MdOpenInNew } from "react-icons/md";
import { Link } from 'react-router-dom';
import { AiOutlineHeart } from "react-icons/ai";


function CarItem({ car }) {
  return (
    <div className="h-full">
      {car ? (
        <Link to={'/listing-details/' + car?.id} className="w-full h-full block">
          <div className='rounded-2xl bg-white border-3  border-gray-300 hover:shadow-md cursor-pointer hover:scale-105 transition-transform h-full'>
            <h2 className='absolute m-2 bg-green-500 px-2 rounded-full text-sm text-white'>New</h2>
            <img 
              src={car?.images?.[0]?.imageUrl || '/path/to/placeholder.jpg'} 
              alt={car?.listingTitle || 'Car Image'}
              width={'100%'} 
              height={250}
              className='rounded-t-xl h-[180px] object-cover'
            />
            <div className='p-4'>
              <div className="flex items-center justify-between mb-2">
                <h2 className='font-bold text-black text-lg'>{car?.listingTitle || 'Unknown Title'}</h2>
                  <button className="text-red-400 text-xl transition-all duration-300 hover:text-red-600 hover:scale-125">
                  <AiOutlineHeart />
                </button>
              </div>
              <Separator className="bg-gray-200" />


              <div className='grid grid-cols-3 mt-5'>
                <div className='flex flex-col items-center'>
                  <LuFuel className='text-lg mb-2' />
                  <h2>{car?.mileage ? `${car.mileage} Miles` : 'N/A'}</h2>
                </div>
                <div className='flex flex-col items-center'>
                  <TbBrandSpeedtest className='text-lg mb-2' />
                  <h2>{car?.fuelType || 'N/A'}</h2>
                </div>
                <div className='flex flex-col items-center'>
                  <GiGearStickPattern className='text-lg mb-2' />
                  <h2>{car?.transmission || 'N/A'}</h2>
                </div>
              </div>
              <Separator className="my-2 bg-gray-200" />
              <div className='flex items-center justify-between'>
                <h2 className='font-bold text-xl'> {Math.floor(Number(car?.sellingPrice))?.toLocaleString('en-US') + ' VNĐ' || 'N/A'}</h2>
                <h2 className='text-primary text-sm flex gap-2 items-center'> 
                  Chi Tiết <MdOpenInNew />
                </h2>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div className="rounded-xl bg-slate-200 animate-pulse h-[330px] w-full"></div>
      )}
    </div>
  );
}

export default CarItem;
