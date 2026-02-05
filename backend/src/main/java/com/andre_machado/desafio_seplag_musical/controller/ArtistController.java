package com.andre_machado.desafio_seplag_musical.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andre_machado.desafio_seplag_musical.domain.dto.AlbumResponseDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistFilterDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistResponseDTO;
import com.andre_machado.desafio_seplag_musical.service.AlbumService;
import com.andre_machado.desafio_seplag_musical.service.ArtistService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/artist")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@Tag(name = "Artistas", description = "Endpoints para gerenciamento de artistas")
public class ArtistController {

    private final ArtistService artistService;
    private final AlbumService albumService;

    @Operation(summary = "Lista todos os artistas", description = "Lista artistas com paginação e filtros")
    @GetMapping
    public ResponseEntity<Page<ArtistResponseDTO>> getAllArtists(
            ArtistFilterDTO filter,
            @PageableDefault(size = 12) Pageable pageable) {
        Page<ArtistResponseDTO> artists = artistService.findAll(filter, pageable);
        return ResponseEntity.ok(artists);
    }

    @Operation(summary = "Busca álbuns por artista", description = "Retorna todos os álbuns de um artista específico")
    @GetMapping("/{id}/albums")
    public ResponseEntity<Page<AlbumResponseDTO>> getAlbumsByArtist(
            @PathVariable UUID id,
            @PageableDefault(size = 12) Pageable pageable) {
        Page<AlbumResponseDTO> albums = albumService.findByArtistId(id, pageable);
        return ResponseEntity.ok(albums);
    }

    @Operation(summary = "Busca artista por ID", description = "Retorna os detalhes de um artista específico")
    @GetMapping("/{id}")
    public ResponseEntity<ArtistResponseDTO> getArtistById(@PathVariable UUID id) {
        ArtistResponseDTO artist = artistService.findById(id);
        return ResponseEntity.ok(artist);
    }

    @Operation(summary = "Cria um novo artista", description = "Cadastra um novo artista no sistema")
    @PostMapping
    public ResponseEntity<ArtistResponseDTO> createArtist(@RequestBody ArtistRequestDTO request) {
        ArtistResponseDTO artist = artistService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(artist);
    }

    @Operation(summary = "Atualiza um artista", description = "Atualiza os dados de um artista existente")
    @PutMapping("/{id}")
    public ResponseEntity<ArtistResponseDTO> updateArtist(@PathVariable UUID id,
            @RequestBody ArtistRequestDTO request) {
        ArtistResponseDTO artist = artistService.update(id, request);
        return ResponseEntity.ok(artist);
    }
}
