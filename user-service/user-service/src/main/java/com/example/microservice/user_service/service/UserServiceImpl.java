package com.example.microservice.user_service.service;

import com.example.microservice.user_service.model.User;
import com.example.microservice.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private static final String CACHE_NAME = "products";

    @Override
    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    @Cacheable(cacheNames = CACHE_NAME, key = "#id", unless = "#result == null || !#result.isPresent()")
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
