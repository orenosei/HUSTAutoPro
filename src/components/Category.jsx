import React from 'react'
import { Link } from 'react-router-dom';
import Data from "@/Shared/Data"

function Category() {
  return (
    <div className='mt-70'>
      <h2 className='font-bold text-3xl text-center mb-6'>Các Dáng Xe Phổ Biến</h2>

      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-6 px-20'>
        {Data.Category.map((category,index) => (
          <Link to={'search/' + category.name} > 
          <div className='border-2 rounded-xl p-3 items-center flex flex-col shadow-xl cursor-pointer border-blue-100 hover:scale-120 transition-transform bg-white'>
            <img src={category.icon} width={40} height={40} />
            <h2 className=''>{category.name}</h2>
          </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Category