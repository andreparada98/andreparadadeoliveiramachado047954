package com.andre_machado.desafio_seplag_musical.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistFilterDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistResponseDTO;
import com.andre_machado.desafio_seplag_musical.domain.model.Artist;
import com.andre_machado.desafio_seplag_musical.repository.ArtistRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArtistService {

    private final ArtistRepository artistRepository;

    @Transactional(readOnly = true)
    public Page<ArtistResponseDTO> findAll(ArtistFilterDTO filter, Pageable pageable) {
        if (filter.getName() != null && !filter.getName().isBlank()) {
            return artistRepository.findByNameContainingIgnoreCaseWithAlbumCount(filter.getName(), pageable);
        } else {
            return artistRepository.findAllWithAlbumCount(pageable);
        }
    }

    @Transactional(readOnly = true)
    public ArtistResponseDTO findById(UUID id) {
        return artistRepository.findByIdWithAlbumCount(id)
                .orElseThrow(() -> new EntityNotFoundException("Artist not found with id: " + id));
    }

    @Transactional
    public ArtistResponseDTO create(ArtistRequestDTO request) {
        Artist artist = new Artist();
        artist.setName(request.getName());
        artist.setDescription(request.getDescription());

        Artist savedArtist = artistRepository.save(artist);
        return new ArtistResponseDTO(savedArtist.getId(), savedArtist.getName(), savedArtist.getDescription(), 0L);
    }

    @Transactional
    public ArtistResponseDTO update(UUID id, ArtistRequestDTO request) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artist not found with id: " + id));

        artist.setName(request.getName());
        artist.setDescription(request.getDescription());

        Artist updatedArtist = artistRepository.save(artist);
        return findById(updatedArtist.getId());
    }
}
