import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import Service from '@/Shared/Service'
import { FaTrashAlt } from 'react-icons/fa'
import { toast } from 'sonner'
import { BiLoaderAlt } from 'react-icons/bi'
import BlogItem from '@/blog/pages/components/BlogItem'
import { db } from './../../../configs'
import { BlogPost } from './../../../configs/schema'
import { eq } from 'drizzle-orm'

function MyBlog({ currentUserId, showEditButton}) {
  const [blogPosts, setBlogPosts] = useState([])
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    currentUserId && fetchMyBlogs()
  }, [currentUserId])


  const fetchMyBlogs = async () => {
      const myBlogs = await Service.GetUserBlogPosts(currentUserId)
      setBlogPosts(myBlogs || [])
    }

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return

    try {
      setDeletingId(blogId)
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
        <h2 className='font-bold text-4xl'>
          {showEditButton ? 'Blog Của Tôi':''}
        </h2>
        {showEditButton && (
          <Link to={'/blog/add'}>
            <Button className='bg-blue-500 text-white hover:scale-110'>
              Viết Blog Mới
            </Button>
          </Link>
        )}
      </div>

      <div className="overflow-x-auto mt-7 py-4 px-4">
        <div className="flex gap-5">
        {blogPosts.map((post) => (
          <div key={post.id} className='relative group min-w-[400px] max-w-xs flex-shrink-0'>
            <BlogItem blog={post} />

          { showEditButton && (
            <div className='absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
              <Link to={`/blog/add?mode=edit&id=${post.id}`}>
                <Button className='bg-green-500 hover:bg-green-600 text-white p-2'>
                  Chỉnh Sửa
                </Button>
              </Link>
              
                <Button 
                  className='bg-red-500 hover:bg-red-600 text-white p-2'
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
          )}
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default MyBlog