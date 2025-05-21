import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { db } from './../../../configs';
import { Comment, User } from './../../../configs/schema';
import { eq } from 'drizzle-orm';
import Service from '@/Shared/Service';
import { toast} from 'sonner'



const CommentSection = ({ carListingId }) => {
    const { user } = useUser();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(5);
    const [dbUser, setDbUser] = useState(null); 
    const [showForm, setShowForm] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting comment...', { dbUser, newComment, rating });
      
        try {
          // Thêm comment mới
          const insertResult = await db.insert(Comment).values({
            userId: dbUser.id,
            carListingId,
            commentText: newComment,
            rating,
          }).returning(); 
          
          // Fetch lại comments
          const updatedComments = await db.select({
            comment: Comment,
            user: User
          })
          .from(Comment)
          .innerJoin(User, eq(Comment.userId, User.id))
          .where(eq(Comment.carListingId, carListingId));
      
          setComments(updatedComments);
          toast.success('Đánh giá của bạn đã được gửi thành công!');
          setNewComment('');
        } catch (error) {
          console.error("Full error details:", error);
        }
      };
      
      useEffect(() => {
        const fetchUser = async () => {
          if (user?.id) {
            try {
              const [userData] = await db.select()
                .from(User)
                .where(eq(User.clerkUserId, user.id));

              setDbUser(userData);
            } catch (error) {
              console.error('Error fetching user:', error);
            }
          }
        };
        
        fetchUser();
      }, [user?.id]);

      useEffect(() => {
        const fetchComments = async () => {
          const result = await db.select({
            comment: Comment,
            user: User
          })
          .from(Comment)
          .innerJoin(User, eq(Comment.userId, User.id))
          .where(eq(Comment.carListingId, carListingId));
          
          setComments(result);
        };
        fetchComments();
      }, [carListingId]);

return (
    <div className="p-10 rounded-xl bg-white shadow-md mt-6 border border-gray-200 my-6">
        <h2 className="text-2xl font-semibold mb-10">Đánh giá & Bình luận</h2>
        
        {/* Toggle Comment Form */}
        {user && (
            <div className="mb-10">
                <button
                    onClick={() => setShowForm((prev) => !prev)}
                    className="bg-blue-500 text-white ml-5 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    {showForm ? 'Ẩn form đánh giá' : 'Tạo đánh giá mới'}
                </button>
                {showForm && (
                    <form onSubmit={handleSubmit} className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Đánh giá của bạn</h3>
                        <div className="flex items-center mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-2xl transition-colors duration-200 ${
                                        star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            placeholder="Viết bình luận của bạn..."
                            rows={4}
                        />
                        <div className="text-right">
                            <button 
                                type="submit"
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Gửi đánh giá
                            </button>
                        </div>
                    </form>
                )}
            </div>
        )}

        {/* Comments List */}
        <h3 className="text-lg font-semibold mb-4">Bình luận</h3>
        <div className="max-h-96 overflow-y-auto w-full pl-6 pr-6 border border-gray-300 rounded-lg hover:outline-none hover:ring-2 hover:ring-blue-500">
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.comment.id} className="border-b border-gray-200 py-4 last:border-b-0">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                {comment.user.firstName[0]}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">
                                    {comment.user.firstName} {comment.user.lastName}
                                </h4>
                                <div className="flex items-center text-yellow-400">
                                    {[...Array(comment.comment.rating)].map((_, i) => (
                                        <span key={i} className="text-sm">★</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 ">{comment.comment.commentText}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
            )}
        </div>
    </div>
);
};

export default CommentSection;