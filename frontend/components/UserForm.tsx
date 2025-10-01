'use client'

import { useForm } from 'react-hook-form'
import { CreateUserRequest, User, UserStatus } from '@/types'

interface UserFormProps {
  user?: User
  onSubmit: (data: CreateUserRequest) => void
  isLoading?: boolean
}

export function UserForm({ user, onSubmit, isLoading }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserRequest>({
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      age: user.age || undefined,
      status: user.status,
    } : {
      status: UserStatus.ACTIVE,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          {...register('name', { required: 'Name is required' })}
          className="input"
          placeholder="Enter user name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          className="input"
          placeholder="Enter email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          {...register('phoneNumber')}
          className="input"
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          id="address"
          {...register('address')}
          className="input"
          rows={3}
          placeholder="Enter address"
        />
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
          Age
        </label>
        <input
          type="number"
          id="age"
          {...register('age', { 
            min: { value: 0, message: 'Age must be positive' },
            max: { value: 150, message: 'Age must be realistic' }
          })}
          className="input"
          placeholder="Enter age"
        />
        {errors.age && (
          <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
        )}
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
          <option value={UserStatus.ACTIVE}>Active</option>
          <option value={UserStatus.INACTIVE}>Inactive</option>
          <option value={UserStatus.SUSPENDED}>Suspended</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  )
}
