export interface User {
  id: number
  name: string
  email: string
  phoneNumber?: string
  address?: string
  age?: number
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface CreateUserRequest {
  name: string
  email: string
  phoneNumber?: string
  address?: string
  age?: number
  status?: UserStatus
}

export interface UpdateUserRequest extends CreateUserRequest {}

export interface Order {
  id: number
  userId: number
  product: string
  price: number
  quantity: number
  status: OrderStatus
  description?: string
  createdAt: string
  updatedAt: string
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface CreateOrderRequest {
  userId: number
  product: string
  price: number
  quantity?: number
  description?: string
  status?: OrderStatus
}

export interface UpdateOrderRequest extends CreateOrderRequest {}

export interface OrderResponse {
  orderId: number
  product: string
  price: number
  quantity: number
  status: OrderStatus
  description?: string
  createdAt: string
  updatedAt: string
  user: User
}

export interface UserStatistics {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  suspendedUsers: number
}

export interface OrderStatistics {
  totalOrders: number
  pendingOrders: number
  confirmedOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
}

export interface UserOrderStatistics {
  userId: number
  totalOrders: number
  totalOrderValue: number
}

export interface PaginatedResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      unsorted: boolean
    }
  }
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  numberOfElements: number
}
