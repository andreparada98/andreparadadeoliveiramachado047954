package com.andre_machado.desafio_seplag_musical.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.andre_machado.desafio_seplag_musical.configuration.SecurityConfigurations;
import com.andre_machado.desafio_seplag_musical.configuration.SecurityFilter;
import com.andre_machado.desafio_seplag_musical.configuration.CustomAuthenticationEntryPoint;
import com.andre_machado.desafio_seplag_musical.domain.dto.AuthenticationDTO;
import com.andre_machado.desafio_seplag_musical.domain.model.User;
import com.andre_machado.desafio_seplag_musical.service.TokenService;
import com.andre_machado.desafio_seplag_musical.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(AuthenticationController.class)
@Import({SecurityConfigurations.class, SecurityFilter.class, CustomAuthenticationEntryPoint.class, com.andre_machado.desafio_seplag_musical.configuration.RateLimitFilter.class})
class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthenticationManager authenticationManager;

    @MockitoBean
    private TokenService tokenService;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private com.andre_machado.desafio_seplag_musical.service.RateLimitService rateLimitService;

    @Autowired
    private ObjectMapper objectMapper;

    @org.junit.jupiter.api.BeforeEach
    void setUpRateLimit() {
        io.github.bucket4j.Bucket bucket = io.github.bucket4j.Bucket.builder()
                .addLimit(io.github.bucket4j.Bandwidth.builder()
                        .capacity(100)
                        .refillGreedy(100, java.time.Duration.ofMinutes(1))
                        .build())
                .build();
        when(rateLimitService.resolveBucket(anyString())).thenReturn(bucket);
    }

    @Test
    void login_ShouldReturnTokenAndRefreshToken() throws Exception {
        AuthenticationDTO request = new AuthenticationDTO("admin", "admin123");
        User user = new User();
        user.setUsername("admin");
        Authentication auth = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(user);
        when(tokenService.generateToken(user)).thenReturn("mock-token");
        when(tokenService.generateRefreshToken(user)).thenReturn("mock-refresh-token");

        mockMvc.perform(post("/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-token"))
                .andExpect(jsonPath("$.refreshToken").value("mock-refresh-token"));
    }

    @Test
    void refresh_ShouldReturnNewTokens() throws Exception {
        User user = new User();
        user.setUsername("admin");

        when(tokenService.validateToken("valid-refresh-token")).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(java.util.Optional.of(user));
        when(tokenService.generateToken(user)).thenReturn("new-token");
        when(tokenService.generateRefreshToken(user)).thenReturn("new-refresh-token");

        mockMvc.perform(post("/v1/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"refreshToken\": \"valid-refresh-token\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("new-token"))
                .andExpect(jsonPath("$.refreshToken").value("new-refresh-token"));
    }
}

