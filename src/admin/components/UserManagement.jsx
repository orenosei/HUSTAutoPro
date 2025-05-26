import { useEffect, useState } from 'react'
import { db } from './../../../configs'
import { User } from './../../../configs/schema'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { BiLoaderAlt, BiSearch, BiTrash, BiUser } from 'react-icons/bi'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const getInitials = (firstName, lastName) => {
    const first = firstName?.[0]?.toUpperCase() || ''
    const last = lastName?.[0]?.toUpperCase() || ''
    return `${first}${last}` || '?'
  }

  const fetchUsers = async () => {
    try {
      const result = await db.select().from(User)
      setUsers(result)
    } catch (error) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteUser = async (userId) => {
    try {
      setDeletingId(userId)
      await db.delete(User).where(eq(User.id, userId))
      setUsers(prev => prev.filter(u => u.id !== userId))
      toast.success("User deleted successfully")
    } catch (error) {
      toast.error(error.message || "Failed to delete user")
    } finally {
      setDeletingId(null)
      setOpenDialog(false)
    }
  }

  const UserRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
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
              <CardTitle className="text-2xl font-bold text-gray-800">Quản lý người dùng</CardTitle>
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
                  <TableHead className="text-gray-600 font-medium py-3 ">Người dùng</TableHead>
                  <TableHead className="text-gray-600 font-medium">Email</TableHead>
                  <TableHead className="text-gray-600 font-medium">Điện thoại</TableHead>
                  <TableHead className="text-gray-600 font-medium"></TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody className="divide-y divide-gray-200">
                {loading ? (
                  Array(5).fill(0).map((_, index) => <UserRowSkeleton key={index} />)
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <BiUser className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">Không tìm thấy người dùng</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 text-blue-800 font-medium">
                            {getInitials(user.firstName, user.lastName)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{user.role}</p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-gray-600 max-w-[250px] truncate">{user.email}</TableCell>
                      
                      <TableCell className="text-gray-600 max-w-[150px] truncate">
                        {user.phoneNumber || 'N/A'}
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <Dialog open={openDialog && selectedUser?.id === user.id} 
                                onOpenChange={(open) => {
                                  if (!open) setSelectedUser(null)
                                  setOpenDialog(open)
                                }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="shadow-sm hover:scale-105 transition-transform text-gray-600 hover:text-red-600"
                              onClick={() => setSelectedUser(user)}
                            >
                              {deletingId === user.id ? (
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
                                Thao tác này không thể hoàn tác. Bạn chắc chắn muốn xóa?
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="flex items-center space-x-4 py-4">
                              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 font-medium text-xl">
                                {getInitials(selectedUser?.firstName, selectedUser?.lastName)}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {selectedUser?.firstName} {selectedUser?.lastName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {selectedUser?.email}
                                </p>
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
                                onClick={() => handleDeleteUser(selectedUser.id)}
                                disabled={deletingId === selectedUser?.id}
                              >
                                {deletingId === selectedUser?.id ? (
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

export default UserManagement