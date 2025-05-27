import React, { useEffect, useState } from 'react'
import { db } from './../../../../../configs'
import { ReportBlogPost, User, BlogPost, BlogImages } from './../../../../../configs/schema'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { BiLoaderAlt, BiSearch, BiTrash, BiNews, BiTime, BiXCircle, BiLinkExternal } from 'react-icons/bi'
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
                    <TableHead className="text-gray-600 font-medium text-right pr-6"></TableHead>
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
                          <TableCell className="align-middle">
                            {reportData.reporter ? 
                              `${reportData.reporter.firstName} ${reportData.reporter.lastName}` : 
                              'Ẩn danh'}
                          </TableCell>
                          
                          <TableCell className="align-middle">
                            {reportData.blog?.id || 'Đã xóa'}
                          </TableCell>

                          <TableCell className="align-middle">
                            {statusBadge(reportData.report.status)}
                          </TableCell>

                          <TableCell className="align-middle">
                            <div className="flex items-center gap-2">
                              <BiTime className="text-gray-400 shrink-0" />
                              {formatDateTime(reportData.report.createdAt)}
                            </div>
                          </TableCell>
                          
                          <TableCell className="text-right align-middle">
                            <div className="flex justify-end gap-3 pr-2">
                              {/* Chi tiết */}
                              <div className="w-[115px]">
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
                                      className="w-full gap-2 px-3 hover:bg-blue-50/80 border-blue-200 text-blue-600 hover:text-blue-700"
                                      onClick={() => setSelectedReport({
                                        ...reportData.report,
                                        blog: formattedBlog,
                                        reporter: reportData.reporter
                                      })}
                                    >
                                      <BiLinkExternal className="text-base shrink-0" />
                                      <span className="truncate">Chi tiết</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent 
                                    className="max-h-[90vh] overflow-y-auto bg-gray-100 border border-gray-300 shadow-lg rounded-lg"
                                    onOpenAutoFocus={e => e.preventDefault()}
                                  >
                                    {selectedReport && (
                                      <>
                                        <DialogHeader>
                                          <DialogTitle>Chi tiết báo cáo</DialogTitle>
                                        </DialogHeader>
                                        
                                        <div className="space-y-4">
                                          <div>
                                            <h3 className="font-medium mb-2">Lý do báo cáo:</h3>
                                            <p className="text-gray-600 whitespace-pre-wrap">{selectedReport.reason}</p>
                                          </div>
                                          
                                          {selectedReport.blog && (
                                            <>

                                              <BlogItem blog={selectedReport.blog} />
                                            </>
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </DialogContent>
                                </Dialog>
                              </div>

                              {/* Từ chối */}
                              <div className="w-[115px]">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`w-full gap-2 px-3 border ${
                                    reportData.report.status === 'Đang chờ xử lý' 
                                      ? 'border-orange-200 text-orange-600 hover:bg-orange-50/80 hover:text-orange-700' 
                                      : 'border-gray-200 text-gray-400 cursor-not-allowed'
                                  }`}
                                  onClick={() => handleRejectReport(reportData.report.id)}
                                  disabled={reportData.report.status !== 'Đang chờ xử lý' || actionLoading === reportData.report.id}
                                >
                                  {actionLoading === reportData.report.id ? (
                                    <BiLoaderAlt className="animate-spin h-4 w-4 shrink-0" />
                                  ) : (
                                    <>
                                      <BiXCircle className="text-base shrink-0" />
                                      <span className="truncate">Từ chối</span>
                                    </>
                                  )}
                                </Button>
                              </div>

                              {/* Xóa blog */}
                              <div className="w-[115px]">
                                {reportData.blog ? (
                                  <Dialog
                                    open={openDeleteDialog && selectedReport?.id === reportData.report.id}
                                    onOpenChange={(open) => {
                                      if (!open) setSelectedReport(null)
                                      setOpenDeleteDialog(open)
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-2 px-3 hover:bg-red-50/80 border-red-200 text-red-600 hover:text-red-700"
                                        onClick={() => setSelectedReport({
                                          ...reportData.report,
                                          blog: formattedBlog
                                        })}
                                      >
                                        <BiTrash className="text-base shrink-0" />
                                        <span className="truncate">Xóa blog</span>
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent 
                                      className="sm:max-w-[425px] bg-gray-100 border border-gray-300 shadow-lg rounded-lg"
                                      onOpenAutoFocus={e => e.preventDefault()}
                                    >
                                      {selectedReport?.blog && (
                                        <>
                                          <DialogHeader>
                                            <DialogTitle>Xác nhận xóa blog</DialogTitle>
                                            <DialogDescription>
                                              Thao tác này sẽ xóa vĩnh viễn bài viết và tất cả báo cáo liên quan
                                            </DialogDescription>
                                          </DialogHeader>
                                          
                                          <div className="py-4 space-y-2">
                                            <p className="font-medium truncate">{selectedReport.blog.title}</p>

                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                              <BiTime className="shrink-0" />
                                              <span>Ngày đăng: {formatDateTime(selectedReport.blog.createdAt)}</span>
                                            </div>
                                          </div>
                                          
                                          <DialogFooter>
                                            <Button 
                                              variant="destructive"
                                              onClick={() => setOpenDeleteDialog(false)}
                                              className="border-gray-300 hover:bg-gray-800 bg-gray-600"
                                            >
                                              Hủy bỏ
                                            </Button>
                                            <Button 
                                              variant="destructive"
                                              onClick={() => handleDeleteBlog(selectedReport.blog.id)}
                                              disabled={actionLoading === selectedReport.blog.id}
                                              className="bg-red-600 hover:bg-red-700"
                                            >
                                              {actionLoading === selectedReport.blog.id ? (
                                                <BiLoaderAlt className="animate-spin h-4 w-4 mr-2" />
                                              ) : null}
                                              Xác nhận xóa
                                            </Button>
                                          </DialogFooter>
                                        </>
                                      )}
                                    </DialogContent>
                                  </Dialog>
                                ) : (
                                  <div className="w-full h-[36px]"></div>
                                )}
                              </div>
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