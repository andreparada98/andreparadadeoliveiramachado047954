package com.andre_machado.desafio_seplag_musical.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.andre_machado.desafio_seplag_musical.configuration.SecurityConfigurations;
import com.andre_machado.desafio_seplag_musical.configuration.SecurityFilter;
import com.andre_machado.desafio_seplag_musical.configuration.CustomAuthenticationEntryPoint;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistResponseDTO;
import com.andre_machado.desafio_seplag_musical.service.ArtistService;
import com.andre_machado.desafio_seplag_musical.service.AlbumService;
import com.andre_machado.desafio_seplag_musical.service.TokenService;
import com.andre_machado.desafio_seplag_musical.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(ArtistController.class)
@Import({SecurityConfigurations.class, SecurityFilter.class, CustomAuthenticationEntryPoint.class})
class ArtistControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ArtistService artistService;

    @MockitoBean
    private AlbumService albumService;

    @MockitoBean
    private TokenService tokenService;

    @MockitoBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void getAllArtists_ShouldReturnOk() throws Exception {
        when(artistService.findAll(any(), any())).thenReturn(new PageImpl<>(List.of()));

        mockMvc.perform(get("/v1/artist"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void getArtistById_ShouldReturnArtist() throws Exception {
        UUID id = UUID.randomUUID();
        ArtistResponseDTO response = new ArtistResponseDTO(id, "Pink Floyd", "Desc", 0L);
        when(artistService.findById(id)).thenReturn(response);

        mockMvc.perform(get("/v1/artist/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Pink Floyd"));
    }

    @Test
    @WithMockUser
    void createArtist_ShouldReturnCreated() throws Exception {
        ArtistRequestDTO request = new ArtistRequestDTO("New Artist", "New Desc", List.of());
        ArtistResponseDTO response = new ArtistResponseDTO(UUID.randomUUID(), "New Artist", "New Desc", 0L);
        when(artistService.create(any())).thenReturn(response);

        mockMvc.perform(post("/v1/artist")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Artist"));
    }

    @Test
    void getAllArtists_WhenUnauthenticated_ShouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/v1/artist"))
                .andExpect(status().isUnauthorized());
    }
}

