package com.example.microservice.order_service.mapper;

import com.example.microservice.order_service.model.Order;
import com.example.microservice.order_service.model.OrderResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderResponse toOrderResponse(Order order);
}
