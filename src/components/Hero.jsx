import React from 'react'
import Search from './Search'

function Hero() {
  return (
    <div className='flex flex-col items-center p-10 py-20 gap-6 h-[650px] w-full bg-[#eef0fc]' >
        <h2 className='text-lg'> Tìm kiếm xe hơi để mua hoặc thuê gần bạn </h2>
        <h2 className='text-[50px] font-bold'>SỞ HỮU NGAY CHIẾC XE MƠ ƯỚC CỦA BẠN</h2>
        
      <Search/>  
      <img src='/tesla.png' className='mt-10' />
    </div>
  )
}

export default Hero