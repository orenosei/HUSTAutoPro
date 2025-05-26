import { Clerk } from '@clerk/clerk-sdk-node'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const clerk = Clerk(clerkPublishableKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId } = req.body
    await clerk.users.deleteUser(userId)
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ error: error.message || 'Failed to delete user' })
  }
}