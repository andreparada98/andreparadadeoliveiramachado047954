package com.andre_machado.desafio_seplag_musical.service;

import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistFilterDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistResponseDTO;
import com.andre_machado.desafio_seplag_musical.domain.model.Artist;
import com.andre_machado.desafio_seplag_musical.domain.model.Album;
import com.andre_machado.desafio_seplag_musical.domain.projection.ArtistProjection;
import com.andre_machado.desafio_seplag_musical.repository.ArtistRepository;
import com.andre_machado.desafio_seplag_musical.repository.AlbumRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArtistService {

    private final ArtistRepository artistRepository;
    private final AlbumRepository albumRepository;

    @Transactional(readOnly = true)
    public Page<ArtistResponseDTO> findAll(ArtistFilterDTO filter, Pageable pageable) {
        Page<ArtistProjection> projections;
        if (filter.getName() != null && !filter.getName().isBlank()) {
            projections = artistRepository.findByNameContainingIgnoreCaseWithAlbumCount(filter.getName(), pageable);
        } else {
            projections = artistRepository.findAllWithAlbumCount(pageable);
        }
        return projections.map(this::mapToResponseDTO);
    }

    @Transactional(readOnly = true)
    public ArtistResponseDTO findById(UUID id) {
        return artistRepository.findByIdWithAlbumCount(id)
                .map(this::mapToResponseDTO)
                .orElseThrow(() -> new EntityNotFoundException("Artist not found with id: " + id));
    }

    @Transactional
    public ArtistResponseDTO create(ArtistRequestDTO request) {
        Artist artist = new Artist();
        artist.setName(request.getName());
        artist.setDescription(request.getDescription());

        Artist savedArtist = artistRepository.saveAndFlush(artist);

        if (request.getAlbumIds() != null && !request.getAlbumIds().isEmpty()) {
            updateArtistAlbums(savedArtist, request.getAlbumIds());
        }

        return findById(savedArtist.getId());
    }

    @Transactional
    public ArtistResponseDTO update(UUID id, ArtistRequestDTO request) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artist not found with id: " + id));

        artist.setName(request.getName());
        artist.setDescription(request.getDescription());

        if (request.getAlbumIds() != null) {
            updateArtistAlbums(artist, request.getAlbumIds());
        }

        Artist updatedArtist = artistRepository.saveAndFlush(artist);
        return findById(updatedArtist.getId());
    }

    private void updateArtistAlbums(Artist artist, List<UUID> albumIds) {
        List<Album> currentAlbums = albumRepository.findAllByArtistId(artist.getId());

        for (Album album : currentAlbums) {
            if (!albumIds.contains(album.getId())) {
                album.getArtists().remove(artist);
                artist.getAlbums().remove(album);
                albumRepository.save(album);
            }
        }

        for (UUID albumId : albumIds) {
            boolean alreadyLinked = currentAlbums.stream()
                    .anyMatch(a -> a.getId().equals(albumId));

            if (!alreadyLinked) {
                Album album = albumRepository.findById(albumId)
                        .orElseThrow(() -> new EntityNotFoundException("Album not found with id: " + albumId));

                if (!album.getArtists().contains(artist)) {
                    album.getArtists().add(artist);
                    artist.getAlbums().add(album);
                    albumRepository.save(album);
                }
            }
        }
        albumRepository.flush();
    }

    private ArtistResponseDTO mapToResponseDTO(ArtistProjection projection) {
        return new ArtistResponseDTO(
                projection.getId(),
                projection.getName(),
                projection.getDescription(),
                projection.getAlbumCount());
    }
}
