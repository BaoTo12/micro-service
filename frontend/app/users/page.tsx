'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Plus, Search, Edit, Trash2, UserCheck, UserX, Shield } from 'lucide-react'
import { userService } from '@/lib/services/userService'
import { User, CreateUserRequest, UserStatus } from '@/types'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { UserForm } from '@/components/UserForm'
import { UserModal } from '@/components/UserModal'

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(10)

  const queryClient = useQueryClient()

  const { data: usersData, isLoading, error } = useQuery(
    ['users', currentPage, pageSize],
    () => userService.getUsersPaginated(currentPage, pageSize, 'createdAt', 'desc'),
    {
      keepPreviousData: true,
    }
  )

  const { data: searchResults } = useQuery(
    ['users-search', searchTerm],
    () => userService.searchUsersByName(searchTerm),
    {
      enabled: searchTerm.length > 2,
    }
  )

  const createUserMutation = useMutation(userService.createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
      setShowCreateModal(false)
      toast.success('User created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create user')
    },
  })

  const updateUserMutation = useMutation(
    ({ id, data }: { id: number; data: any }) => userService.updateUser(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        setEditingUser(null)
        toast.success('User updated successfully!')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update user')
      },
    }
  )

  const deleteUserMutation = useMutation(userService.deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
      toast.success('User deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user')
    },
  })

  const statusUpdateMutation = useMutation(
    ({ id, action }: { id: number; action: 'activate' | 'deactivate' | 'suspend' }) => {
      switch (action) {
        case 'activate':
          return userService.activateUser(id)
        case 'deactivate':
          return userService.deactivateUser(id)
        case 'suspend':
          return userService.suspendUser(id)
        default:
          throw new Error('Invalid action')
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        toast.success('User status updated successfully!')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update user status')
      },
    }
  )

  const handleCreateUser = (userData: CreateUserRequest) => {
    createUserMutation.mutate(userData)
  }

  const handleUpdateUser = (userData: CreateUserRequest) => {
    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, data: userData })
    }
  }

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(id)
    }
  }

  const handleStatusUpdate = (id: number, action: 'activate' | 'deactivate' | 'suspend') => {
    statusUpdateMutation.mutate({ id, action })
  }

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'bg-green-100 text-green-800'
      case UserStatus.INACTIVE:
        return 'bg-yellow-100 text-yellow-800'
      case UserStatus.SUSPENDED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const displayUsers = searchTerm.length > 2 ? searchResults : usersData?.content || []

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Users</h2>
          <p className="text-gray-600 mb-4">Failed to load users. Please check if the backend services are running.</p>
          <Link href="/" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage users in your system</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/" className="btn btn-secondary">
                Back to Dashboard
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Age</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            {user.address && (
                              <div className="text-sm text-gray-500">{user.address}</div>
                            )}
                          </div>
                        </td>
                        <td className="text-gray-900">{user.email}</td>
                        <td className="text-gray-900">{user.phoneNumber || '-'}</td>
                        <td className="text-gray-900">{user.age || '-'}</td>
                        <td>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Edit user"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            
                            {user.status === UserStatus.ACTIVE ? (
                              <button
                                onClick={() => handleStatusUpdate(user.id, 'deactivate')}
                                className="p-1 text-yellow-400 hover:text-yellow-600"
                                title="Deactivate user"
                              >
                                <UserX className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStatusUpdate(user.id, 'activate')}
                                className="p-1 text-green-400 hover:text-green-600"
                                title="Activate user"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleStatusUpdate(user.id, 'suspend')}
                              className="p-1 text-red-400 hover:text-red-600"
                              title="Suspend user"
                            >
                              <Shield className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1 text-red-400 hover:text-red-600"
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {usersData && !searchTerm && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {usersData.numberOfElements} of {usersData.totalElements} users
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={usersData.first}
                        className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-700">
                        Page {usersData.pageable.pageNumber + 1} of {usersData.totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={usersData.last}
                        className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      {showCreateModal && (
        <UserModal
          title="Create User"
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateUser}
          isLoading={createUserMutation.isLoading}
        />
      )}

      {editingUser && (
        <UserModal
          title="Edit User"
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleUpdateUser}
          isLoading={updateUserMutation.isLoading}
        />
      )}
    </div>
  )
}
