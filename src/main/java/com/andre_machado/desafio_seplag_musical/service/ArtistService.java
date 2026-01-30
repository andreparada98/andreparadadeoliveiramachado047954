package com.andre_machado.desafio_seplag_musical.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistFilterDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistResponseDTO;
import com.andre_machado.desafio_seplag_musical.domain.model.Artist;
import com.andre_machado.desafio_seplag_musical.repository.ArtistRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArtistService {

    private final ArtistRepository artistRepository;

    @Transactional(readOnly = true)
    public Page<ArtistResponseDTO> findAll(ArtistFilterDTO filter, Pageable pageable) {
        Page<Artist> artists;
        if (filter.getName() != null && !filter.getName().isBlank()) {
            artists = artistRepository.findByNameContainingIgnoreCase(filter.getName(), pageable);
        } else {
            artists = artistRepository.findAll(pageable);
        }
        return artists.map(artist -> new ArtistResponseDTO(artist.getId(), artist.getName()));
    }

    @Transactional
    public ArtistResponseDTO create(ArtistRequestDTO request) {
        Artist artist = new Artist();
        artist.setName(request.getName());
        
        Artist savedArtist = artistRepository.save(artist);
        return new ArtistResponseDTO(savedArtist.getId(), savedArtist.getName());
    }
}
