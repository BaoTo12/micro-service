package com.example.microservice.user_service.service;

import com.example.microservice.user_service.exception.EmailAlreadyExistsException;
import com.example.microservice.user_service.exception.UserNotFoundException;
import com.example.microservice.user_service.model.User;
import com.example.microservice.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private static final String USER_CACHE = "users";
    private static final String USER_COUNT_CACHE = "userCounts";

    @Override
    @Transactional
    @CacheEvict(value = {USER_CACHE, USER_COUNT_CACHE}, allEntries = true)
    public User save(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists: " + user.getEmail());
        }
        return userRepository.save(user);
    }

    @Override
    @Transactional
    @CacheEvict(value = {USER_CACHE, USER_COUNT_CACHE}, allEntries = true)
    public User update(Long id, User user) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        // Check if email is being changed and if new email already exists
        if (!existingUser.getEmail().equals(user.getEmail()) &&
                userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists: " + user.getEmail());
        }

        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhoneNumber(user.getPhoneNumber());
        existingUser.setAddress(user.getAddress());
        existingUser.setAge(user.getAge());
        existingUser.setStatus(user.getStatus());

        return userRepository.save(existingUser);
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
    @Transactional
    @CacheEvict(value = {USER_CACHE, USER_COUNT_CACHE}, allEntries = true)
    public void deleteByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        userRepository.delete(user);
    }

    @Override
    @Cacheable(value = USER_CACHE, key = "'all'")
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    @Cacheable(value = USER_CACHE, key = "#id", unless = "#result == null || !#result.isPresent()")
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    @Cacheable(value = USER_CACHE, key = "'email_' + #email", unless = "#result == null || !#result.isPresent()")
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Cacheable(value = USER_CACHE, key = "'name_' + #name")
    public List<User> findByNameContaining(String name) {
        return userRepository.findByNameContainingIgnoreCase(name);
    }


    @Override
    public Page<User> findBySearchTerm(String searchTerm, Pageable pageable) {
        return userRepository.findBySearchTerm(searchTerm, pageable);
    }

    @Override
    @Transactional
    @CacheEvict(value = {USER_CACHE, USER_COUNT_CACHE}, allEntries = true)
    public User activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        user.setStatus(User.UserStatus.ACTIVE);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    @CacheEvict(value = {USER_CACHE, USER_COUNT_CACHE}, allEntries = true)
    public User deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        user.setStatus(User.UserStatus.INACTIVE);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    @CacheEvict(value = {USER_CACHE, USER_COUNT_CACHE}, allEntries = true)
    public User suspendUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        user.setStatus(User.UserStatus.SUSPENDED);
        return userRepository.save(user);
    }
}
