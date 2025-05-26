import { useEffect, useState } from 'react'
import { db } from './../../../configs'
import { CarListing, User } from './../../../configs/schema'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { BiLoaderAlt, BiSearch, BiTrash, BiCar, BiLinkExternal, BiTime } from 'react-icons/bi'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

function CarListingManagement() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)

  useEffect(() => {
    fetchListings()
  }, [])

    const fetchListings = async () => {
    try {
      const result = await db.select({
        carListing: {
          id: CarListing.id,
          listingTitle: CarListing.listingTitle,
          postedOn: CarListing.postedOn,
        },
        user: {
          firstName: User.firstName,
          lastName: User.lastName
        }
      })
      .from(CarListing)
      .leftJoin(User, eq(CarListing.createdBy, User.id))

      setListings(result)
    } catch (error) {
      toast.error('Không tải được danh sách xe')
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = listings.filter(listing => 
    listing.carListing.listingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${listing.user?.firstName} ${listing.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.carListing.id.toString().includes(searchTerm)
  )

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })}`
  }

  const handleDeleteListing = async (listingId) => {
    try {
      setDeletingId(listingId)
      await db.delete(CarListing).where(eq(CarListing.id, listingId))
      setListings(prev => prev.filter(l => l.carListing.id !== listingId))
      toast.success("Xóa xe thành công")
    } catch (error) {
      toast.error(error.message || "Xóa xe thất bại")
    } finally {
      setDeletingId(null)
      setOpenDialog(false)
    }
  }

  const CarRowSkeleton = () => (
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
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
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
              <CardTitle className="text-2xl font-bold text-gray-800">Quản lý bài đăng xe</CardTitle>
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
                  <TableHead className="text-gray-600 font-medium">Link bài đăng</TableHead>
                  <TableHead className="text-gray-600 font-medium"></TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody className="divide-y divide-gray-200">
                {loading ? (
                  Array(5).fill(0).map((_, index) => <CarRowSkeleton key={index} />)
                ) : filteredListings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <BiCar className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">Không tìm thấy xe phù hợp</p>
                      </div>
                     </TableCell>
                  </TableRow>
                ) : (
                  filteredListings.map(({ carListing, user }) => (
                    <TableRow key={carListing.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="max-w-[250px] truncate">
                        {carListing.listingTitle}
                      </TableCell>
                      
                      <TableCell className="text-gray-600">
                        {user ? `${user.firstName} ${user.lastName}` : 'Người dùng đã xóa'}
                      </TableCell>

                      <TableCell className="text-gray-600">
                        <div className="flex items-center gap-2">
                          <BiTime className="text-gray-400" />
                          {formatDateTime(carListing.postedOn)}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-gray-600">
                        <Link 
                          to={`/listing-details/${carListing.id}`} 
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <BiLinkExternal />
                          Xem bài đăng
                        </Link>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <Dialog open={openDialog && selectedListing?.id === carListing.id} 
                                onOpenChange={(open) => {
                                  if (!open) setSelectedListing(null)
                                  setOpenDialog(open)
                                }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="shadow-sm hover:scale-105 transition-transform text-gray-600 hover:text-red-600"
                              onClick={() => setSelectedListing(carListing)}
                            >
                              {deletingId === carListing.id ? (
                                <BiLoaderAlt className="animate-spin h-4 w-4" />
                              ) : (
                                <>
                                  <BiTrash className="h-4 w-4 mr-2" />
                                  Xóa
                                </>
                              )}
                            </Button>
                          </DialogTrigger>
                          
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle className="text-red-600">
                                Xác nhận xóa
                              </DialogTitle>
                              <DialogDescription className="pt-2">
                                Thao tác này sẽ xóa vĩnh viễn thông tin xe
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="flex flex-col space-y-4 py-4">
                              <div className="flex items-center space-x-2">
                                <BiCar className="h-6 w-6 text-gray-600" />
                                <p className="font-medium">{carListing.listingTitle}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Người đăng</p>
                                  <p>{user ? `${user.firstName} ${user.lastName}` : 'Người dùng đã xóa'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">ID bài đăng</p>
                                  <p>{carListing.id}</p>
                                </div>
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button 
                                variant="outline" 
                                onClick={() => setOpenDialog(false)}
                              >
                                Hủy bỏ
                              </Button>
                              <Button 
                                variant="destructive"
                                onClick={() => handleDeleteListing(carListing.id)}
                                disabled={deletingId === carListing.id}
                              >
                                {deletingId === carListing.id ? (
                                  <BiLoaderAlt className="animate-spin h-4 w-4 mr-2" />
                                ) : (
                                  <BiTrash className="h-4 w-4 mr-2" />
                                )}
                                Xác nhận xóa
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CarListingManagement