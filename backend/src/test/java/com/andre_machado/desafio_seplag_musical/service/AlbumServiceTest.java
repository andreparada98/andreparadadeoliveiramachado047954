package com.andre_machado.desafio_seplag_musical.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.andre_machado.desafio_seplag_musical.domain.dto.AlbumFilterDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.AlbumRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.AlbumResponseDTO;
import com.andre_machado.desafio_seplag_musical.domain.model.Album;
import com.andre_machado.desafio_seplag_musical.domain.model.Artist;
import com.andre_machado.desafio_seplag_musical.domain.model.File;
import com.andre_machado.desafio_seplag_musical.repository.AlbumRepository;
import com.andre_machado.desafio_seplag_musical.repository.ArtistRepository;
import com.andre_machado.desafio_seplag_musical.repository.FileRepository;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
class AlbumServiceTest {

    @Mock
    private AlbumRepository albumRepository;

    @Mock
    private ArtistRepository artistRepository;

    @Mock
    private FileRepository fileRepository;

    @Mock
    private FileService fileService;

    @InjectMocks
    private AlbumService albumService;

    private UUID albumId;
    private Album album;
    private Artist artist;

    @BeforeEach
    void setUp() {
        albumId = UUID.randomUUID();
        artist = new Artist();
        artist.setId(UUID.randomUUID());
        artist.setName("Pink Floyd");

        album = new Album();
        album.setId(albumId);
        album.setTitle("The Wall");
        album.setReleasedAt(LocalDateTime.now());
        album.setArtists(new ArrayList<>(List.of(artist)));
        album.setCovers(new ArrayList<>());
    }

    @Test
    void findAll_ShouldReturnPageOfAlbums() {
        AlbumFilterDTO filter = new AlbumFilterDTO();
        Pageable pageable = PageRequest.of(0, 10);
        Page<Album> page = new PageImpl<>(List.of(album));

        when(albumRepository.findAll(pageable)).thenReturn(page);

        Page<AlbumResponseDTO> result = albumService.findAll(filter, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("The Wall", result.getContent().get(0).getTitle());
        verify(albumRepository).findAll(pageable);
    }

    @Test
    void findById_ShouldReturnAlbum() {
        when(albumRepository.findById(albumId)).thenReturn(Optional.of(album));

        AlbumResponseDTO result = albumService.findById(albumId);

        assertNotNull(result);
        assertEquals("The Wall", result.getTitle());
        verify(albumRepository).findById(albumId);
    }

    @Test
    void findById_WhenNotFound_ShouldThrowException() {
        when(albumRepository.findById(albumId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> albumService.findById(albumId));
    }

    @Test
    void create_ShouldSaveAndReturnAlbum() {
        AlbumRequestDTO request = new AlbumRequestDTO("The Wall", LocalDateTime.now(), List.of(artist.getId()), null);
        
        when(artistRepository.findAllById(any())).thenReturn(List.of(artist));
        when(albumRepository.save(any(Album.class))).thenReturn(album);

        AlbumResponseDTO result = albumService.create(request);

        assertNotNull(result);
        assertEquals("The Wall", result.getTitle());
        verify(albumRepository).save(any(Album.class));
    }

    @Test
    void update_ShouldUpdateAndReturnAlbum() {
        AlbumRequestDTO request = new AlbumRequestDTO("Updated Title", LocalDateTime.now(), List.of(artist.getId()), null);
        
        when(albumRepository.findById(albumId)).thenReturn(Optional.of(album));
        when(artistRepository.findAllById(any())).thenReturn(List.of(artist));
        when(albumRepository.save(any(Album.class))).thenReturn(album);

        AlbumResponseDTO result = albumService.update(albumId, request);

        assertNotNull(result);
        verify(albumRepository).save(any(Album.class));
    }

    @Test
    void create_WithFile_ShouldLinkFileAndReturnAlbum() {
        UUID fileId = UUID.randomUUID();
        AlbumRequestDTO request = new AlbumRequestDTO("The Wall", LocalDateTime.now(), List.of(artist.getId()), fileId);
        File file = new File();
        file.setId(fileId);

        when(artistRepository.findAllById(any())).thenReturn(List.of(artist));
        when(albumRepository.save(any(Album.class))).thenReturn(album);
        when(fileRepository.findById(fileId)).thenReturn(Optional.of(file));

        AlbumResponseDTO result = albumService.create(request);

        assertNotNull(result);
        verify(fileRepository).save(file);
        assertEquals(album, file.getAlbum());
    }
}

