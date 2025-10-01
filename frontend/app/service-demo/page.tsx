'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import { ArrowRight, Users, ShoppingCart, Activity, AlertCircle } from 'lucide-react'
import { orderService } from '@/lib/services/orderService'
import { userService } from '@/lib/services/userService'
import { OrderResponse } from '@/types'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ServiceDemoPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  const { data: ordersWithUsers, isLoading: ordersLoading, error: ordersError } = useQuery(
    'orders-with-users',
    () => orderService.getOrdersWithUserDetails(0, 10),
    {
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  )

  const { data: selectedOrderDetails, isLoading: orderDetailsLoading } = useQuery(
    ['order-details', selectedOrderId],
    () => orderService.getOrderById(selectedOrderId!),
    {
      enabled: !!selectedOrderId,
    }
  )

  const { data: userStats } = useQuery('user-stats', userService.getUserStatistics)
  const { data: orderStats } = useQuery('order-stats', orderService.getOrderStatistics)

  const handleOrderClick = (orderId: number) => {
    setSelectedOrderId(orderId)
    toast.success('Fetching order details with user information...')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Communication Demo</h1>
              <p className="text-gray-600">Demonstrating microservice communication between Order and User services</p>
            </div>
            <Link href="/" className="btn btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Communication Flow */}
        <div className="mb-8">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Communication Flow</h2>
            <div className="flex items-center justify-center space-x-4 p-6 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="p-3 bg-blue-500 rounded-lg mb-2">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium">User Service</p>
                <p className="text-xs text-gray-500">Port 8081</p>
              </div>
              
              <ArrowRight className="h-6 w-6 text-gray-400" />
              
              <div className="text-center">
                <div className="p-3 bg-purple-500 rounded-lg mb-2">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium">Order Service</p>
                <p className="text-xs text-gray-500">Port 8082</p>
              </div>
              
              <ArrowRight className="h-6 w-6 text-gray-400" />
              
              <div className="text-center">
                <div className="p-3 bg-green-500 rounded-lg mb-2">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium">API Gateway</p>
                <p className="text-xs text-gray-500">Port 8080</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Order Service calls User Service via Feign Client to get user details for each order
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{userStats?.totalUsers || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">{userStats?.activeUsers || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{orderStats?.totalOrders || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{orderStats?.pendingOrders || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Orders with User Details */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Orders with User Details (Service Communication)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Click on an order to see detailed information fetched from both services
            </p>
            
            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : ordersError ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">Failed to load orders</p>
                  <p className="text-sm text-gray-500">Check if backend services are running</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {ordersWithUsers?.map((order) => (
                  <div
                    key={order.orderId}
                    onClick={() => handleOrderClick(order.orderId)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOrderId === order.orderId
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{order.product}</h3>
                        <p className="text-sm text-gray-500">Order #{order.orderId}</p>
                        <p className="text-sm text-gray-500">User: {order.user.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${order.price.toFixed(2)}</p>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'PENDING' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : order.status === 'CONFIRMED'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'SHIPPED'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {(!ordersWithUsers || ordersWithUsers.length === 0) && (
                  <p className="text-gray-500 text-center py-8">No orders found</p>
                )}
              </div>
            )}
          </div>

          {/* Selected Order Details */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Details (Service Communication Result)
            </h2>
            
            {!selectedOrderId ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select an order to view details</p>
                <p className="text-sm text-gray-400">This will demonstrate service communication</p>
              </div>
            ) : orderDetailsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : selectedOrderDetails ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{selectedOrderDetails.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product:</span>
                      <span className="font-medium">{selectedOrderDetails.product}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">${selectedOrderDetails.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">{selectedOrderDetails.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedOrderDetails.status === 'PENDING' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : selectedOrderDetails.status === 'CONFIRMED'
                          ? 'bg-blue-100 text-blue-800'
                          : selectedOrderDetails.status === 'SHIPPED'
                          ? 'bg-purple-100 text-purple-800'
                          : selectedOrderDetails.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedOrderDetails.status}
                      </span>
                    </div>
                    {selectedOrderDetails.description && (
                      <div>
                        <span className="text-gray-600">Description:</span>
                        <p className="font-medium">{selectedOrderDetails.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">User Information (from User Service)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">User ID:</span>
                      <span className="font-medium">{selectedOrderDetails.user.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedOrderDetails.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedOrderDetails.user.email}</span>
                    </div>
                    {selectedOrderDetails.user.phoneNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedOrderDetails.user.phoneNumber}</span>
                      </div>
                    )}
                    {selectedOrderDetails.user.age && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">{selectedOrderDetails.user.age}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedOrderDetails.user.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : selectedOrderDetails.user.status === 'INACTIVE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedOrderDetails.user.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Service Communication Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">API Call:</span>
                      <span className="font-medium">GET /api/orders/{selectedOrderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Service:</span>
                      <span className="font-medium">Fetches order data</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">User Service Call:</span>
                      <span className="font-medium">GET /api/users/{selectedOrderDetails.user.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Communication:</span>
                      <span className="font-medium">Feign Client</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Result:</span>
                      <span className="font-medium">Combined response</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">Failed to load order details</p>
              </div>
            )}
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-8 card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Feign Client Configuration</h3>
              <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
                <div>@FeignClient(name = "user-service")</div>
                <div>public interface UserClient {`{`}</div>
                <div className="ml-4">@GetMapping("/api/users/{id}")</div>
                <div className="ml-4">UserDto getUserById(@PathVariable Long id);</div>
                <div>{`}`}</div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Service Discovery</h3>
              <div className="bg-gray-100 p-4 rounded-lg text-sm">
                <div>• Eureka Server (Port 8761)</div>
                <div>• Service Registration</div>
                <div>• Load Balancing</div>
                <div>• Health Checks</div>
                <div>• Fallback Mechanisms</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
