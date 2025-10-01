# Microservice Frontend Demo

A modern Next.js frontend application that demonstrates microservice communication and API integration.

## Features

- **Dashboard**: Real-time statistics and service monitoring
- **User Management**: Complete CRUD operations for users
- **Order Management**: Order processing with user integration
- **Service Communication Demo**: Interactive demonstration of microservice communication
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real-time Updates**: Live data fetching with React Query

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Data fetching and caching
- **React Hook Form**: Form handling
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend microservices running (see main README)

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

3. Update the API base URL in `.env.local` if needed:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   ├── users/             # User management pages
│   ├── orders/            # Order management pages
│   └── service-demo/      # Service communication demo
├── components/            # Reusable components
│   ├── UserForm.tsx       # User form component
│   ├── UserModal.tsx      # User modal component
│   ├── OrderForm.tsx      # Order form component
│   └── OrderModal.tsx     # Order modal component
├── lib/                   # Utility libraries
│   ├── api.ts            # Axios configuration
│   └── services/         # API service functions
│       ├── userService.ts
│       └── orderService.ts
├── types/                 # TypeScript type definitions
│   └── index.ts
└── public/               # Static assets
```

## API Integration

The frontend communicates with the microservice backend through:

- **API Gateway**: Central entry point (Port 8080)
- **User Service**: User management APIs
- **Order Service**: Order management APIs
- **Service Communication**: Order service calls User service via Feign Client

### Key Features

1. **Real-time Data**: Automatic refetching and caching
2. **Error Handling**: Comprehensive error states and fallbacks
3. **Loading States**: Smooth loading indicators
4. **Form Validation**: Client-side validation with error messages
5. **Responsive Design**: Works on all device sizes

## Pages

### Dashboard (`/`)
- Service statistics and monitoring
- Recent users and orders
- Service status indicators
- Quick navigation to management pages

### User Management (`/users`)
- View all users with pagination
- Create, edit, and delete users
- Search functionality
- User status management (activate/deactivate/suspend)
- Real-time updates

### Order Management (`/orders`)
- View all orders with pagination
- Create, edit, and delete orders
- Order status management
- Search and filtering
- Integration with user data

### Service Communication Demo (`/service-demo`)
- Interactive demonstration of microservice communication
- Real-time order details with user information
- Technical implementation details
- Service flow visualization

## API Services

### User Service
- `getUsers()`: Fetch all users
- `getUsersPaginated()`: Paginated user list
- `getUserById()`: Get user by ID
- `createUser()`: Create new user
- `updateUser()`: Update existing user
- `deleteUser()`: Delete user
- `searchUsersByName()`: Search users
- `activateUser()`: Activate user
- `deactivateUser()`: Deactivate user
- `suspendUser()`: Suspend user
- `getUserStatistics()`: Get user statistics

### Order Service
- `getOrders()`: Fetch all orders
- `getOrdersPaginated()`: Paginated order list
- `getOrderById()`: Get order with user details
- `createOrder()`: Create new order
- `updateOrder()`: Update existing order
- `deleteOrder()`: Delete order
- `getOrdersByUserId()`: Get orders for specific user
- `getOrdersByStatus()`: Filter orders by status
- `searchOrdersByProduct()`: Search orders
- `updateOrderStatus()`: Update order status
- `getOrdersWithUserDetails()`: Bulk order data with users
- `getOrderStatistics()`: Get order statistics

## Styling

The application uses Tailwind CSS with custom components:

- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- **Forms**: `.input` for form inputs
- **Cards**: `.card` for content containers
- **Tables**: `.table` for data tables

## Error Handling

- Network errors are caught and displayed to users
- Form validation provides immediate feedback
- Loading states prevent user confusion
- Fallback data when services are unavailable

## Performance

- React Query caching reduces API calls
- Pagination for large datasets
- Optimistic updates for better UX
- Lazy loading and code splitting

## Development Tips

1. **API Testing**: Use the service demo page to test communication
2. **Error Debugging**: Check browser console for detailed error logs
3. **Data Flow**: Monitor React Query DevTools for data fetching
4. **Responsive Design**: Test on different screen sizes

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend services are running
   - Check API Gateway configuration
   - Verify service discovery

2. **CORS Errors**
   - Check API Gateway CORS configuration
   - Verify request headers

3. **Service Communication Issues**
   - Check Eureka service registration
   - Verify Feign client configuration
   - Test individual service endpoints

### Debug Mode

Enable debug logging by adding to `.env.local`:
```
NEXT_PUBLIC_DEBUG=true
```

This will show detailed API request/response logs in the browser console.

## Contributing

1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Implement proper error handling
4. Add loading states for async operations
5. Test on multiple screen sizes

## License

This project is part of the microservice architecture demo.
