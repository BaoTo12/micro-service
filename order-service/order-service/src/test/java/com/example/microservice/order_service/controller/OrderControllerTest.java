package com.example.microservice.order_service.controller;

import com.example.microservice.order_service.model.Order;
import com.example.microservice.order_service.model.OrderResponse;
import com.example.microservice.order_service.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDateTime;
import java.util.List;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OrderService orderService;

    @Autowired
    private ObjectMapper objectMapper;

    private Order testOrder;
    private OrderResponse testResponse;

    @BeforeEach
    void setUp() {
        testOrder = Order.builder()
                .id(1L)
                .userId(100L)
                .product("Laptop")
                .price(1200.0)
                .status(Order.OrderStatus.PENDING)
                .total(1200.0)
                .build();

        testResponse = OrderResponse.builder()
                .orderId(1L)
                .product("Laptop")
                .price(1200.0)
                .quantity(1)
                .status(Order.OrderStatus.PENDING)
                .description("Order placed successfully")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .user(null) // could add a UserDto later if needed
                .build();
    }

    @Test
    void When_CreateOrderWithValidData_Expect_ReturnCreatedOrder() throws Exception {
        // TODO Arrange
        Mockito.when(orderService.createOrder(Mockito.any(Order.class))).thenReturn(testResponse);

        // TODO Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testOrder)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.orderId").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.product").value("Laptop"));
    }

    @Test
    void When_GetOrderById_Expect_ReturnOrderResponse() throws Exception {
        // TODO Arrange
        Mockito.when(orderService.getOrderById(1L)).thenReturn(testResponse);

        // TODO Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.get("/api/orders/{id}", 1L))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.orderId").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.product").value("Laptop"));
    }

    @Test
    void When_GetOrdersByUserId_Expect_ReturnListOfOrders() throws Exception {
        // TODO Arrange
        List<OrderResponse> responses = List.of(testResponse);
        Mockito.when(orderService.getOrdersByUserId(100L)).thenReturn(responses);

        // TODO Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.get("/api/orders/user/{userId}", 100L))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].product").value("Laptop"));
    }

    @Test
    void When_UpdateOrderStatus_Expect_ReturnUpdatedOrder() throws Exception {
        // TODO Arrange
        OrderResponse updatedResponse = testResponse.toBuilder()
                .status(Order.OrderStatus.SHIPPED)
                .description("Order shipped")
                .build();
        Mockito.when(orderService.updateOrderStatus(ArgumentMatchers.eq(1L), ArgumentMatchers.eq(Order.OrderStatus.SHIPPED)))
                .thenReturn(updatedResponse);

        // TODO Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.patch("/api/orders/{id}/status", 1L)
                        .param("status", "SHIPPED"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value("SHIPPED"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.description").value("Order shipped"));
    }

    @Test
    void When_DeleteOrder_Expect_ReturnNoContent() throws Exception {
        // TODO Arrange
        Mockito.doNothing().when(orderService).deleteOrder(1L);

        // TODO Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/orders/{id}", 1L))
                .andExpect(MockMvcResultMatchers.status().isNoContent());

        Mockito.verify(orderService, Mockito.times(1)).deleteOrder(1L);
    }
}