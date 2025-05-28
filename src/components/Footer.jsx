import React from 'react';
import {
  FaFacebookF,
  FaTiktok,
  FaGithub,
  FaUniversity,
  FaBarcode,
  FaMapMarkerAlt,
  FaCode,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        <div className="flex flex-col items-start space-y-4">
          <img src="/hustautopro.png" alt="Showroom xe" className="w-40" />
          <p className="italic text-lg font-semibold">Lướt tìm xe hay <br/> Chốt ngay giá tốt.</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-xl">THÔNG TIN</h3>
          <div className="flex items-start gap-3">
            <FaUniversity className="mt-1" />
            <span>Công ty cổ phần HUST Auto Pro</span>
          </div>
          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className="mt-1" />
            <span>1 Đ. Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội, Việt Nam</span>
          </div>
          <div className="flex items-start gap-3">
            <FaEnvelope className="mt-1" />
            <span>hustautopro@gmail.com</span>
          </div>
          <div className="flex items-start gap-3">
            <FaPhone className="mt-1" />
            <span>034567890</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-xl">HƯỚNG DẪN</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Trang chủ</a></li>
            <li><a href="#" className="hover:underline">Tìm kiếm</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
            <li><a href="#" className="hover:underline">Liên hệ</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-xl">ĐIỀU KHOẢN</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Hướng Dẫn Thanh Toán</a></li>
            <li><a href="#" className="hover:underline">Giới Thiệu</a></li>
            <li><a href="#" className="hover:underline">Câu Hỏi Thường Gặp</a></li>
            <li><a href="#" className="hover:underline">Điều Khoản Dịch Vụ</a></li>
            <li><a href="#" className="hover:underline">Chính Sách Bảo Mật</a></li>
          </ul>
        </div>

      </div>


      {/* Social & Copyright */}
      <div className="border-t border-gray-300 py-6 text-center space-y-4">
        <div className="flex justify-center gap-6">
          <a href="https://www.facebook.com/profile.php?id=61576990521955" target="_blank" rel="noreferrer" className="hover:text-red-400">
            <FaFacebookF size={20} />
          </a>
          <a href="https://www.tiktok.com/@hustautopro?is_from_webapp=1&sender_device=pc" target="_blank" rel="noreferrer" className="hover:text-red-400">
            <FaTiktok size={20} />
          </a>
          <a href="https://github.com/orenosei/HUSTAutoPro" target="_blank" rel="noreferrer" className="hover:text-red-400">
            <FaGithub size={20} />
          </a>
        </div>
        <p className="text-sm text-gray-600">© 2025 HUSTAutoPro. <br/> Bản quyền thuộc về HUSTAutoPro</p>
      </div>
    </footer>
  );
}

export default Footer;
