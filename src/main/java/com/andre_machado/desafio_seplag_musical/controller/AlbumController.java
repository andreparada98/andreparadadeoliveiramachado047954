package com.andre_machado.desafio_seplag_musical.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.andre_machado.desafio_seplag_musical.domain.dto.AlbumFilterDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.AlbumRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.AlbumResponseDTO;
import com.andre_machado.desafio_seplag_musical.service.AlbumService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/album")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@Tag(name = "Álbuns", description = "Endpoints para gerenciamento de álbuns")
public class AlbumController {

    private final AlbumService albumService;

    @Operation(summary = "Lista todos os álbuns", description = "Lista álbuns com paginação e filtros")
    @GetMapping
    public ResponseEntity<Page<AlbumResponseDTO>> getAllAlbums(
            AlbumFilterDTO filter,
            @PageableDefault(size = 12) Pageable pageable) {
        Page<AlbumResponseDTO> albums = albumService.findAll(filter, pageable);
        return ResponseEntity.ok(albums);
    }

    @Operation(summary = "Busca álbum por ID", description = "Retorna os detalhes de um álbum específico")
    @GetMapping("/{id}")
    public ResponseEntity<AlbumResponseDTO> getAlbumById(@PathVariable UUID id) {
        AlbumResponseDTO album = albumService.findById(id);
        return ResponseEntity.ok(album);
    }

    @Operation(summary = "Cria um novo álbum", description = "Cadastra um novo álbum no sistema")
    @PostMapping
    public ResponseEntity<AlbumResponseDTO> createAlbum(@RequestBody AlbumRequestDTO request) {
        AlbumResponseDTO album = albumService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(album);
    }

    @Operation(summary = "Atualiza um álbum", description = "Atualiza os dados de um álbum existente")
    @PutMapping("/{id}")
    public ResponseEntity<AlbumResponseDTO> updateAlbum(@PathVariable UUID id, @RequestBody AlbumRequestDTO request) {
        AlbumResponseDTO album = albumService.update(id, request);
        return ResponseEntity.ok(album);
    }
}
