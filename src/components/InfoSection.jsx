import React from 'react'

// function InfoSection() {
//   return (
//     <section>
//   <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
//     <div class="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-center md:gap-8">
//       <div class="md:col-span-3">
//         <img
//           src='/bonanhemsiunhan.png'
//           className="rounded max-w-3xl w-full h-auto transform transition duration-300 hover:scale-105 hover:opacity-90 hover:shadow-lg"
//           //className="rounded w-full h-auto transform transition duration-300 hover:scale-105 hover:opacity-90 hover:shadow-lg"
//           alt=""
//         />
//       </div>

//       <div class="md:col-span-1">
//         <div class="max-w-lg md:max-w-none">
//         <h2 class="text-3xl font-semibold text-gray-900 sm:text-3xl transition duration-300 hover:text-blue-600 hover:scale-105">
//           <span class="whitespace-nowrap">Khách hàng là trung tâm</span><br />
//           <span class="whitespace-nowrap">Trải nghiệm là ưu tiên</span>
//         </h2>

//           <p class="mt-4 text-gray-700">
//           <span class="whitespace-nowrap">Bán một chiếc xe chỉ là bắt đầu</span><br />
//           <span class="whitespace-nowrap">Giữ khách hàng mới là thành công thật sự.</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>
//   )
// }

// export default InfoSection

function InfoSection() {
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4 md:items-center md:gap-4">
          <div className="md:col-span-3">
            <img
              src='/bonanhemsiunhan.png'
              className="w-full h-auto max-w-2xl mx-auto rounded-2xl transition-transform duration-300 hover:scale-105 hover:opacity-90 hover:shadow-lg"
              alt="Showroom xe"
            />
          </div>

          <div className="md:col-span-1 md:pl-0 pl-4">
            <div className="max-w-lg md:max-w-none md:pr-4">
              <h2 className="text-3xl font-semibold text-gray-900 sm:text-3xl transition duration-300 hover:text-blue-600 hover:scale-105">
                <span className="whitespace-nowrap block">Khách hàng là trung tâm</span>
                <span className="whitespace-nowrap block">Trải nghiệm là ưu tiên</span>
              </h2>

              <p className="mt-4 text-gray-700">
                <span className="whitespace-nowrap block">Bán một chiếc xe chỉ là bắt đầu</span>
                <span className="whitespace-nowrap block">Giữ khách hàng mới là thành công thật sự.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InfoSection