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

import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistFilterDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistResponseDTO;
import com.andre_machado.desafio_seplag_musical.service.ArtistService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/artist")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class ArtistController {

    private final ArtistService artistService;

    @GetMapping
    public ResponseEntity<Page<ArtistResponseDTO>> getAllArtists(
            ArtistFilterDTO filter,
            @PageableDefault(size = 12) Pageable pageable) {
        Page<ArtistResponseDTO> artists = artistService.findAll(filter, pageable);
        return ResponseEntity.ok(artists);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtistResponseDTO> getArtistById(@PathVariable UUID id) {
        ArtistResponseDTO artist = artistService.findById(id);
        return ResponseEntity.ok(artist);
    }

    @PostMapping
    public ResponseEntity<ArtistResponseDTO> createArtist(@RequestBody ArtistRequestDTO request) {
        ArtistResponseDTO artist = artistService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(artist);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArtistResponseDTO> updateArtist(@PathVariable UUID id,
            @RequestBody ArtistRequestDTO request) {
        ArtistResponseDTO artist = artistService.update(id, request);
        return ResponseEntity.ok(artist);
    }
}
