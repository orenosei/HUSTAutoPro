import React from 'react'
import Search from './Search'

function Hero() {
  return (
    <div className='flex flex-col items-center p-10 py-20 gap-6 h-[750px] w-full bg-[#fdece9]'>
      <style>{`
        @keyframes smooth-wave {
          0%, 100% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
          50% {
            transform: translateY(-20px);
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
        }
      `}</style>

      <h2 className='text-lg'>Tìm kiếm xe hơi để mua hoặc thuê gần bạn</h2>
      <h2 className='text-[50px] font-bold mb-10'>SỞ HỮU NGAY CHIẾC XE MƠ ƯỚC CỦA BẠN</h2>
      <Search />
      <img
        src='/LamborghiniAventador.png'
        className='mt-10'
        alt='Lamborghini Aventador'
        style={{
          animation: 'smooth-wave 3s infinite',
          filter: 'drop-shadow(0 8px 12px rgba(0, 0, 0, 0.1))'
        }}
      />
    </div>
  )
}

export default Hero