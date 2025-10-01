package com.example.microservice.order_service.service;

import com.example.microservice.order_service.model.Order;
import com.example.microservice.order_service.model.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(Order order);
    OrderResponse getOrderById(Long id);
    List<OrderResponse> getOrdersByUserId(Long id);
    OrderResponse updateOrderStatus(Long id, Order.OrderStatus orderStatus);
    void deleteOrder(Long id);
}
