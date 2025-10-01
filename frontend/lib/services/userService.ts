import api from '../api'
import { User, CreateUserRequest, UpdateUserRequest, UserStatistics, PaginatedResponse } from '@/types'

export const userService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/api/users')
    return response.data
  },

  // Get users with pagination
  getUsersPaginated: async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: string = 'asc'
  ): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/api/users/paginated', {
      params: { page, size, sortBy, sortDir }
    })
    return response.data
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/api/users/${id}`)
    return response.data
  },

  // Get user by email
  getUserByEmail: async (email: string): Promise<User> => {
    const response = await api.get(`/api/users/email/${email}`)
    return response.data
  },

  // Create user
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post('/api/users', userData)
    return response.data
  },

  // Update user
  updateUser: async (id: number, userData: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/api/users/${id}`, userData)
    return response.data
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/api/users/${id}`)
  },

  // Search users by name
  searchUsersByName: async (name: string): Promise<User[]> => {
    const response = await api.get('/api/users/search/name', {
      params: { name }
    })
    return response.data
  },

  // Advanced search
  advancedSearch: async (
    searchTerm: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: string = 'asc'
  ): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/api/users/search/advanced', {
      params: { searchTerm, page, size, sortBy, sortDir }
    })
    return response.data
  },

  // Activate user
  activateUser: async (id: number): Promise<User> => {
    const response = await api.patch(`/api/users/${id}/activate`)
    return response.data
  },

  // Deactivate user
  deactivateUser: async (id: number): Promise<User> => {
    const response = await api.patch(`/api/users/${id}/deactivate`)
    return response.data
  },

  // Suspend user
  suspendUser: async (id: number): Promise<User> => {
    const response = await api.patch(`/api/users/${id}/suspend`)
    return response.data
  },

  // Get user statistics
  getUserStatistics: async (): Promise<UserStatistics> => {
    const response = await api.get('/api/users/statistics')
    return response.data
  }
}
