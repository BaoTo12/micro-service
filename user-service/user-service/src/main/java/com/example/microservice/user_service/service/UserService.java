package com.example.microservice.user_service.service;

import com.example.microservice.user_service.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    void deleteById(Long id);

    List<User> findAll();
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    

}
