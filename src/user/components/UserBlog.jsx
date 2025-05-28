import React from 'react'
import { useParams } from 'react-router-dom'
import MyBlog from '@/profile/components/MyBlog'
function UserBlog() {
  const { id } = useParams()

  return (
    <div className="mt-6">
      <MyBlog currentUserId={id} showEditButton={false} />
    </div>
  )
}

export default UserBlog
