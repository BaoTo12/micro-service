package com.example.microservice.user_service.service;

import com.example.microservice.user_service.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User save(User user);
    List<User> findAll();
    Optional<User> findById(Long id);
}
