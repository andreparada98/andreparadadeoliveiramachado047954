package com.andre_machado.desafio_seplag_musical.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.andre_machado.desafio_seplag_musical.configuration.SecurityConfigurations;
import com.andre_machado.desafio_seplag_musical.configuration.SecurityFilter;
import com.andre_machado.desafio_seplag_musical.configuration.CustomAuthenticationEntryPoint;
import com.andre_machado.desafio_seplag_musical.domain.dto.AlbumRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.AlbumResponseDTO;
import com.andre_machado.desafio_seplag_musical.service.AlbumService;
import com.andre_machado.desafio_seplag_musical.service.TokenService;
import com.andre_machado.desafio_seplag_musical.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(AlbumController.class)
@Import({SecurityConfigurations.class, SecurityFilter.class, CustomAuthenticationEntryPoint.class, com.andre_machado.desafio_seplag_musical.configuration.RateLimitFilter.class})
class AlbumControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AlbumService albumService;

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
    @WithMockUser
    void getAllAlbums_ShouldReturnOk() throws Exception {
        when(albumService.findAll(any(), any())).thenReturn(new PageImpl<>(List.of()));

        mockMvc.perform(get("/v1/album"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void getAlbumById_ShouldReturnAlbum() throws Exception {
        UUID id = UUID.randomUUID();
        AlbumResponseDTO response = new AlbumResponseDTO(id, "The Wall", LocalDateTime.now(), List.of(), null);
        when(albumService.findById(id)).thenReturn(response);

        mockMvc.perform(get("/v1/album/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("The Wall"));
    }

    @Test
    @WithMockUser
    void createAlbum_ShouldReturnCreated() throws Exception {
        AlbumRequestDTO request = new AlbumRequestDTO("The Wall", LocalDateTime.now(), List.of(), null);
        AlbumResponseDTO response = new AlbumResponseDTO(UUID.randomUUID(), "The Wall", LocalDateTime.now(), List.of(), null);
        when(albumService.create(any())).thenReturn(response);

        mockMvc.perform(post("/v1/album")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("The Wall"));
    }
}

