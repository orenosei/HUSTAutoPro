import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import Service from '@/Shared/Service';
import { FaHeart, FaRegCalendarAlt, FaRegCalendarCheck, FaRegCalendarTimes, FaRegComment } from 'react-icons/fa';

function Notification() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  // Lấy thông báo từ DB
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      const dbUser = await Service.GetUserByClerkId(user.id);
      if (!dbUser) return;
      const noti = await Service.GetUserNotifications(dbUser.id);
      setNotifications(noti);
    };
    fetchNotifications();
  }, [user]);

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

  // Hàm chọn icon theo loại thông báo
  const getIcon = (type, content) => {
    const iconProps = { size: 24, className: "mx-auto" };
    if (type === 'favorite' || type === 'favorite_blog') {
      return <FaHeart {...iconProps} className="text-red-500" />;
    }
    if (type === 'appointment') {
      return <FaRegCalendarAlt {...iconProps} className="text-blue-500" />;
    }
    if (type === 'appointment_status') {
      if (content.includes('chấp nhận')) {
        return <FaRegCalendarCheck {...iconProps} className="text-green-500" />;
      }
      if (content.includes('từ chối') || content.includes('bị từ chối')) {
        return <FaRegCalendarTimes {...iconProps} className="text-red-500" />;
      }
      return <FaRegCalendarAlt {...iconProps} className="text-blue-500" />;
    }
    if (type === 'comment') {
      return <FaRegComment {...iconProps} className="text-yellow-500" />;
    }
    return <Bell size={24} className="text-gray-400 mx-auto" />;
  };

  // Đánh dấu tất cả đã đọc
  const handleMarkAllRead = async () => {
    if (!user) return;
    setLoading(true);
    const dbUser = await Service.GetUserByClerkId(user.id);
    if (!dbUser) {
      setLoading(false);
      return;
    }
    await Service.MarkAllNotificationsAsRead(dbUser.id);
    // Cập nhật lại danh sách thông báo
    const noti = await Service.GetUserNotifications(dbUser.id);
    setNotifications(noti);
    setLoading(false);
  };

  // Thêm hàm đánh dấu 1 thông báo đã đọc
  const handleMarkOneRead = async (notiId) => {
    // Cập nhật DB
    await Service.MarkNotificationAsRead(notiId);
    // Cập nhật UI (có thể tối ưu chỉ update 1 phần tử)
    setNotifications((prev) => prev.map(n => n.id === notiId ? { ...n, isRead: true } : n));
  };

  // Đếm số thông báo chưa đọc
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Thông báo"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {/* Badge số lượng thông báo chưa đọc */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-bold border border-white">{unreadCount}</span>
        )}
      </button>
      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-fadeIn">
          <div className="flex items-center justify-between p-4 border-b font-semibold text-gray-700">
            <span>Thông báo</span>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={loading}
                className="text-sm font-semibold rounded-lg bg-blue-100 text-blue-700 px-3 py-1 ml-2 hover:bg-blue-200 transition-colors focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang cập nhật...' : 'Đánh dấu tất cả đã đọc'}
              </button>
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto px-2 py-2">
            {notifications.length === 0 ? (
              <li className="p-4 text-gray-500 text-center">Không có thông báo mới</li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => { if (!n.isRead) handleMarkOneRead(n.id); }}
                  className={`group flex items-center gap-3 p-4 mb-2 rounded-xl transition-all cursor-pointer bg-white
                    ${!n.isRead ? 'border-l-4 border-blue-500 shadow-lg bg-blue-300' : 'border border-gray-100'}
                    hover:shadow-xl hover:bg-blue-100/30`}
                >
                  <div className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center
                    ${n.isRead ? 'bg-gray-100' : 'bg-blue-100 shadow'} transition-all`}>
                    {getIcon(n.type, n.content)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-gray-800 text-[15px] leading-snug">
                        {(() => {
                          const match = n.content.match(/^(.*?)\s*(đã|:|,)/i);
                          if (match) {
                            const name = match[1];
                            const rest = n.content.slice(name.length);
                            return <><span className="font-bold">{name}</span>{rest}</>;
                          } else {
                            return n.content;
                          }
                        })()}
                      </div>
                      <div className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {new Date(n.createAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(n.createAt).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Notification; 