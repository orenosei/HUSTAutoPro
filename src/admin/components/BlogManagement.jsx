import { useEffect, useState } from 'react'
import { db } from './../../../configs'
import { BlogPost, User, BlogImages } from './../../../configs/schema'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { BiLoaderAlt, BiSearch, BiTrash, BiNews, BiTime } from 'react-icons/bi'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import BlogItem from '@/blog/pages/components/BlogItem'

function BlogManagement() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [openDetailDialog, setOpenDetailDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const result = await db.select({
        blog: BlogPost,
        user: {
          firstName: User.firstName,
          lastName: User.lastName
        },
        images: BlogImages.imageUrl
      })
      .from(BlogPost)
      .leftJoin(User, eq(BlogPost.userId, User.id))
      .leftJoin(BlogImages, eq(BlogPost.id, BlogImages.blogPostId))

      const grouped = result.reduce((acc, curr) => {
        const existing = acc.find(item => item.blog.id === curr.blog.id)
        if (existing) {
          existing.images.push(curr.images)
        } else {
          acc.push({
            blog: curr.blog,
            user: curr.user,
            images: curr.images ? [curr.images] : []
          })
        }
        return acc
      }, [])

      setBlogs(grouped)
    } catch (error) {
      toast.error('Không tải được danh sách blog')
    } finally {
      setLoading(false)
    }
  }

  const filteredBlogs = blogs.filter(blog => 
    blog.blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${blog.user?.firstName} ${blog.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.blog.tag?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteBlog = async (blogId) => {
    try {
      setDeletingId(blogId)
      await db.delete(BlogPost).where(eq(BlogPost.id, blogId))
      setBlogs(prev => prev.filter(b => b.blog.id !== blogId))
      toast.success("Xóa blog thành công")
    } catch (error) {
      toast.error(error.message || "Xóa blog thất bại")
    } finally {
      setDeletingId(null)
      setOpenDeleteDialog(false)
    }
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })}`
  }

  const BlogRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      </TableCell>
      <TableCell className="text-right">
        <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse" />
      </TableCell>
    </TableRow>
  )

  return (
    <div className="overflow-x-auto w-full">
      <Card className="shadow-lg border border-gray-200 min-w-[900px]">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">Quản lý blog</CardTitle>
            </div>
            <div className="relative w-full md:max-w-xs">
              <BiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Tìm kiếm..."
                className="pl-10 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-gray-200 overflow-x-auto">
            <Table className="divide-y divide-gray-200 min-w-[900px]">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-gray-600 font-medium py-3">Tiêu đề</TableHead>
                  <TableHead className="text-gray-600 font-medium">Đăng bởi</TableHead>
                  <TableHead className="text-gray-600 font-medium">Thời gian đăng</TableHead>
                  <TableHead className="text-gray-600 font-medium"></TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody className="divide-y divide-gray-200">
                {loading ? (
                  Array(5).fill(0).map((_, index) => <BlogRowSkeleton key={index} />)
                ) : filteredBlogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <BiNews className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">Không tìm thấy bài viết</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBlogs.map((blogData) => {
                    const formattedBlog = {
                      ...blogData.blog,
                      images: blogData.images,
                      author: blogData.user,
                      createdAt: blogData.blog.createdAt
                    }

                    return (
                      <TableRow key={blogData.blog.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="max-w-[250px] truncate">
                          {blogData.blog.title}
                        </TableCell>
                        
                        <TableCell className="text-gray-600">
                          {blogData.user ? `${blogData.user.firstName} ${blogData.user.lastName}` : 'Ẩn danh'}
                        </TableCell>

                        <TableCell className="text-gray-600">
                          <div className="flex items-center gap-2">
                            <BiTime className="text-gray-400" />
                            {formatDateTime(blogData.blog.createdAt)}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {/* Dialog xem chi tiết */}
                            <Dialog 
                              open={openDetailDialog && selectedBlog?.id === blogData.blog.id}
                              onOpenChange={(open) => {
                                if (!open) setSelectedBlog(null)
                                setOpenDetailDialog(open)
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setSelectedBlog(formattedBlog)}
                                  className="shadow-sm hover:scale-105 transition-transform text-gray-600 hover:text-green-600"
                                >
                                  Xem chi tiết
                                </Button>
                              </DialogTrigger>

                              <DialogContent
                                className="max-h-[90vh] overflow-y-auto bg-white border border-gray-300 shadow-lg"
                                hideClose
                              >
                                <BlogItem blog={selectedBlog} />
                              </DialogContent>
                            </Dialog>

                            {/* Dialog xóa bài viết */}
                            <Dialog 
                                open={openDeleteDialog && selectedBlog?.id === blogData.blog.id}
                                onOpenChange={(open) => {
                                  if (!open) setSelectedBlog(null)
                                  setOpenDeleteDialog(open)
                                }}
                              >
                              <DialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setSelectedBlog(formattedBlog)}
                                  className="shadow-sm hover:scale-105 transition-transform text-gray-600 hover:text-red-600"
                                >
                                  {deletingId === blogData.blog.id ? (
                                    <BiLoaderAlt className="animate-spin h-4 w-4" />
                                  ) : (
                                    <>
                                      <BiTrash className="h-4 w-4 mr-2" />
                                      Xóa
                                    </>
                                  )}
                                </Button>
                              </DialogTrigger>
                              
                              <DialogContent className="sm:max-w-[425px] bg-gray-100 border border-gray-300 shadow-lg">
                                <DialogHeader>
                                  <DialogTitle className="text-red-600">
                                    Xác nhận xóa
                                  </DialogTitle>
                                  <DialogDescription className="pt-2">
                                    Thao tác này sẽ xóa vĩnh viễn bài viết
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="flex flex-col space-y-4 py-4">
                                  <div className="flex items-center space-x-2">
                                    <BiNews className="h-6 w-6 text-gray-600" />
                                    <p className="font-medium">{selectedBlog?.title}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-500">Người đăng</p>
                                      <p>{selectedBlog?.author?.firstName} {selectedBlog?.author?.lastName}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Thời gian đăng</p>
                                      <p>{selectedBlog && formatDateTime(selectedBlog.createdAt)}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <DialogFooter>
                                  <Button 
                                    variant="destructive" 
                                    onClick={() => setOpenDeleteDialog(false)}
                                    className="shadow-sm hover:scale-105 transition-transform text-gray-600 hover:text-green-600"
                                  >
                                    Hủy bỏ
                                  </Button>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => handleDeleteBlog(selectedBlog?.id)}
                                    disabled={deletingId === selectedBlog?.id}
                                    className="shadow-sm hover:scale-105 transition-transform text-gray-600 hover:text-red-600"
                                  >
                                    {deletingId === selectedBlog?.id ? (
                                      <BiLoaderAlt className="animate-spin h-4 w-4 mr-2" />
                                    ) : (
                                      <BiTrash className="h-4 w-4 mr-2" />
                                    )}
                                    Xác nhận xóa
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogManagement