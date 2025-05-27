import React, { useEffect, useState } from 'react'
import { db } from './../../../../../configs'
import { ReportBlogPost, User, BlogPost, BlogImages } from './../../../../../configs/schema'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { BiLoaderAlt, BiSearch, BiTrash, BiNews, BiTime, BiXCircle, BiCheckCircle } from 'react-icons/bi'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import BlogItem from '@/blog/pages/components/BlogItem'

function BlogReport() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [openDetailDialog, setOpenDetailDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const result = await db.select({
        report: ReportBlogPost,
        reporter: {
          firstName: User.firstName,
          lastName: User.lastName
        },
        blog: BlogPost,
        images: BlogImages.imageUrl
      })
      .from(ReportBlogPost)
      .leftJoin(User, eq(ReportBlogPost.reporterId, User.id))
      .leftJoin(BlogPost, eq(ReportBlogPost.blogPostId, BlogPost.id))
      .leftJoin(BlogImages, eq(BlogPost.id, BlogImages.blogPostId))

      const grouped = result.reduce((acc, curr) => {
        const existing = acc.find(item => item.report.id === curr.report.id)
        if (existing) {
          if (curr.images) existing.images.push(curr.images)
        } else {
          acc.push({
            ...curr,
            images: curr.images ? [curr.images] : []
          })
        }
        return acc
      }, [])

      setReports(grouped)
    } catch (error) {
      toast.error('Không tải được danh sách báo cáo')
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = reports.filter(report => 
    report.blog?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${report.reporter?.firstName} ${report.reporter?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.report.reason.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRejectReport = async (reportId) => {
    try {
      setActionLoading(reportId)
      await db.update(ReportBlogPost)
        .set({ status: 'Đã từ chối' })
        .where(eq(ReportBlogPost.id, reportId))
      
      setReports(prev => prev.map(r => 
        r.report.id === reportId ? 
        { ...r, report: { ...r.report, status: 'Đã từ chối' } } : r
      ))
      toast.success("Đã từ chối báo cáo")
    } catch (error) {
      toast.error(error.message || "Thao tác thất bại")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteBlog = async (blogId) => {
    try {
      setActionLoading(blogId)
      await db.delete(BlogPost).where(eq(BlogPost.id, blogId))
      setReports(prev => prev.filter(r => r.blog.id !== blogId))
      toast.success("Xóa blog thành công")
    } catch (error) {
      toast.error(error.message || "Xóa blog thất bại")
    } finally {
      setActionLoading(null)
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

  const statusBadge = (status) => {
    let style = ''
    switch(status) {
      case 'Đang chờ xử lý':
        style = 'bg-yellow-100 text-yellow-800'
        break
      case 'Đã từ chối':
        style = 'bg-gray-100 text-gray-800'
        break
      case 'Đã xử lý':
        style = 'bg-green-100 text-green-800'
        break
      default:
        style = 'bg-blue-100 text-blue-800'
    }
    return <span className={`px-2.5 py-1 rounded-full text-sm ${style}`}>{status}</span>
  }

  const ReportRowSkeleton = () => (
    <TableRow>
      <TableCell><div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" /></TableCell>
      <TableCell><div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" /></TableCell>
      <TableCell><div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" /></TableCell>
      <TableCell><div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" /></TableCell>
      <TableCell className="text-right"><div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse" /></TableCell>
    </TableRow>
  )

  return (
    <div className="overflow-x-auto w-full">
      <Card className="shadow-lg border border-gray-200 min-w-[900px]">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">Quản lý báo cáo blog</CardTitle>
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
                  <TableHead className="text-gray-600 font-medium">Người báo cáo</TableHead>
                  <TableHead className="text-gray-600 font-medium">Blog ID</TableHead>
                  <TableHead className="text-gray-600 font-medium">Trạng thái</TableHead>
                  <TableHead className="text-gray-600 font-medium">Thời gian</TableHead>
                  <TableHead className="text-gray-600 font-medium text-right"></TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody className="divide-y divide-gray-200">
                {loading ? (
                  Array(5).fill(0).map((_, index) => <ReportRowSkeleton key={index} />)
                ) : filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <BiNews className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">Không tìm thấy báo cáo</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((reportData) => {
                    const formattedBlog = reportData.blog ? {
                      ...reportData.blog,
                      images: reportData.images,
                      author: reportData.blog.user,
                      createdAt: reportData.blog.createdAt
                    } : null

                    return (
                      <TableRow key={reportData.report.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          {reportData.reporter ? 
                            `${reportData.reporter.firstName} ${reportData.reporter.lastName}` : 
                            'Ẩn danh'}
                        </TableCell>
                        
                        <TableCell>
                          {reportData.blog?.id || 'Đã xóa'}
                        </TableCell>

                        <TableCell>
                          {statusBadge(reportData.report.status)}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <BiTime className="text-gray-400" />
                            {formatDateTime(reportData.report.createdAt)}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {/* Xem chi tiết */}
                            <Dialog
                              open={openDetailDialog && selectedReport?.id === reportData.report.id}
                              onOpenChange={(open) => {
                                if (!open) setSelectedReport(null)
                                setOpenDetailDialog(open)
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedReport({
                                    ...reportData.report,
                                    blog: formattedBlog,
                                    reporter: reportData.reporter
                                  })}
                                  className="hover:bg-blue-50"
                                >
                                  Chi tiết
                                </Button>
                              </DialogTrigger>

                              <DialogContent className="max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Chi tiết báo cáo</DialogTitle>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="font-medium mb-2">Lý do báo cáo:</h3>
                                    <p className="text-gray-600">{selectedReport?.reason}</p>
                                  </div>
                                  
                                  {selectedReport?.blog && (
                                    <>
                                      <h3 className="font-medium mb-2">Bài viết bị báo cáo:</h3>
                                      <BlogItem blog={selectedReport.blog} />
                                    </>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* Từ chối */}
                            {reportData.report.status === 'Đang chờ xử lý' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectReport(reportData.report.id)}
                                disabled={actionLoading === reportData.report.id}
                                className="text-red-600 hover:bg-red-50"
                              >
                                {actionLoading === reportData.report.id ? (
                                  <BiLoaderAlt className="animate-spin h-4 w-4" />
                                ) : (
                                  <>
                                    <BiXCircle className="h-4 w-4 mr-2" />
                                    Từ chối
                                  </>
                                )}
                              </Button>
                            )}

                            {/* Xóa blog */}
                            {reportData.blog && (
                              <Dialog 
                                open={openDeleteDialog && selectedReport?.id === reportData.report.id}
                                onOpenChange={(open) => {
                                  if (!open) setSelectedReport(null)
                                  setOpenDeleteDialog(open)
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setSelectedReport({
                                      ...reportData.report,
                                      blog: formattedBlog
                                    })}
                                    className="hover:bg-red-50"
                                  >
                                    {actionLoading === reportData.blog.id ? (
                                      <BiLoaderAlt className="animate-spin h-4 w-4" />
                                    ) : (
                                      <>
                                        <BiTrash className="h-4 w-4 mr-2" />
                                        Xóa blog
                                      </>
                                    )}
                                  </Button>
                                </DialogTrigger>
                                
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Xác nhận xóa blog</DialogTitle>
                                    <DialogDescription>
                                      Thao tác này sẽ xóa vĩnh viễn bài viết và tất cả báo cáo liên quan
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="py-4">
                                    <p className="font-medium">{selectedReport?.blog?.title}</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                      Tác giả: {selectedReport?.blog?.author?.firstName} {selectedReport?.blog?.author?.lastName}
                                    </p>
                                  </div>
                                  
                                  <DialogFooter>
                                    <Button 
                                      variant="outline"
                                      onClick={() => setOpenDeleteDialog(false)}
                                    >
                                      Hủy bỏ
                                    </Button>
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleDeleteBlog(selectedReport?.blog?.id)}
                                      disabled={actionLoading === selectedReport?.blog?.id}
                                    >
                                      Xác nhận xóa
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
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

export default BlogReport