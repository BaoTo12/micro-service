'use client'

import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Activity,
  UserCheck,
  UserX,
  Package,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { userService } from '@/lib/services/userService'
import { orderService } from '@/lib/services/orderService'
import { UserStatistics, OrderStatistics } from '@/types'
import Link from 'next/link'

export default function Dashboard() {
  const [userStats, setUserStats] = useState<UserStatistics | null>(null)
  const [orderStats, setOrderStats] = useState<OrderStatistics | null>(null)

  const { data: users, isLoading: usersLoading } = useQuery(
    'users',
    userService.getUsers,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  )

  const { data: orders, isLoading: ordersLoading } = useQuery(
    'orders',
    orderService.getOrders,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  )

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userStatsData, orderStatsData] = await Promise.all([
          userService.getUserStatistics(),
          orderService.getOrderStatistics()
        ])
        setUserStats(userStatsData)
        setOrderStats(orderStatsData)
      } catch (error) {
        console.error('Error fetching statistics:', error)
      }
    }

    fetchStats()
  }, [])

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'blue',
    subtitle 
  }: {
    title: string
    value: number | string
    icon: any
    color?: string
    subtitle?: string
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500'
    }

    return (
      <div className="card p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Microservice Dashboard</h1>
              <p className="text-gray-600">Monitor your microservice architecture</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/users" className="btn btn-primary">
                Manage Users
              </Link>
              <Link href="/orders" className="btn btn-secondary">
                Manage Orders
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={userStats?.totalUsers || 0}
            icon={Users}
            color="blue"
            subtitle="Registered users"
          />
          <StatCard
            title="Active Users"
            value={userStats?.activeUsers || 0}
            icon={UserCheck}
            color="green"
            subtitle="Currently active"
          />
          <StatCard
            title="Total Orders"
            value={orderStats?.totalOrders || 0}
            icon={ShoppingCart}
            color="purple"
            subtitle="All time orders"
          />
          <StatCard
            title="Pending Orders"
            value={orderStats?.pendingOrders || 0}
            icon={Clock}
            color="yellow"
            subtitle="Awaiting processing"
          />
        </div>

        {/* Order Status Breakdown */}
        {orderStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              title="Confirmed"
              value={orderStats.confirmedOrders}
              icon={CheckCircle}
              color="green"
            />
            <StatCard
              title="Shipped"
              value={orderStats.shippedOrders}
              icon={Package}
              color="blue"
            />
            <StatCard
              title="Delivered"
              value={orderStats.deliveredOrders}
              icon={TrendingUp}
              color="indigo"
            />
            <StatCard
              title="Cancelled"
              value={orderStats.cancelledOrders}
              icon={XCircle}
              color="red"
            />
            <StatCard
              title="Inactive Users"
              value={userStats?.inactiveUsers || 0}
              icon={UserX}
              color="yellow"
            />
          </div>
        )}

        {/* Recent Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
              <Link href="/users" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>
            {usersLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {users?.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : user.status === 'INACTIVE'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                ))}
                {(!users || users.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No users found</p>
                )}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <Link href="/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>
            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {orders?.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{order.product}</p>
                      <p className="text-sm text-gray-500">User ID: {order.userId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${order.price}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
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
                ))}
                {(!orders || orders.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No orders found</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Service Status */}
        <div className="mt-8 card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-500 rounded-lg">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">API Gateway</p>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-500 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">User Service</p>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-500 rounded-lg">
                <ShoppingCart className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Order Service</p>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-500 rounded-lg">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Discovery Server</p>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
