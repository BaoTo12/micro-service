package com.example.microservice.user_service.service;

import com.example.microservice.user_service.exception.EmailAlreadyExistsException;
import com.example.microservice.user_service.exception.UserNotFoundException;
import com.example.microservice.user_service.model.User;
import com.example.microservice.user_service.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private static final String USER_CACHE = "users";
    private static final String USER_COUNT_CACHE = "userCounts";

    @Override
    @Transactional
    @CacheEvict(value = {USER_CACHE, USER_COUNT_CACHE}, allEntries = true)
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists: " + user.getEmail());
        }
        User saveUser = null;
        try {
            saveUser = userRepository.save(user);
        }catch (RuntimeException ex){
            ex.printStackTrace();
        }
        return saveUser;
    }

    @Override
    @Transactional
    @CacheEvict(value = {USER_CACHE, USER_COUNT_CACHE}, allEntries = true)
    public void deleteById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    @Cacheable(value = USER_CACHE, key = "'all'")
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    @Cacheable(value = USER_CACHE, key = "#id", unless = "#result == null")
    public User findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Cannot find user with id: {}", id);
                    return new EntityNotFoundException("Cannot find user with id: " + id);
                });
        log.info("Found user: {} with id: {}", user, id);
        return user;
    }

    @Override
    @Cacheable(value = USER_CACHE, key = "'email_' + #email", unless = "#result == null || !#result.isPresent()")
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }
}
