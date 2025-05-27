import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@clerk/clerk-react';
import Service from '@/Shared/Service';
import { IoWarningOutline } from "react-icons/io5";
import { toast } from 'sonner'; 

const REPORT_REASONS = {
    carListing: [
        'Thông tin không đúng sự thật',
        'Xe đã bán nhưng không gỡ bài',
        'Ảnh không phù hợp',
        'Lừa đảo/Scam'
    ],
    blogPost: [
        'Nội dung không phù hợp',
        'Đạo văn',
        'Thông tin sai lệch',
        'Spam/quảng cáo'
    ],
    user: [
        'Tài khoản giả mạo',
        'Hành vi lừa đảo',
        'Spam/quấy rối',
        'Nội dung khiêu dâm'
    ]
};

function Report({ entityType, entity }) {
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (user && user.id) {
                const fetchedUser = await Service.GetUserByClerkId(user.id);
                setCurrentUser(fetchedUser);
            }
        };
        fetchCurrentUser();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Vui lòng đăng nhập để báo cáo');
            toast.error('Vui lòng đăng nhập để báo cáo');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const baseData = {
                reporterId: currentUser.id,
                reason,
                details: details || null,
                status: 'Đang chờ xử lý'
            };

            let result;
            switch (entityType) {
                case 'carListing':
                    result = await Service.createCarReport({
                        ...baseData,
                        carListingId: entity.id
                    });
                    break;
                case 'blogPost':
                    result = await Service.createBlogReport({
                        ...baseData,
                        blogPostId: entity.id
                    });
                    break;
                case 'user':
                    result = await Service.createUserReport({
                        ...baseData,
                        reportedUserId: entity.id
                    });
                    break;
                default:
                    throw new Error('Loại báo cáo không hợp lệ');
            }

            if (!result) throw new Error('Gửi báo cáo thất bại');
            
            setOpen(false);
            setReason('');
            setDetails('');
            toast.success('Gửi báo cáo thành công!'); // Thêm toast thành công
            
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi gửi báo cáo');
            toast.error(err.message || 'Có lỗi xảy ra khi gửi báo cáo'); // Thêm toast lỗi
        } finally {
            setIsSubmitting(false);
        }
    };

return (
        <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                        <Button
                                variant="destructive"
                                size="sm"
                                className="text-yellow-600 hover:text-yellow-700 font-semibold rounded-md px-4 py-2 shadow-sm transition-colors"
                        >
                                <IoWarningOutline />
                        </Button>
                </DialogTrigger>

                <DialogContent 
                        className="sm:max-w-[430px] bg-white border border-gray-200 shadow-2xl rounded-xl p-6">
                        <DialogHeader>
                                <DialogTitle className="text-lg font-bold text-gray-800 mb-2">
                                        Báo cáo {entityType === 'carListing' ? 'bài đăng xe' : entityType === 'blogPost' ? 'blog' : 'người dùng'}
                                </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                        <Label className="font-medium text-gray-700">Lý do báo cáo</Label>
                                        <Select value={reason} onValueChange={setReason} required>
                                                <SelectTrigger className="bg-gray-50 border-gray-300 focus:ring-2 focus:ring-red-200 rounded-md">
                                                        <SelectValue placeholder="Chọn lý do" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-100 border border-gray-300 shadow-lg rounded-md">
                                                        {REPORT_REASONS[entityType].map((reason) => (
                                                                <SelectItem
                                                                        key={reason}
                                                                        value={reason}
                                                                        className="hover:bg-red-50 focus:bg-red-100 border-gray-300 text-gray-800 hover:text-red-600 focus:text-red-600 font-medium px-3 py-2"
                                                                >
                                                                        {reason}
                                                                </SelectItem>
                                                        ))}
                                                </SelectContent>
                                        </Select>
                                </div>

                                <div className="space-y-2">
                                        <Label className="font-medium text-gray-700">Chi tiết bổ sung (không bắt buộc)</Label>
                                        <Textarea
                                                value={details}
                                                onChange={(e) => setDetails(e.target.value)}
                                                placeholder="Mô tả chi tiết vấn đề..."
                                                rows={3}
                                                maxLength={500}
                                                className="bg-gray-50 border-gray-300 rounded-md focus:ring-2 focus:ring-red-200"
                                        />
                                </div>

                                {error && (
                                        <p className="text-red-500 text-sm font-medium">{error}</p>
                                )}

                                <div className="flex justify-end gap-2 pt-2">
                                        <Button
                                                type="destructive"
                                                variant="outline"
                                                onClick={() => setOpen(false)}
                                                disabled={isSubmitting}
                                                className="rounded-md font-semibold text-gray-600 hover:text-gray-700 border-gray-300 hover:border-gray-400"
                                        >
                                                Hủy
                                        </Button>
                                        <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold"
                                        >
                                                {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
                                        </Button>
                                </div>
                        </form>
                </DialogContent>
        </Dialog>
);
};

export default Report;