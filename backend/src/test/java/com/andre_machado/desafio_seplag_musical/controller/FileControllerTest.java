package com.andre_machado.desafio_seplag_musical.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.andre_machado.desafio_seplag_musical.configuration.SecurityConfigurations;
import com.andre_machado.desafio_seplag_musical.configuration.SecurityFilter;
import com.andre_machado.desafio_seplag_musical.configuration.CustomAuthenticationEntryPoint;
import com.andre_machado.desafio_seplag_musical.domain.dto.FileResponseDTO;
import com.andre_machado.desafio_seplag_musical.service.FileService;
import com.andre_machado.desafio_seplag_musical.service.TokenService;
import com.andre_machado.desafio_seplag_musical.repository.UserRepository;

@WebMvcTest(FileController.class)
@Import({SecurityConfigurations.class, SecurityFilter.class, CustomAuthenticationEntryPoint.class})
class FileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FileService fileService;

    @MockitoBean
    private TokenService tokenService;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    @WithMockUser
    void uploadFile_ShouldReturnCreated() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", MediaType.IMAGE_JPEG_VALUE, "data".getBytes());
        FileResponseDTO response = new FileResponseDTO(UUID.randomUUID(), "test.jpg", 4L, MediaType.IMAGE_JPEG_VALUE, "http://url.com");
        
        when(fileService.uploadFile(any())).thenReturn(response);

        mockMvc.perform(multipart("/file/upload").file(file))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("test.jpg"));
    }

    @Test
    @WithMockUser
    void getFile_ShouldReturnOk() throws Exception {
        UUID id = UUID.randomUUID();
        FileResponseDTO response = new FileResponseDTO(id, "test.jpg", 4L, MediaType.IMAGE_JPEG_VALUE, "http://url.com");
        
        when(fileService.getFileById(id)).thenReturn(response);

        mockMvc.perform(get("/file/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()));
    }
}

