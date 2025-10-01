'use client'

import { useForm } from 'react-hook-form'
import { CreateOrderRequest, Order, OrderStatus } from '@/types'

interface OrderFormProps {
  order?: Order
  onSubmit: (data: CreateOrderRequest) => void
  isLoading?: boolean
}

export function OrderForm({ order, onSubmit, isLoading }: OrderFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrderRequest>({
    defaultValues: order ? {
      userId: order.userId,
      product: order.product,
      price: order.price,
      quantity: order.quantity,
      description: order.description || '',
      status: order.status,
    } : {
      quantity: 1,
      status: OrderStatus.PENDING,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
          User ID *
        </label>
        <input
          type="number"
          id="userId"
          {...register('userId', { 
            required: 'User ID is required',
            min: { value: 1, message: 'User ID must be positive' }
          })}
          className="input"
          placeholder="Enter user ID"
        />
        {errors.userId && (
          <p className="mt-1 text-sm text-red-600">{errors.userId.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
          Product *
        </label>
        <input
          type="text"
          id="product"
          {...register('product', { required: 'Product is required' })}
          className="input"
          placeholder="Enter product name"
        />
        {errors.product && (
          <p className="mt-1 text-sm text-red-600">{errors.product.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Price *
        </label>
        <input
          type="number"
          step="0.01"
          id="price"
          {...register('price', { 
            required: 'Price is required',
            min: { value: 0.01, message: 'Price must be greater than 0' }
          })}
          className="input"
          placeholder="Enter price"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          {...register('quantity', { 
            min: { value: 1, message: 'Quantity must be at least 1' }
          })}
          className="input"
          placeholder="Enter quantity"
        />
        {errors.quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          className="input"
          rows={3}
          placeholder="Enter product description"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="input"
        >
          <option value={OrderStatus.PENDING}>Pending</option>
          <option value={OrderStatus.CONFIRMED}>Confirmed</option>
          <option value={OrderStatus.SHIPPED}>Shipped</option>
          <option value={OrderStatus.DELIVERED}>Delivered</option>
          <option value={OrderStatus.CANCELLED}>Cancelled</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : order ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  )
}
