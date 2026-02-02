package com.andre_machado.desafio_seplag_musical.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andre_machado.desafio_seplag_musical.domain.dto.AlbumFilterDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.AlbumRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.AlbumResponseDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistResponseDTO;
import com.andre_machado.desafio_seplag_musical.domain.model.Album;
import com.andre_machado.desafio_seplag_musical.domain.model.Artist;
import com.andre_machado.desafio_seplag_musical.repository.AlbumRepository;
import com.andre_machado.desafio_seplag_musical.repository.ArtistRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;

    @Transactional(readOnly = true)
    public Page<AlbumResponseDTO> findAll(AlbumFilterDTO filter, Pageable pageable) {
        Page<Album> albums;
        if (filter.getTitle() != null && !filter.getTitle().isBlank()) {
            albums = albumRepository.findByTitleContainingIgnoreCase(filter.getTitle(), pageable);
        } else {
            albums = albumRepository.findAll(pageable);
        }
        return albums.map(this::convertToResponseDTO);
    }

    @Transactional(readOnly = true)
    public AlbumResponseDTO findById(UUID id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Album not found with id: " + id));
        return convertToResponseDTO(album);
    }

    @Transactional
    public AlbumResponseDTO create(AlbumRequestDTO request) {
        Album album = new Album();
        album.setTitle(request.getTitle());
        album.setReleasedAt(request.getReleasedAt());
        
        if (request.getArtistIds() != null && !request.getArtistIds().isEmpty()) {
            List<Artist> artists = artistRepository.findAllById(request.getArtistIds());
            album.setArtists(artists);
        }

        Album savedAlbum = albumRepository.save(album);
        return convertToResponseDTO(savedAlbum);
    }

    @Transactional
    public AlbumResponseDTO update(UUID id, AlbumRequestDTO request) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Album not found with id: " + id));

        album.setTitle(request.getTitle());
        album.setReleasedAt(request.getReleasedAt());

        if (request.getArtistIds() != null) {
            List<Artist> artists = artistRepository.findAllById(request.getArtistIds());
            album.setArtists(artists);
        }

        Album updatedAlbum = albumRepository.save(album);
        return convertToResponseDTO(updatedAlbum);
    }

    private AlbumResponseDTO convertToResponseDTO(Album album) {
        List<ArtistResponseDTO> artists = album.getArtists().stream()
                .map(artist -> new ArtistResponseDTO(artist.getId(), artist.getName(), artist.getDescription()))
                .collect(Collectors.toList());

        return new AlbumResponseDTO(
                album.getId(),
                album.getTitle(),
                album.getReleasedAt(),
                artists
        );
    }
}

