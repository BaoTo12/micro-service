package com.example.microservice.order_service.open_feign;

import com.example.microservice.order_service.dto.UserDto;
import org.springframework.stereotype.Component;

@Component
public class UserClientFallback implements UserClient {

    @Override
    public UserDto getUserById(Long id) {
        return UserDto.builder()
                .id(id)
                .name("Unknown User")
                .email("unknown@example.com")
                .build();
    }

    @Override
    public UserDto getUserByEmail(String email) {
        return UserDto.builder()
                .id(0L)
                .name("Unknown User")
                .email(email)
                .build();
    }
}

