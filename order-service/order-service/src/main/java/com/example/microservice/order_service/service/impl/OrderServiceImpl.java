package com.example.microservice.order_service.service.impl;

import com.example.microservice.order_service.mapper.OrderMapper;
import com.example.microservice.order_service.model.Order;
import com.example.microservice.order_service.model.OrderResponse;
import com.example.microservice.order_service.repository.OrderRepository;
import com.example.microservice.order_service.service.OrderService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    OrderRepository orderRepository;
    OrderMapper orderMapper;

    @Override
    public OrderResponse createOrder(Order order) {
        Order saveOrder = orderRepository.save(order);
        return orderMapper.toOrderResponse(saveOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isEmpty())
            throw new EntityNotFoundException("Cannot find order with id: " + id);
        return orderMapper.toOrderResponse(optionalOrder.get());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUserId(Long id) {
        List<Order> orders = orderRepository.findByUserId(id).orElse(Collections.emptyList());
        return orders.stream().map(orderMapper::toOrderResponse).toList();
    }

    @Override
    public OrderResponse updateOrderStatus(Long id, Order.OrderStatus orderStatus) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isEmpty())
            throw new EntityNotFoundException("Cannot find order with id: " + id);
        Order order = optionalOrder.get();
        order.setStatus(orderStatus);

        return orderMapper.toOrderResponse(orderRepository.save(order));
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
