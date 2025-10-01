package com.example.microservice.user_service.service;

import com.example.microservice.user_service.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User save(User user);
    User update(Long id, User user);
    void deleteById(Long id);
    void deleteByEmail(String email);
    
    List<User> findAll();
    Page<User> findAll(Pageable pageable);
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    
    List<User> findByNameContaining(String name);
    Page<User> findBySearchTerm(String searchTerm, Pageable pageable);
    

    User activateUser(Long id);
    User deactivateUser(Long id);
    User suspendUser(Long id);
}
