package com.example.microservice.user_service.service;

import com.example.microservice.user_service.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);

    void deleteById(Long id);

    User findById(Long id);

    Optional<User> findByEmail(String email);

    List<User> getAllUser();

}
