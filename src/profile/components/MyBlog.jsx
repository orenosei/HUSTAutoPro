import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useUser } from '@clerk/clerk-react'
import { db } from './../../../configs'
import { BlogPost, BlogImages, User, BlogFavourite } from './../../../configs/schema'
import { eq, desc } from 'drizzle-orm'
import { Link } from 'react-router-dom'
import Service from '@/Shared/Service'
import { FaTrashAlt } from 'react-icons/fa'
import { toast } from 'sonner'
import { BiLoaderAlt } from 'react-icons/bi'

function MyBlog() {
  const { user } = useUser()
  const [blogPosts, setBlogPosts] = useState([])
  const [deletingId, setDeletingId] = useState(null)

    useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const foundUser = await Service.GetUserByClerkId(user.id);
        if (!foundUser) {
          console.error("Không tìm thấy user trong database.");
          //setLoading(false);
          return;
        }

        const myBlogs = await Service.GetUserBlogPosts(foundUser.id);
        setBlogPosts(myBlogs);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
      } finally {
        //setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return

    try {
      setDeletingId(blogId)
      
      // Cascade delete will handle images and favourites
      await db.delete(BlogPost)
        .where(eq(BlogPost.id, blogId))

      setBlogPosts(prev => prev.filter(post => post.id !== blogId))
      toast.success('Xóa bài viết thành công')
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error)
      toast.error('Xóa bài viết thất bại')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className='mt-6'>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-4xl'>Blog Của Tôi</h2>
        <Link to={'/blog/add'}>
          <Button className='bg-blue-500 text-white hover:scale-110'>
            Viết Blog Mới
          </Button>
        </Link>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-7'>
        {blogPosts.map((post) => (
          <div key={post.id} className='border rounded-lg shadow-lg overflow-hidden'>
            {/* Blog Images */}
            {post.images?.[0]?.imageUrl && (
              <img 
                src={post.images[0].imageUrl} 
                alt={post.title}
                className='w-full h-48 object-cover'
              />
            )}
            
            <div className='p-4'>
              <h3 className='font-bold text-xl mb-2'>{post.title}</h3>
              <p className='text-gray-600 mb-4 line-clamp-3'>{post.content}</p>
              {post.tag && (
                <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2'>
                  #{post.tag}
                </span>
              )}
              
              <div className='flex justify-between mt-4 gap-3'>
                <Link to={`/blog/add?mode=edit&id=${post.id}`}>
                  <Button className='bg-green-500 hover:bg-green-600 text-white'>
                    Chỉnh Sửa
                  </Button>
                </Link>
                
                <Button 
                  className='bg-red-500 hover:bg-red-600 text-white'
                  onClick={() => handleDeleteBlog(post.id)}
                  disabled={deletingId === post.id}
                >
                  {deletingId === post.id ? (
                    <BiLoaderAlt className="animate-spin" />
                  ) : (
                    <FaTrashAlt />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBlog