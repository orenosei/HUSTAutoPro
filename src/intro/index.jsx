import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const timeline = [
  { year: "2023", event: "HUST Auto Pro thành lập, đặt nền móng cho nền tảng mua bán xe hơi hiện đại." },
  { year: "2024", event: "Ra mắt website chính thức, tích hợp các tính năng tìm kiếm, đăng tin, quản lý xe." },
  { year: "2025", event: "Mở rộng cộng đồng, phát triển tính năng blog, lịch sử xem xe, xe yêu thích." },
  { year: "Tương lai", event: "Không ngừng đổi mới, hướng tới trải nghiệm tốt nhất cho người dùng Việt Nam." },
];

export default function Intro() {
  useEffect(() => {
    function handleScroll() {
      const reveals = document.querySelectorAll(".reveal");
      for (let i = 0; i < reveals.length; i++) {
        const wnd = window.innerHeight;
        const rtop = reveals[i].getBoundingClientRect().top;
        const rpoint = 100;
        if (rtop < wnd - rpoint) {
          reveals[i].classList.add("active");
        } else {
          reveals[i].classList.remove("active");
        }
      }
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <Header />
      <div className="flex flex-col items-center w-full py-10 bg-[#f8fafc]">
        {/* Logo & Slogan */}
        <div className="flex flex-col items-center mb-12">
          <img
            src="/hustautopro.png"
            alt="HUST Auto Pro"
            className="w-32 h-32 object-contain rounded-full shadow-xl mb-4 border-4 border-gray-200"
          />
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight text-center">HUST Auto Pro</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl">Nền tảng mua bán xe hơi hiện đại, kết nối đam mê - kiến tạo tương lai</p>
        </div>

        {/* Sứ mệnh */}
        <section className="mb-12 text-left w-full max-w-6xl px-12 mx-auto">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 uppercase tracking-wide">Sứ mệnh</h2>
          <p className="text-lg text-gray-700">
            Đưa trải nghiệm mua bán xe lên tầm cao mới, giúp mọi người dễ dàng sở hữu chiếc xe mơ ước hoặc bán xe nhanh chóng với giá tốt nhất. Chúng tôi cam kết minh bạch, an toàn và hiện đại hóa thị trường xe hơi Việt Nam.
          </p>
        </section>

        {/* Giá trị cốt lõi */}
        <section className="mb-12 text-left w-full max-w-6xl px-12 mx-auto">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 uppercase tracking-wide">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-xl p-8 shadow flex flex-col">
              <span className="text-lg font-semibold text-blue-900 mb-2">Uy tín</span>
              <span className="text-gray-700">Cam kết thông tin chính xác, giao dịch minh bạch.</span>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 shadow flex flex-col">
              <span className="text-lg font-semibold text-blue-900 mb-2">Minh bạch</span>
              <span className="text-gray-700">Mọi quy trình rõ ràng, hỗ trợ tận tâm.</span>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 shadow flex flex-col">
              <span className="text-lg font-semibold text-blue-900 mb-2">Hiện đại</span>
              <span className="text-gray-700">Ứng dụng công nghệ mới, tối ưu trải nghiệm người dùng.</span>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 shadow flex flex-col">
              <span className="text-lg font-semibold text-blue-900 mb-2">Cộng đồng</span>
              <span className="text-gray-700">Xây dựng môi trường kết nối, chia sẻ và phát triển bền vững.</span>
            </div>
          </div>
        </section>

        {/* Lịch sử phát triển */}
        <section className="mb-12 text-left w-full max-w-6xl px-12 mx-auto">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 uppercase tracking-wide">Lịch sử phát triển</h2>
          <ol className="relative border-l-4 border-blue-200 ml-4">
            {timeline.map((item, idx) => (
              <li key={idx} className="mb-8 ml-6">
                <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-2 border-4 border-white"></div>
                <span className="block text-lg font-semibold text-blue-900">{item.year}</span>
                <span className="block text-gray-700">{item.event}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Cam kết cộng đồng */}
        <section className="mb-4 text-left w-full max-w-6xl px-12 mx-auto">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 uppercase tracking-wide">Cam kết cộng đồng</h2>
          <div className="bg-green-50 rounded-xl p-8 shadow">
            <p className="text-lg text-gray-700 mb-2">
              Chúng tôi hướng tới phát triển bền vững, bảo vệ môi trường và đóng góp tích cực cho xã hội. HUST Auto Pro luôn đề cao sự tôn trọng, đa dạng và xây dựng cộng đồng người dùng văn minh, hỗ trợ lẫn nhau.
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Bảo vệ môi trường, sử dụng công nghệ xanh.</li>
              <li>Đảm bảo an toàn, quyền lợi cho người dùng.</li>
              <li>Thúc đẩy sự phát triển cộng đồng xe hơi Việt Nam.</li>
            </ul>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
