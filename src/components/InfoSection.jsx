import React from 'react'
import {  SignInButton } from '@clerk/clerk-react'

function InfoSection() {
  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          <div className="md:col-span-2 flex justify-center">
            <div className="relative group w-full max-w-xl">
              <img
                src="/bonanhemsiunhan.png"
                className="w-full h-auto rounded-3xl shadow-xl transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                alt="Showroom xe"
              />
              <div className="absolute inset-0 rounded-3xl bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white/80 rounded-2xl shadow-lg p-6 md:p-8 transition hover:shadow-2xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight transition duration-300 hover:text-red-600 hover:scale-105">
                Tham gia ngay cộng đồng mua bán, trao đổi xe hơi <span className="text-red-600">lớn nhất Đại Cồ Việt</span>
              </h2>
              <p className="mt-2 text-gray-700 text-lg">
                <span className="block">Bán một chiếc xe chỉ là bắt đầu.</span>
                <span className="block">Giữ khách hàng mới là thành công thật sự.</span>
              </p>
              <SignInButton>
                <a
                  href="#"
                  className="inline-block mt-6 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
                >
                  Tham gia ngay
                </a>
              </SignInButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InfoSection