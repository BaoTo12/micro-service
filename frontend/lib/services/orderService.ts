import api from '../api'
import { 
  Order, 
  CreateOrderRequest, 
  UpdateOrderRequest, 
  OrderResponse, 
  OrderStatistics, 
  UserOrderStatistics, 
  PaginatedResponse,
  OrderStatus 
} from '@/types'

export const orderService = {
  // Get all orders
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get('/api/orders')
    return response.data
  },

  // Get orders with pagination
  getOrdersPaginated: async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: string = 'desc'
  ): Promise<PaginatedResponse<Order>> => {
    const response = await api.get('/api/orders/paginated', {
      params: { page, size, sortBy, sortDir }
    })
    return response.data
  },

  // Get order by ID with user details
  getOrderById: async (id: number): Promise<OrderResponse> => {
    const response = await api.get(`/api/orders/${id}`)
    return response.data
  },

  // Create order
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await api.post('/api/orders', orderData)
    return response.data
  },

  // Update order
  updateOrder: async (id: number, orderData: UpdateOrderRequest): Promise<Order> => {
    const response = await api.put(`/api/orders/${id}`, orderData)
    return response.data
  },

  // Delete order
  deleteOrder: async (id: number): Promise<void> => {
    await api.delete(`/api/orders/${id}`)
  },

  // Get orders by user ID
  getOrdersByUserId: async (userId: number): Promise<Order[]> => {
    const response = await api.get(`/api/orders/user/${userId}`)
    return response.data
  },

  // Get orders by user ID with pagination
  getOrdersByUserIdPaginated: async (
    userId: number,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDir: string = 'desc'
  ): Promise<PaginatedResponse<Order>> => {
    const response = await api.get(`/api/orders/user/${userId}/paginated`, {
      params: { page, size, sortBy, sortDir }
    })
    return response.data
  },

  // Get orders by status
  getOrdersByStatus: async (status: OrderStatus): Promise<Order[]> => {
    const response = await api.get(`/api/orders/status/${status}`)
    return response.data
  },

  // Get orders by status with pagination
  getOrdersByStatusPaginated: async (
    status: OrderStatus,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDir: string = 'desc'
  ): Promise<PaginatedResponse<Order>> => {
    const response = await api.get(`/api/orders/status/${status}/paginated`, {
      params: { page, size, sortBy, sortDir }
    })
    return response.data
  },

  // Search orders by product
  searchOrdersByProduct: async (product: string): Promise<Order[]> => {
    const response = await api.get('/api/orders/search/product', {
      params: { product }
    })
    return response.data
  },

  // Get orders by price range
  getOrdersByPriceRange: async (minPrice: number, maxPrice: number): Promise<Order[]> => {
    const response = await api.get('/api/orders/price-range', {
      params: { minPrice, maxPrice }
    })
    return response.data
  },

  // Get orders by date range
  getOrdersByDateRange: async (startDate: string, endDate: string): Promise<Order[]> => {
    const response = await api.get('/api/orders/date-range', {
      params: { startDate, endDate }
    })
    return response.data
  },

  // Update order status
  updateOrderStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    const response = await api.patch(`/api/orders/${id}/status`, null, {
      params: { status }
    })
    return response.data
  },

  // Get orders with user details (bulk)
  getOrdersWithUserDetails: async (
    page: number = 0,
    size: number = 10
  ): Promise<OrderResponse[]> => {
    const response = await api.get('/api/orders/with-users', {
      params: { page, size }
    })
    return response.data
  },

  // Get order statistics
  getOrderStatistics: async (): Promise<OrderStatistics> => {
    const response = await api.get('/api/orders/statistics')
    return response.data
  },

  // Get user order statistics
  getUserOrderStatistics: async (userId: number): Promise<UserOrderStatistics> => {
    const response = await api.get(`/api/orders/user/${userId}/statistics`)
    return response.data
  }
}
