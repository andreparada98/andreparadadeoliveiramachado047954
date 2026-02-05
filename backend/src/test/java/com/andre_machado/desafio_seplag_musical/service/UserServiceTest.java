package com.andre_machado.desafio_seplag_musical.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.andre_machado.desafio_seplag_musical.domain.dto.UserRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.UserResponseDTO;
import com.andre_machado.desafio_seplag_musical.domain.model.User;
import com.andre_machado.desafio_seplag_musical.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void create_ShouldSaveAndReturnUser() {
        UserRequestDTO request = new UserRequestDTO("Admin", "admin", "admin123");
        User savedUser = new User();
        savedUser.setId(UUID.randomUUID());
        savedUser.setName("Admin");
        savedUser.setUsername("admin");

        when(userRepository.findByUsername("admin")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("admin123")).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserResponseDTO result = userService.create(request);

        assertNotNull(result);
        assertEquals("admin", result.getUsername());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void create_WhenUsernameExists_ShouldThrowException() {
        UserRequestDTO request = new UserRequestDTO("Admin", "admin", "admin123");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(new User()));

        assertThrows(RuntimeException.class, () -> userService.create(request));
        verify(userRepository, never()).save(any());
    }
}

