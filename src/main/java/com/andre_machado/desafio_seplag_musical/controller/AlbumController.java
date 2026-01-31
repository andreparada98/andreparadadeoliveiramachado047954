package com.andre_machado.desafio_seplag_musical.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.andre_machado.desafio_seplag_musical.domain.dto.AlbumFilterDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.AlbumRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.AlbumResponseDTO;
import com.andre_machado.desafio_seplag_musical.service.AlbumService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/album")
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumService albumService;

    @GetMapping
    public ResponseEntity<Page<AlbumResponseDTO>> getAllAlbums(
            AlbumFilterDTO filter,
            @PageableDefault(size = 12) Pageable pageable) {
        Page<AlbumResponseDTO> albums = albumService.findAll(filter, pageable);
        return ResponseEntity.ok(albums);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlbumResponseDTO> getAlbumById(@PathVariable UUID id) {
        AlbumResponseDTO album = albumService.findById(id);
        return ResponseEntity.ok(album);
    }

    @PostMapping
    public ResponseEntity<AlbumResponseDTO> createAlbum(@RequestBody AlbumRequestDTO request) {
        AlbumResponseDTO album = albumService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(album);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlbumResponseDTO> updateAlbum(@PathVariable UUID id, @RequestBody AlbumRequestDTO request) {
        AlbumResponseDTO album = albumService.update(id, request);
        return ResponseEntity.ok(album);
    }
}

