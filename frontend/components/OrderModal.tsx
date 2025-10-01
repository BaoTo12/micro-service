'use client'

import { X } from 'lucide-react'
import { CreateOrderRequest, Order } from '@/types'
import { OrderForm } from './OrderForm'

interface OrderModalProps {
  title: string
  order?: Order
  onClose: () => void
  onSubmit: (data: CreateOrderRequest) => void
  isLoading?: boolean
}

export function OrderModal({ title, order, onClose, onSubmit, isLoading }: OrderModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <OrderForm
            order={order}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
