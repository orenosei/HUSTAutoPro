import React from 'react'
import Search from './Search'

function Hero() {
  return (
    <div className=' flex flex-col items-center p-10 py-20 gap-6 h-[750px] w-full bg-[#fdece9]' >
        <h2 className='text-lg'> Tìm kiếm xe hơi để mua hoặc thuê gần bạn </h2>
        <h2 className='text-[50px] font-bold mb-10'>SỞ HỮU NGAY CHIẾC XE MƠ ƯỚC CỦA BẠN</h2>
      <Search/>  
      <img src='/LamborghiniAventador.png' className='mt-10' />
    </div>
  )
}

export default Hero