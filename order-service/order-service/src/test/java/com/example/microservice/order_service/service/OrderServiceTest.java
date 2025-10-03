package com.example.microservice.order_service.service;


import com.example.microservice.order_service.dto.UserDto;
import com.example.microservice.order_service.event.OrderPlacedEvent;
import com.example.microservice.order_service.mapper.OrderMapper;
import com.example.microservice.order_service.model.Order;
import com.example.microservice.order_service.model.Order.OrderStatus;
import com.example.microservice.order_service.model.OrderResponse;
import com.example.microservice.order_service.open_feign.UserClient;
import com.example.microservice.order_service.repository.OrderRepository;
import com.example.microservice.order_service.service.impl.OrderServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderMapper orderMapper;

    @Mock
    private KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;

    @Mock
    private UserClient userClient;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Order inputOrder;
    private Order savedOrder;
    private OrderResponse orderResponse;
    private UserDto userDto;

    @BeforeEach
    void setUp() {
        inputOrder = Order.builder()
                .id(null)            // new order (not persisted)
                .userId(100L)
                .product("Laptop")
                .price(1200.0)
                .status(OrderStatus.PENDING)
                .total(1200.0)
                .build();

        savedOrder = Order.builder()
                .id(1L)
                .userId(100L)
                .product("Laptop")
                .price(1200.0)
                .status(OrderStatus.PENDING)
                .total(1200.0)
                .build();

        orderResponse = OrderResponse.builder()
                .orderId(1L)
                .product("Laptop")
                .price(1200.0)
                .quantity(1)
                .status(OrderStatus.PENDING)
                .description("Created")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .user(null)
                .build();

        userDto = UserDto.builder()
                .id(100L)
                .email("user@example.com")
                .name("User One")
                .build();
    }

    // ===================== createOrder =====================
    @Test
    void When_CreateOrderWithValidData_Expect_ReturnOrderResponseAndSendEvent() {
        // Arrange
        Mockito.when(userClient.getUserById(inputOrder.getUserId())).thenReturn(userDto);
        Mockito.when(orderRepository.save(ArgumentMatchers.any(Order.class))).thenReturn(savedOrder);
        Mockito.when(orderMapper.toOrderResponse(savedOrder)).thenReturn(orderResponse);

        // Mock kafka send - let Mockito infer the return type
        Mockito.when(kafkaTemplate.send(ArgumentMatchers.anyString(), ArgumentMatchers.any()))
                .thenAnswer(invocation -> CompletableFuture.completedFuture(null));

        // Act
        OrderResponse result = orderService.createOrder(inputOrder);

        // Assert
        assertNotNull(result);
        assertEquals(orderResponse, result);
        Mockito.verify(userClient, Mockito.times(1)).getUserById(inputOrder.getUserId());
        Mockito.verify(orderRepository, Mockito.times(1)).save(ArgumentMatchers.any(Order.class));
        Mockito.verify(kafkaTemplate, Mockito.times(1)).send(ArgumentMatchers.anyString(), ArgumentMatchers.any());
        Mockito.verify(orderMapper, Mockito.times(1)).toOrderResponse(savedOrder);
    }

    // ===================== getOrderById (found) =====================
    @Test
    void When_GetOrderById_OrderExists_Expect_ReturnOrderResponse() {
        // TODO: Arrange
        Mockito.when(orderRepository.findById(1L)).thenReturn(Optional.of(savedOrder));
        Mockito.when(orderMapper.toOrderResponse(savedOrder)).thenReturn(orderResponse);

        // TODO: Act
        OrderResponse result = orderService.getOrderById(1L);

        // TODO: Assert
        assertNotNull(result);
        assertEquals(orderResponse, result);
        Mockito.verify(orderRepository, Mockito.times(1)).findById(1L);
        Mockito.verify(orderMapper, Mockito.times(1)).toOrderResponse(savedOrder);
    }

    // ===================== getOrderById (not found) =====================
    @Test
    void When_GetOrderById_OrderNotFound_Expect_ThrowEntityNotFoundException() {
        // TODO: Arrange
        Mockito.when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        // TODO: Act & Assert
        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class, () -> orderService.getOrderById(999L));

        // TODO: Assert (additional)
        assertTrue(ex.getMessage().contains("Cannot find order"));
        Mockito.verify(orderRepository, Mockito.times(1)).findById(999L);
        Mockito.verifyNoInteractions(orderMapper);
    }

    // ===================== getOrdersByUserId (found) =====================
    @Test
    void When_GetOrdersByUserId_WithExistingOrders_Expect_ReturnListOfResponses() {
        // TODO: Arrange
        Order other = Order.builder()
                .id(2L)
                .userId(savedOrder.getUserId())
                .product("Mouse")
                .price(25.0)
                .status(OrderStatus.PENDING)
                .total(25.0)
                .build();

        List<Order> orders = List.of(savedOrder, other);
        OrderResponse r1 = orderResponse;
        OrderResponse r2 = OrderResponse.builder()
                .orderId(2L)
                .product("Mouse")
                .price(25.0)
                .quantity(1)
                .status(OrderStatus.PENDING)
                .description("Created")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .user(null)
                .build();

        Mockito.when(orderRepository.findByUserId(100L)).thenReturn(Optional.of(orders));
        Mockito.when(orderMapper.toOrderResponse(savedOrder)).thenReturn(r1);
        Mockito.when(orderMapper.toOrderResponse(other)).thenReturn(r2);

        // TODO: Act
        List<OrderResponse> result = orderService.getOrdersByUserId(100L);

        // TODO: Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(r1, result.get(0));
        assertEquals(r2, result.get(1));
        Mockito.verify(orderRepository, Mockito.times(1)).findByUserId(100L);
    }

    @Test
    void When_GetOrdersByUserId_NoOrders_Expect_ReturnEmptyList() {
        // TODO: Arrange
        Mockito.when(orderRepository.findByUserId(200L)).thenReturn(Optional.empty());

        // TODO: Act
        List<OrderResponse> result = orderService.getOrdersByUserId(200L);

        // TODO: Assert
        assertNotNull(result);
        assertEquals(0, result.size());
        Mockito.verify(orderRepository, Mockito.times(1)).findByUserId(200L);
        Mockito.verifyNoInteractions(orderMapper);
    }

    @Test
    void When_UpdateOrderStatus_OrderExists_Expect_ReturnUpdatedOrder() {
        // TODO: Arrange
        Order orderToUpdate = Order.builder()
                .id(1L)
                .userId(100L)
                .product("Laptop")
                .price(1200.0)
                .status(OrderStatus.PENDING)
                .total(1200.0)
                .build();

        Order updatedOrder = Order.builder()
                .id(1L)
                .userId(100L)
                .product("Laptop")
                .price(1200.0)
                .status(OrderStatus.SHIPPED)
                .total(1200.0)
                .build();

        OrderResponse updatedResponse = OrderResponse.builder()
                .orderId(1L)
                .product("Laptop")
                .price(1200.0)
                .quantity(1)
                .status(OrderStatus.SHIPPED)
                .description("Shipped")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .user(null)
                .build();

        Mockito.when(orderRepository.findById(1L)).thenReturn(Optional.of(orderToUpdate));
        Mockito.when(orderRepository.save(ArgumentMatchers.any(Order.class))).thenReturn(updatedOrder);
        Mockito.when(orderMapper.toOrderResponse(updatedOrder)).thenReturn(updatedResponse);

        // TODO: Act
        OrderResponse result = orderService.updateOrderStatus(1L, OrderStatus.SHIPPED);

        // TODO: Assert
        assertNotNull(result);
        assertEquals(OrderStatus.SHIPPED, result.getStatus());
        assertEquals(updatedResponse, result);
        Mockito.verify(orderRepository, Mockito.times(1)).findById(1L);
        Mockito.verify(orderRepository, Mockito.times(1)).save(ArgumentMatchers.any(Order.class));
    }

    @Test
    void When_UpdateOrderStatus_OrderNotFound_Expect_ThrowEntityNotFoundException() {
        // TODO: Arrange
        Mockito.when(orderRepository.findById(555L)).thenReturn(Optional.empty());

        // TODO: Act & Assert
        assertThrows(EntityNotFoundException.class, () -> orderService.updateOrderStatus(555L, OrderStatus.CONFIRMED));

        // TODO: Assert (additional)
        Mockito.verify(orderRepository, Mockito.times(1)).findById(555L);
        Mockito.verify(orderRepository, Mockito.never()).save(ArgumentMatchers.any());
    }

    @Test
    void When_DeleteOrder_Expect_RepositoryDeleteInvoked() {
        // TODO: Arrange
        Mockito.doNothing().when(orderRepository).deleteById(1L);

        // TODO: Act
        orderService.deleteOrder(1L);

        // TODO: Assert
        Mockito.verify(orderRepository, Mockito.times(1)).deleteById(1L);
    }
}