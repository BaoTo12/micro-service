package com.example.microservice.user_service.controller;
import com.example.microservice.user_service.model.User;
import com.example.microservice.user_service.model.UserDto;
import com.example.microservice.user_service.repository.UserRepository;
import com.example.microservice.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public UserDto getUserById(@PathVariable Long id) {
        User user = userService.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDto(user.getId(), user.getName(), user.getEmail());
    }
}
