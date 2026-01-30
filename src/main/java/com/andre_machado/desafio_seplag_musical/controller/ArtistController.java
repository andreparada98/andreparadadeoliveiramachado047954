package com.andre_machado.desafio_seplag_musical.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
public class ArtistController {

    private final ArtistService artistService;

    @GetMapping
    public ResponseEntity<Page<ArtistResponseDTO>> getAllArtists(
            ArtistFilterDTO filter,
            @PageableDefault(size = 12) Pageable pageable) {
        Page<ArtistResponseDTO> artists = artistService.findAll(filter, pageable);
        return ResponseEntity.ok(artists);
    }

    @PostMapping
    public ResponseEntity<ArtistResponseDTO> createArtist(@RequestBody ArtistRequestDTO request) {
        ArtistResponseDTO artist = artistService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(artist);
    }
}
