package com.andre_machado.desafio_seplag_musical.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

import com.andre_machado.desafio_seplag_musical.domain.dto.FileResponseDTO;
import com.andre_machado.desafio_seplag_musical.service.FileService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@Tag(name = "Arquivos", description = "Endpoints para upload e visualização de arquivos")
public class FileController {

    private final FileService fileService;

    @Operation(summary = "Upload de arquivo", description = "Faz o upload de um arquivo para o MinIO")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileResponseDTO> uploadFile(@RequestParam("file") MultipartFile file) {
        FileResponseDTO response = fileService.uploadFile(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Busca arquivo por ID", description = "Retorna os detalhes de um arquivo específico")
    @GetMapping("/{id}")
    public ResponseEntity<FileResponseDTO> getFile(@PathVariable UUID id) {
        FileResponseDTO response = fileService.getFileById(id);
        return ResponseEntity.ok(response);
    }
}
