package com.example.microservice.order_service.controller;

import com.example.microservice.order_service.UserClient;
import com.example.microservice.order_service.UserDto;
import com.example.microservice.order_service.model.Order;
import com.example.microservice.order_service.model.OrderResponse;
import com.example.microservice.order_service.repository.OrderRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderRepository orderRepository;
    private final UserClient userClient;

    // Create Order
    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody Order order) {
        Order savedOrder = orderRepository.save(order);
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
    }

    // Get Order by ID with User Details
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        // Call User Service by Feign Client
        UserDto user = userClient.getUserById(order.getUserId());
        
        OrderResponse orderResponse = OrderResponse.builder()
                .orderId(order.getId())
                .product(order.getProduct())
                .price(order.getPrice())
                .quantity(order.getQuantity())
                .status(order.getStatus())
                .description(order.getDescription())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .user(user)
                .build();
        
        return ResponseEntity.ok(orderResponse);
    }

    // Get All Orders
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return ResponseEntity.ok(orders);
    }

    // Get All Orders with Pagination
    @GetMapping("/paginated")
    public ResponseEntity<Page<Order>> getAllOrdersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Order> orders = orderRepository.findAll(pageable);
        return ResponseEntity.ok(orders);
    }

    // Get Orders by User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    // Get Orders by User ID with Pagination
    @GetMapping("/user/{userId}/paginated")
    public ResponseEntity<Page<Order>> getOrdersByUserIdPaginated(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Order> orders = orderRepository.findByUserId(userId, pageable);
        return ResponseEntity.ok(orders);
    }

    // Get Orders by Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
        List<Order> orders = orderRepository.findByStatus(status);
        return ResponseEntity.ok(orders);
    }

    // Get Orders by Status with Pagination
    @GetMapping("/status/{status}/paginated")
    public ResponseEntity<Page<Order>> getOrdersByStatusPaginated(
            @PathVariable Order.OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Order> orders = orderRepository.findByStatus(status, pageable);
        return ResponseEntity.ok(orders);
    }

    // Search Orders by Product
    @GetMapping("/search/product")
    public ResponseEntity<List<Order>> searchOrdersByProduct(@RequestParam String product) {
        List<Order> orders = orderRepository.findByProductContainingIgnoreCase(product);
        return ResponseEntity.ok(orders);
    }

    // Get Orders by Price Range
    @GetMapping("/price-range")
    public ResponseEntity<List<Order>> getOrdersByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {
        List<Order> orders = orderRepository.findByPriceBetween(minPrice, maxPrice);
        return ResponseEntity.ok(orders);
    }

    // Get Orders by Date Range
    @GetMapping("/date-range")
    public ResponseEntity<List<Order>> getOrdersByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);
        return ResponseEntity.ok(orders);
    }

    // Get Orders by User ID and Status
    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByUserIdAndStatus(
            @PathVariable Long userId,
            @PathVariable Order.OrderStatus status) {
        List<Order> orders = orderRepository.findByUserIdAndStatus(userId, status);
        return ResponseEntity.ok(orders);
    }

    // Update Order Status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam Order.OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return ResponseEntity.ok(updatedOrder);
    }

    // Update Order
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @Valid @RequestBody Order orderDetails) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        order.setProduct(orderDetails.getProduct());
        order.setPrice(orderDetails.getPrice());
        order.setQuantity(orderDetails.getQuantity());
        order.setStatus(orderDetails.getStatus());
        order.setDescription(orderDetails.getDescription());
        
        Order updatedOrder = orderRepository.save(order);
        return ResponseEntity.ok(updatedOrder);
    }

    // Delete Order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Get Order Statistics
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getOrderStatistics() {
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        long confirmedOrders = orderRepository.countByStatus(Order.OrderStatus.CONFIRMED);
        long shippedOrders = orderRepository.countByStatus(Order.OrderStatus.SHIPPED);
        long deliveredOrders = orderRepository.countByStatus(Order.OrderStatus.DELIVERED);
        long cancelledOrders = orderRepository.countByStatus(Order.OrderStatus.CANCELLED);
        
        Map<String, Object> statistics = Map.of(
            "totalOrders", totalOrders,
            "pendingOrders", pendingOrders,
            "confirmedOrders", confirmedOrders,
            "shippedOrders", shippedOrders,
            "deliveredOrders", deliveredOrders,
            "cancelledOrders", cancelledOrders
        );
        
        return ResponseEntity.ok(statistics);
    }

    // Get User Order Statistics
    @GetMapping("/user/{userId}/statistics")
    public ResponseEntity<Map<String, Object>> getUserOrderStatistics(@PathVariable Long userId) {
        long totalOrders = orderRepository.countByUserId(userId);
        Double totalValue = orderRepository.getTotalOrderValueByUserId(userId);
        
        Map<String, Object> statistics = Map.of(
            "userId", userId,
            "totalOrders", totalOrders,
            "totalOrderValue", totalValue != null ? totalValue : 0.0
        );
        
        return ResponseEntity.ok(statistics);
    }

    // Get Orders with User Details (Bulk)
    @GetMapping("/with-users")
    public ResponseEntity<List<OrderResponse>> getOrdersWithUserDetails(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findAll(pageable);
        
        List<OrderResponse> orderResponses = orders.getContent().stream()
                .map(order -> {
                    UserDto user = userClient.getUserById(order.getUserId());
                    return OrderResponse.builder()
                            .orderId(order.getId())
                            .product(order.getProduct())
                            .price(order.getPrice())
                            .quantity(order.getQuantity())
                            .status(order.getStatus())
                            .description(order.getDescription())
                            .createdAt(order.getCreatedAt())
                            .updatedAt(order.getUpdatedAt())
                            .user(user)
                            .build();
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(orderResponses);
    }
}
