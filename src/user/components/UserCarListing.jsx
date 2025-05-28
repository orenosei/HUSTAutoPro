import MyListing from '@/profile/components/MyListing'
import React from 'react'
import { useParams } from 'react-router-dom'
function UserCarListing() {
  const { id } = useParams()

  return (
    <div className="mt-6">
      <MyListing currentUserId={id} showEditButton={false} />
    </div>
  )
}

export default UserCarListing
