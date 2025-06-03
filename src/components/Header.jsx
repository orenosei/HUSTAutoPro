import { UserButton, useUser, SignInButton } from '@clerk/clerk-react'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import Notification from './Notification';

function Header() {
  const { user, isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Danh sách thông báo mẫu
  const notifications = [
    { id: 1, title: 'Bạn có lịch hẹn mới', time: '2 phút trước' },
    { id: 2, title: 'Bài đăng của bạn đã được duyệt', time: '1 giờ trước' },
    { id: 3, title: 'Có tin nhắn mới', time: 'Hôm qua' },
  ];

  return (
    <header className='flex justify-between items-center shadow-sm p-5 bg-white'>
      <img src='/shingeki.png' alt='Logo' className='w-12 h-12 cursor-pointer hover:scale-110 transition-transform' />

      <nav>
        <ul className='hidden md:flex gap-20 text-gray-700'>
          <li className=' rounded-xl font-medium hover:scale-105 transition-transform cursor-pointer hover:text-red-500'>
            <Link to='/'>Trang Chủ</Link>
          </li>
          <li className=' rounded-xl font-medium hover:scale-105 transition-transform cursor-pointer hover:text-red-500'>
            <Link to='/search'>Tìm Kiếm</Link>
          </li>
          <li className=' rounded-xl font-medium hover:scale-105 transition-transform cursor-pointer hover:text-red-500'>
            <Link to='/listings'>Danh Sách Xe</Link>
          </li>
          <li className=' rounded-xl font-medium hover:scale-105 transition-transform cursor-pointer hover:text-red-500'>
            <Link to='/blog'>Blog</Link>
          </li>
          <li className=' rounded-xl font-medium hover:scale-105 transition-transform cursor-pointer hover:text-red-500'>
            <Link to='/intro'>Giới Thiệu</Link>
          </li>
        </ul>
      </nav>

      <div className='flex items-center gap-4'>
        {isSignedIn ? (
          <>
            <Notification />
            <UserButton />
            <Link to='/profile'>
              <Button className='bg-red-500 text-white hover:scale-110 hover:bg-red-600 transition-transform px-4 py-2 rounded-lg shadow-md'>
                Trang Cá Nhân
              </Button>
            </Link>
          </>
        ) : (
          <SignInButton>
            <Button className='bg-red-500 text-white hover:scale-110 hover:bg-red-600 transition-transform px-4 py-2 rounded-lg shadow-md'>
              Đăng Nhập
            </Button>
          </SignInButton>
        )}
      </div>
    </header>
  )
}

export default Header