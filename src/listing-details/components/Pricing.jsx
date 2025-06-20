import React from 'react'
import { MdOutlineLocalOffer, MdAttachMoney } from 'react-icons/md'
import { FaStar } from "react-icons/fa6";
import MoreInfo from './MoreInfo'

function Pricing({carDetail}) {
  const formattedPrice = carDetail?.sellingPrice 
    ? Math.floor(Number(carDetail.sellingPrice)).toLocaleString('en-US')
    : 'N/A';

  return (
    <div className='p-8 rounded-xl bg-white shadow-md border border-gray-200'>
      <div className='flex items-center mb-4'>
        <MdOutlineLocalOffer className='text-2xl not-even:mr-2' />
        <h2 className='text-xl font-semibold text-gray-800'>Giá Đề Xuất</h2>
      </div>
      
      <div className='mt-6 mb-4'>
        <div className='text-left'>
          <h2 className='text-4xl font-bold flex items-baseline'>{formattedPrice}</h2>
          <span className='text-2xl font-bold text-gray-700'>VNĐ</span>
        </div>
      </div>
      
      <p className='mt-4 text-gray-600 text-sm italic'>* Giá có thể thay đổi tùy theo tình trạng xe.</p>

      <div  className='mt-2 bg-white shadow-md border border-gray-200 rounded-lg p-4'>
        <div className='flex items-center'>
          <FaStar className='text-yellow-500 mr-2' />
          <h2 className='text-md font-semibold text-gray-800'>Ưu đãi:</h2>
        </div>
        <div>
          {Array.isArray(carDetail?.offerType) && carDetail.offerType.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600 text-sm ml-4">
              {carDetail.offerType.map((offer, idx) => (
                <li key={idx}>{offer}</li>
              ))}
            </ul>
          ) : (
            <span className='text-gray-600 text-sm ml-2'>Không có ưu đãi</span>
          )}
        </div>
      </div>
      <div className=''>
        <MoreInfo carDetail={carDetail} />
      </div>
    </div>
  )
}

export default Pricing