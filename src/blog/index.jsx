import React, { useEffect, useState } from 'react'
import Masonry from '@mui/lab/Masonry'
import BlogItem from './pages/components/BlogItem'
import Service from '@/Shared/Service'
import Header from '@/components/Header'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

function Blog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))

  useEffect(() => {


    const fetchBlogs = async () => {
      try {
        const response = await Service.GetBlogPosts()
        
        if (response.success) {
          setBlogs(response.data)
        } else {
          setError(response.message || 'Lỗi tải danh sách bài viết')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (error) return <div className="text-red-500 p-6">Lỗi: {error}</div>

  return (
    <div>
      <Header />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 ml-6">Blog</h1>
        <div className="flex justify-end mb-6">
          <button
            className="px-4 py-2 mr-6 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => window.location.href = '/blog/add'}
          >
            + Viết blog mới
          </button>
        </div>

        <Masonry
          columns={{ xs: 1, sm: 2, md:2 , lg: 3 }}
          spacing={5}
          sx={{
            width: '100%',
            margin: 0
          }}
        >
          {blogs.map(blog => (
            <div key={blog.id} className="masonry-item">
              <BlogItem 
                blog={{
                  ...blog,
                  author: blog.author,
                  images: blog.images,
                  createdAt: blog.createdAt
                }}
              />
            </div>
          ))}
        </Masonry>

        {!loading && blogs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Chưa có bài viết nào được đăng
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog