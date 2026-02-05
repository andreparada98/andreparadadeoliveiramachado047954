package com.andre_machado.desafio_seplag_musical.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.andre_machado.desafio_seplag_musical.domain.model.User;

class TokenServiceTest {

    private TokenService tokenService;
    private User user;

    @BeforeEach
    void setUp() {
        tokenService = new TokenService();
        ReflectionTestUtils.setField(tokenService, "secret", "my-test-secret");
        
        user = new User();
        user.setUsername("testuser");
    }

    @Test
    void generateToken_ShouldReturnValidToken() {
        String token = tokenService.generateToken(user);
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void generateRefreshToken_ShouldReturnValidToken() {
        String token = tokenService.generateRefreshToken(user);
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void validateToken_WithValidToken_ShouldReturnUsername() {
        String token = tokenService.generateToken(user);
        String username = tokenService.validateToken(token);
        assertEquals("testuser", username);
    }

    @Test
    void validateToken_WithRefreshToken_ShouldReturnUsername() {
        String token = tokenService.generateRefreshToken(user);
        String username = tokenService.validateToken(token);
        assertEquals("testuser", username);
    }

    @Test
    void validateToken_WithInvalidToken_ShouldReturnEmptyString() {
        String username = tokenService.validateToken("invalid-token");
        assertEquals("", username);
    }
}

