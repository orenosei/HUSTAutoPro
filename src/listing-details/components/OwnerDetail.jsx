import React from 'react'
import { FaUser, FaEnvelope, FaPhone, FaMapMarker } from 'react-icons/fa'

function OwnerDetail({ carDetail }) {
  const owner = carDetail?.user
  const address = owner?.address || ''

  if (!owner) return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mt-5">
      <p className="text-gray-500 text-center">Không có thông tin người bán</p>
    </div>
  )

  const contactInfo = [
    { icon: <FaEnvelope className="h-4 w-4"/>, value: owner.email, type: 'email' },
    { icon: <FaPhone className="h-4 w-4"/>, value: owner.phoneNumber, type: 'tel' }
  ].filter(item => item.value)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mt-5">
      <div className="flex items-center gap-3 mb-6">
        <FaUser className="h-6 w-6 text-gray-400" />
        <h3 className="text-xl font-semibold">Thông tin người đăng</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="font-medium text-gray-900">
            {owner.firstName || owner.lastName 
              ? `${owner.firstName} ${owner.lastName}`
              : 'Không xác định'}
          </p>
        </div>

        <div className="space-y-2">
          {contactInfo.map((info, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-gray-400">{info.icon}</span>
              <a
                href={`${info.type}:${info.value}`}
                className="text-blue-600 hover:text-blue-800 hover:underline break-all"
              >
                {info.value}
              </a>
            </div>
          ))}
        </div>

        {address && (
          <div className="flex items-start gap-3 pt-2">
            <FaMapMarker className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
            <p className="text-gray-600 leading-relaxed">{address}</p>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <a
          href={`mailto:${owner.email}`}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Gửi email
        </a>
        {owner.phoneNumber && (
          <a
            href={`tel:${owner.phoneNumber}`}
            className="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Gọi điện thoại
          </a>
        )}
      </div>
    </div>
  )
}

export default OwnerDetail