package com.example.microservice.user_service.service;

import com.example.microservice.user_service.exception.EmailAlreadyExistsException;
import com.example.microservice.user_service.exception.UserNotFoundException;
import com.example.microservice.user_service.model.User;
import com.example.microservice.user_service.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    // TODO: naming convention: When_StateUnderTest_Expect_ExpectedBehavior
    @Mock
    UserRepository userRepository;
    @InjectMocks
    UserServiceImpl userService;
    User testUser;

    @BeforeEach
    public void initUser() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setAddress("Bac Lieu");
        testUser.setAge(15);
        testUser.setEmail("baototo@gmail.com");
        testUser.setStatus(User.UserStatus.ACTIVE);
        testUser.setPhoneNumber("0877147856");
    }

    @Test
    void When_CreateUserWithValidInformation_Expect_ReturnAUser() {
        // TODO: Arrange
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(userRepository.existsByEmail(testUser.getEmail())).thenReturn(false);
        // TODO: Act
        User saveUser = userService.createUser(testUser);
        // TODO: Assert
        assertNotNull(saveUser);
        assertEquals(saveUser, testUser);
        verify(userRepository, Mockito.times(1)).existsByEmail(testUser.getEmail());
        verify(userRepository, Mockito.times(1)).save(testUser);
    }

    @Test
    void When_CreateUserWithEmailThatAlreadyExisted_Expect_ThrowEmailAlreadyExistsException() {
        // TODO: Arrange
        when(userRepository.existsByEmail(testUser.getEmail())).thenReturn(true);
        // TODO: Act & Assert
        assertThrows(EmailAlreadyExistsException.class, () ->
                userService.createUser(testUser));
        verify(userRepository, Mockito.times(1)).existsByEmail(testUser.getEmail());
        verify(userRepository, Mockito.never()).save(any());
    }

    @Test
    void When_DeleteUserWithNotFoundId_Expect_ThrowUserNotFoundException() {
        // TODO: Arrange
        when(userRepository.existsById(testUser.getId())).thenReturn(false);
        // TODO: Act & Assert
        assertThrows(UserNotFoundException.class, () ->
                userService.deleteById(testUser.getId()));
        verify(userRepository, Mockito.times(1)).existsById(testUser.getId());
        verify(userRepository, Mockito.never()).deleteById(any());
    }

    @Test
    void When_DeleteUserWithValidId_Expect_DeleteUserSuccessfully() {
        // TODO: Arrange
        when(userRepository.existsById(testUser.getId())).thenReturn(true);
//        doNothing().when(userRepository).delete(testUser);
        // TODO: Act
        userService.deleteById(testUser.getId());
        // TODO: Assert
        verify(userRepository).existsById(testUser.getId());
        verify(userRepository).deleteById(testUser.getId());
    }

    @Test
    void When_FindUserWithIdThatExists_Expect_ReturnAUser() {
        // TODO: Arrange
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        // TODO: Act
        userService.findById(testUser.getId());
        // TODO: Assert
        verify(userRepository).findById(testUser.getId());
    }

    @Test
    void When_FindUserWithNotExistId_Expect_ThrowEntityNotFoundException() {
        // TODO: Arrange
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.empty());
        // TODO: Act
        assertThrows(EntityNotFoundException.class, () ->
                userService.findById(testUser.getId()));
        // TODO: Assert
        verify(userRepository).findById(testUser.getId());
    }

    @Test
    void When_FindAllUser_Expect_ReturnAListOfOneUser(){
        // TODO: Arrange
        when(userRepository.findAll()).thenReturn(List.of(testUser));
        // TODO: Act
        List<User> userList = userService.getAllUser();
        // TODO: Assert
        assertEquals(1, userList.size());
        verify(userRepository).findAll();

    }

    @Test
    void When_FindUserByValidEmail_Expect_ReturnAUser(){
        // TODO: Arrange
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        // TODO: Act
        User user = userService.findByEmail(testUser.getEmail()).get();
        // TODO: Assert
        assertNotNull(user);
        verify(userRepository).findByEmail(any());
    }
}
