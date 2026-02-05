package com.andre_machado.desafio_seplag_musical.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import io.minio.MinioClient;
import com.andre_machado.desafio_seplag_musical.domain.dto.FileResponseDTO;
import com.andre_machado.desafio_seplag_musical.domain.model.File;
import com.andre_machado.desafio_seplag_musical.repository.FileRepository;

@ExtendWith(MockitoExtension.class)
class FileServiceTest {

    @Mock
    private MinioClient minioClient;

    @Mock
    private FileRepository fileRepository;

    @InjectMocks
    private FileService fileService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(fileService, "bucketName", "test-bucket");
        ReflectionTestUtils.setField(fileService, "minioPublicUrl", "http://localhost:9000");
    }

    @Test
    void uploadFile_ShouldReturnFileResponse() throws Exception {
        MockMultipartFile mockFile = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test data".getBytes());
        File savedFile = new File();
        savedFile.setId(UUID.randomUUID());
        savedFile.setName("test.jpg");
        savedFile.setSize(mockFile.getSize());
        savedFile.setMimeType(mockFile.getContentType());
        savedFile.setUrl("http://localhost:9000/test-bucket/test.jpg");

        when(minioClient.bucketExists(any())).thenReturn(true);
        when(fileRepository.save(any(File.class))).thenReturn(savedFile);

        FileResponseDTO result = fileService.uploadFile(mockFile);

        assertNotNull(result);
        assertEquals("test.jpg", result.getName());
        verify(minioClient).putObject(any());
        verify(fileRepository).save(any(File.class));
    }

    @Test
    void getFileById_ShouldReturnFileResponse() {
        UUID id = UUID.randomUUID();
        File file = new File();
        file.setId(id);
        file.setName("test.jpg");
        file.setUrl("http://url.com");
        file.setMimeType("image/jpeg");

        when(fileRepository.findById(id)).thenReturn(Optional.of(file));

        FileResponseDTO result = fileService.getFileById(id);

        assertNotNull(result);
        assertEquals("test.jpg", result.getName());
    }

    @Test
    void getFileById_WhenNotFound_ShouldThrowException() {
        UUID id = UUID.randomUUID();
        when(fileRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> fileService.getFileById(id));
    }
}

