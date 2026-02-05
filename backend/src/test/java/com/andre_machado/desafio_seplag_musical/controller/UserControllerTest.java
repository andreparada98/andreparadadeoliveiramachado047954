package com.andre_machado.desafio_seplag_musical.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.andre_machado.desafio_seplag_musical.configuration.SecurityConfigurations;
import com.andre_machado.desafio_seplag_musical.configuration.SecurityFilter;
import com.andre_machado.desafio_seplag_musical.configuration.CustomAuthenticationEntryPoint;
import com.andre_machado.desafio_seplag_musical.domain.dto.UserRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.UserResponseDTO;
import com.andre_machado.desafio_seplag_musical.service.UserService;
import com.andre_machado.desafio_seplag_musical.service.TokenService;
import com.andre_machado.desafio_seplag_musical.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(UserController.class)
@Import({SecurityConfigurations.class, SecurityFilter.class, CustomAuthenticationEntryPoint.class})
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private TokenService tokenService;

    @MockitoBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createUser_ShouldReturnCreated() throws Exception {
        UserRequestDTO request = new UserRequestDTO("New User", "user", "password");
        UserResponseDTO response = new UserResponseDTO(UUID.randomUUID(), "New User", "user");
        
        when(userService.create(any())).thenReturn(response);

        mockMvc.perform(post("/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("user"));
    }
}

