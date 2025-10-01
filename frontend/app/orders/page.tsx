'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Plus, Search, Edit, Trash2, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react'
import { orderService } from '@/lib/services/orderService'
import { Order, CreateOrderRequest, OrderStatus } from '@/types'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { OrderForm } from '@/components/OrderForm'
import { OrderModal } from '@/components/OrderModal'
import { format } from 'date-fns'

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL')

  const queryClient = useQueryClient()

  const { data: ordersData, isLoading, error } = useQuery(
    ['orders', currentPage, pageSize, statusFilter],
    () => {
      if (statusFilter === 'ALL') {
        return orderService.getOrdersPaginated(currentPage, pageSize, 'createdAt', 'desc')
      } else {
        return orderService.getOrdersByStatusPaginated(statusFilter, currentPage, pageSize, 'createdAt', 'desc')
      }
    },
    {
      keepPreviousData: true,
    }
  )

  const { data: searchResults } = useQuery(
    ['orders-search', searchTerm],
    () => orderService.searchOrdersByProduct(searchTerm),
    {
      enabled: searchTerm.length > 2,
    }
  )

  const createOrderMutation = useMutation(orderService.createOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries('orders')
      setShowCreateModal(false)
      toast.success('Order created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create order')
    },
  })

  const updateOrderMutation = useMutation(
    ({ id, data }: { id: number; data: any }) => orderService.updateOrder(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders')
        setEditingOrder(null)
        toast.success('Order updated successfully!')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update order')
      },
    }
  )

  const deleteOrderMutation = useMutation(orderService.deleteOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries('orders')
      toast.success('Order deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete order')
    },
  })

  const statusUpdateMutation = useMutation(
    ({ id, status }: { id: number; status: OrderStatus }) => orderService.updateOrderStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders')
        toast.success('Order status updated successfully!')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update order status')
      },
    }
  )

  const handleCreateOrder = (orderData: CreateOrderRequest) => {
    createOrderMutation.mutate(orderData)
  }

  const handleUpdateOrder = (orderData: CreateOrderRequest) => {
    if (editingOrder) {
      updateOrderMutation.mutate({ id: editingOrder.id, data: orderData })
    }
  }

  const handleDeleteOrder = (id: number) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrderMutation.mutate(id)
    }
  }

  const handleStatusUpdate = (id: number, status: OrderStatus) => {
    statusUpdateMutation.mutate({ id, status })
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case OrderStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800'
      case OrderStatus.SHIPPED:
        return 'bg-purple-100 text-purple-800'
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800'
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="h-4 w-4" />
      case OrderStatus.CONFIRMED:
        return <CheckCircle className="h-4 w-4" />
      case OrderStatus.SHIPPED:
        return <Truck className="h-4 w-4" />
      case OrderStatus.DELIVERED:
        return <Package className="h-4 w-4" />
      case OrderStatus.CANCELLED:
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const displayOrders = searchTerm.length > 2 ? searchResults : ordersData?.content || []

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Orders</h2>
          <p className="text-gray-600 mb-4">Failed to load orders. Please check if the backend services are running.</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600">Manage orders in your system</p>
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
                Add Order
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
              className="input"
            >
              <option value="ALL">All Status</option>
              <option value={OrderStatus.PENDING}>Pending</option>
              <option value={OrderStatus.CONFIRMED}>Confirmed</option>
              <option value={OrderStatus.SHIPPED}>Shipped</option>
              <option value={OrderStatus.DELIVERED}>Delivered</option>
              <option value={OrderStatus.CANCELLED}>Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
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
                      <th>Product</th>
                      <th>User ID</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <div>
                            <div className="font-medium text-gray-900">{order.product}</div>
                            {order.description && (
                              <div className="text-sm text-gray-500">{order.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="text-gray-900">{order.userId}</td>
                        <td className="text-gray-900">${order.price.toFixed(2)}</td>
                        <td className="text-gray-900">{order.quantity}</td>
                        <td>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </span>
                        </td>
                        <td className="text-gray-500">
                          {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingOrder(order)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Edit order"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                              title="Update status"
                            >
                              <option value={OrderStatus.PENDING}>Pending</option>
                              <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                              <option value={OrderStatus.SHIPPED}>Shipped</option>
                              <option value={OrderStatus.DELIVERED}>Delivered</option>
                              <option value={OrderStatus.CANCELLED}>Cancelled</option>
                            </select>
                            
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1 text-red-400 hover:text-red-600"
                              title="Delete order"
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
              {ordersData && !searchTerm && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {ordersData.numberOfElements} of {ordersData.totalElements} orders
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={ordersData.first}
                        className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-700">
                        Page {ordersData.pageable.pageNumber + 1} of {ordersData.totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={ordersData.last}
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
        <OrderModal
          title="Create Order"
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateOrder}
          isLoading={createOrderMutation.isLoading}
        />
      )}

      {editingOrder && (
        <OrderModal
          title="Edit Order"
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSubmit={handleUpdateOrder}
          isLoading={updateOrderMutation.isLoading}
        />
      )}
    </div>
  )
}
