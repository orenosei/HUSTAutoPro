import React, { useEffect, useState } from "react";
import { useUser } from '@clerk/clerk-react';
import { db } from "../../../configs/index.js";
import { ViewHistory as ViewHistoryTable, CarListing, CarImages } from "../../../configs/schema.js";
import { useNavigate } from "react-router-dom";
import { eq, desc } from "drizzle-orm";
import Service from '@/Shared/Service';
import { toast } from "sonner";
import CarItem from '@/components/CarItem';
import { Button } from "@/components/ui/button";
import { FaTrashAlt } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";

// Danh sách xe mẫu để người dùng "xem"
const carList = [
  { id: 1, listingTitle: "Toyota Camry 2020" },
  { id: 2, listingTitle: "Honda Civic 2019" },
  { id: 3, listingTitle: "Mazda 3 2021" },
];

export async function GetViewHistoryByUserId(userId) {
  try {
    const result = await db
      .select()
      .from(ViewHistoryTable)
      .where(ViewHistoryTable.userId.eq(userId))
      .leftJoin(CarListing, ViewHistoryTable.carListingId.eq(CarListing.id))
      .orderBy(ViewHistoryTable.viewedAt.desc());
    return result;
  } catch (error) {
    console.error("Error fetching view history:", error);
    return [];
  }
}

// Hàm thêm lịch sử xem xe
export async function addViewHistory(userId, carListingId) {
  try {
    console.log("Bắt đầu lưu lịch sử xem xe:", { userId, carListingId });
    
    // Kiểm tra xem đã có lịch sử xem trong 24h gần đây chưa
    const existingHistory = await db
      .select()
      .from(ViewHistoryTable)
      .where(ViewHistoryTable.userId.eq(userId))
      .where(ViewHistoryTable.carListingId.eq(carListingId))
      .where(ViewHistoryTable.viewedAt.gt(new Date(Date.now() - 24 * 60 * 60 * 1000)));

    console.log("Kiểm tra lịch sử hiện có:", existingHistory);

    if (existingHistory.length > 0) {
      // Nếu đã có lịch sử trong 24h, cập nhật thời gian xem
      console.log("Cập nhật lịch sử xem xe đã tồn tại");
      await db
        .update(ViewHistoryTable)
        .set({ viewedAt: new Date() })
        .where(ViewHistoryTable.id.eq(existingHistory[0].id));
    } else {
      // Nếu chưa có lịch sử trong 24h, thêm mới
      console.log("Thêm mới lịch sử xem xe");
      await db.insert(ViewHistoryTable).values({
        userId: userId,
        carListingId: carListingId,
        viewedAt: new Date()
      });
    }

    // Kiểm tra lại sau khi lưu
    const checkResult = await db
      .select()
      .from(ViewHistoryTable)
      .where(ViewHistoryTable.userId.eq(userId))
      .where(ViewHistoryTable.carListingId.eq(carListingId))
      .orderBy(ViewHistoryTable.viewedAt.desc())
      .limit(1);

    console.log("Kết quả sau khi lưu:", checkResult);
    return true;
  } catch (error) {
    console.error("Lỗi khi lưu lịch sử xem xe:", error);
    return false;
  }
}

function ViewHistory() {
  const { user } = useUser();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        // Lấy userId thực từ db
        const foundUser = await Service.GetUserByClerkId(user.id);
        if (!foundUser) {
          console.error("Không tìm thấy user trong database.");
          setLoading(false);
          return;
        }

        const result = await db
          .select()
          .from(ViewHistoryTable)
          .leftJoin(CarListing, eq(ViewHistoryTable.carListingId, CarListing.id))
          .leftJoin(CarImages, eq(CarImages.carListingId, CarListing.id))
          .where(eq(ViewHistoryTable.userId, foundUser.id))
          .orderBy(desc(ViewHistoryTable.viewedAt));

        const formattedResult = Service.FormatResult(result);
        setHistory(formattedResult);
      } catch (error) {
        console.error('Lỗi khi lấy lịch sử xem xe:', error);
        setError("Không thể tải lịch sử xem xe");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleViewCar = async (carId) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để xem xe.");
      return;
    }

    try {
      const foundUser = await Service.GetUserByClerkId(user.id);
      if (!foundUser) {
        toast.error("Không tìm thấy thông tin người dùng.");
        return;
      }

      // Thêm vào lịch sử xem
      await db.insert(ViewHistoryTable).values({
        userId: foundUser.id,
        carListingId: carId,
        viewedAt: new Date()
      });

      // Chuyển đến trang chi tiết xe
      navigate(`/car/${carId}`);
    } catch (err) {
      console.error("Lỗi khi xem xe:", err);
      toast.error("Có lỗi xảy ra khi xem xe.");
    }
  };

  const handleRemoveHistory = async (carId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch sử xem xe này?')) return;
    try {
      setDeletingId(carId);
      // Xóa lịch sử xem xe theo carId và userId
      const foundUser = await Service.GetUserByClerkId(user.id);
      await db.delete(ViewHistoryTable)
        .where(eq(ViewHistoryTable.userId, foundUser.id))
        .where(eq(ViewHistoryTable.carListingId, carId));
      setHistory((prev) => prev.filter((car) => car.id !== carId));
      toast.success('Đã xóa lịch sử xem xe');
    } catch (error) {
      console.error("Lỗi khi xóa lịch sử xem xe:", error);
      toast.error('Xóa lịch sử xem xe thất bại');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRemoveAllHistory = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem xe?')) return;
    try {
      setDeletingAll(true);
      const foundUser = await Service.GetUserByClerkId(user.id);
      await db.delete(ViewHistoryTable)
        .where(eq(ViewHistoryTable.userId, foundUser.id));
      setHistory([]);
      toast.success('Đã xóa toàn bộ lịch sử xem xe');
    } catch (error) {
      console.error("Lỗi khi xóa toàn bộ lịch sử xem xe:", error);
      toast.error('Xóa toàn bộ lịch sử xem xe thất bại');
    } finally {
      setDeletingAll(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-4xl">Lịch Sử Xem Xe</h2>
        {history.length > 0 && (
          <Button
            className="text-white bg-red-400 flex-shrink-0 hover:bg-red-600"
            onClick={handleRemoveAllHistory}
            disabled={deletingAll}
          >
            {deletingAll ? <BiLoaderAlt className="animate-spin" /> : <><FaTrashAlt className="mr-2" /> Xóa tất cả</>}
          </Button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="text-red-400 italic mt-8 text-center">Bạn chưa xem xe nào.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-7">
          {history.map((car) => (
            <div key={car.id} className="p-3 flex flex-col">
              <CarItem car={car} />
              <div 
                className="p-3 bg-red-100 rounded-lg flex justify-center items-center mt-2 gap-5 hover:bg-red-200 transition-colors cursor-pointer"
                onClick={() => handleRemoveHistory(car.id)}
              >
                {deletingId === car.id ? (
                  <BiLoaderAlt className="animate-spin text-red-500 text-xl" />
                ) : (
                  <FaTrashAlt className="text-red-500 text-xl" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewHistory;
