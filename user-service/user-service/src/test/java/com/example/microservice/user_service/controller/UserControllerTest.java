package com.example.microservice.user_service.controller;

import com.example.microservice.user_service.exception.UserNotFoundException;
import com.example.microservice.user_service.model.User;
import com.example.microservice.user_service.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;
import java.util.Optional;


@WebMvcTest(UserController.class)
public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper mapper;

    @MockitoBean
    UserService userService;

    private User testUser;

    @BeforeEach
    void initUser() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Chi Bao TO");
        testUser.setAddress("Bac Lieu");
        testUser.setAge(15);
        testUser.setEmail("baototo@gmail.com");
        testUser.setStatus(User.UserStatus.ACTIVE);
        testUser.setPhoneNumber("0877147856");
    }

    @Test
    void When_CreateUser_WithValidUser_Expect_ReturnsCreatedUser() throws Exception {
        // TODO: Arrange
        Mockito.when(userService.createUser(testUser)).thenReturn(testUser);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(testUser));
        // TODO: Act & Assert
        mockMvc.perform(requestBuilder)
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.address").value("Bac Lieu"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("baototo@gmail.com"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.phoneNumber").value("0877147856"));

        Mockito.verify(userService).createUser(ArgumentMatchers.any(User.class));
    }

    @Test
    void When_CreateUser_WithInvalidUser_Expect_ReturnsBadRequest() throws Exception {
        // TODO: Arrange
        User invalidUser = new User();
        // TODO: Act & Assert
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(invalidUser));

        mockMvc.perform(requestBuilder)
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    void When_GetUserById_UserExists_Expect_ReturnsUser() throws Exception {
        // TODO: Arrange
        Mockito.when(userService.findById(testUser.getId())).thenReturn(testUser);
        // TODO: Act & Assert
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .get("/api/users/{id}", 1)
                .contentType(MediaType.APPLICATION_JSON);

        mockMvc.perform(requestBuilder)
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.address").value("Bac Lieu"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("baototo@gmail.com"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.phoneNumber").value("0877147856"));
        Mockito.verify(userService, Mockito.times(1)).findById(1L);
    }

    @Test
    void When_GetUserById_UserNotFound_Expect_ReturnsNotFound() throws Exception {
        // TODO: Arrange
        Mockito.when(userService.findById(Mockito.any()))
                .thenThrow(new EntityNotFoundException("User not found"));

        // TODO: Act & Assert
        this.mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/users/{id}", 929L)
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isInternalServerError());

        Mockito.verify(userService).findById(929L);
    }

    @Test
    void When_GetUserByEmail_UserExists_Expect_ReturnsUser() throws Exception {
        // TODO: Arrange
        Mockito.when(userService.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));

        // TODO: Act & Assert
        this.mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/users/email/{email}", testUser.getEmail())
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.address").value("Bac Lieu"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("baototo@gmail.com"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.phoneNumber").value("0877147856"));

        Mockito.verify(userService, Mockito.times(1)).findByEmail(Mockito.any());
    }

    @Test
    void When_GetUserByEmail_UserNotFound_Expect_InternalServerError() throws Exception {
        // TODO: Arrange
        Mockito.when(userService.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        // TODO: Act & Assert
        this.mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/users/email/{email}", "notfound@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isInternalServerError());

        Mockito.verify(userService).findByEmail("notfound@example.com");
    }

    @Test
    void When_GetAllUsers_Expect_ReturnsUserList() throws Exception {
        // TODO: Arrange
        User user2 = new User();
        user2.setId(2L);
        user2.setEmail("bao2@example.com");
        user2.setName("Chi Bao Two");

        List<User> users = List.of(testUser, user2);
        Mockito.when(userService.getAllUser()).thenReturn(users);

        // TODO: Act & Assert
        this.mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/users")
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize(2)))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].email").value("baototo@gmail.com"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].email").value("bao2@example.com"));

        Mockito.verify(userService).getAllUser();
    }

    @Test
    void When_GetAllUsers_NoUsers_Expect_ReturnsEmptyList() throws Exception {
        // TODO: Arrange
        Mockito.when(userService.getAllUser()).thenReturn(List.of());

        // TODO: Act & Assert
        this.mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/users")
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize(0)));

        Mockito.verify(userService).getAllUser();
    }
    @Test
    void When_DeleteUser_UserExists_Expect_ReturnsNoContent() throws Exception {
        // TODO: Arrange
        Mockito.doNothing().when(userService).deleteById(1L);

        // TODO: Act & Assert
        this.mockMvc.perform(
                        MockMvcRequestBuilders.delete("/api/users/{id}", 1L)
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isNoContent());

        Mockito.verify(userService).deleteById(1L);
    }

    @Test
    void When_DeleteUser_UserNotFound_Expect_ReturnsNotFound() throws Exception {
        // TODO: Arrange
        Mockito.doThrow(new UserNotFoundException("User not found with id: 999"))
                .when(userService).deleteById(979L);

        // TODO: Act & Assert
        this.mockMvc.perform(
                        MockMvcRequestBuilders.delete("/api/users/{id}", 979L)
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isNotFound());

        Mockito.verify(userService).deleteById(979L);
    }
}
