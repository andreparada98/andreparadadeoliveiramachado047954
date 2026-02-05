package com.andre_machado.desafio_seplag_musical.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

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

import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistFilterDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistResponseDTO;
import com.andre_machado.desafio_seplag_musical.domain.model.Artist;
import com.andre_machado.desafio_seplag_musical.domain.projection.ArtistProjection;
import com.andre_machado.desafio_seplag_musical.repository.ArtistRepository;
import com.andre_machado.desafio_seplag_musical.repository.AlbumRepository;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
class ArtistServiceTest {

    @Mock
    private ArtistRepository artistRepository;

    @Mock
    private AlbumRepository albumRepository;

    @InjectMocks
    private ArtistService artistService;

    private UUID artistId;
    private Artist artist;
    private ArtistProjection artistProjection;

    @BeforeEach
    void setUp() {
        artistId = UUID.randomUUID();
        artist = new Artist();
        artist.setId(artistId);
        artist.setName("Pink Floyd");
        artist.setDescription("Progressive Rock");

        artistProjection = mock(ArtistProjection.class);
    }

    private void stubArtistProjection() {
        when(artistProjection.getId()).thenReturn(artistId);
        when(artistProjection.getName()).thenReturn("Pink Floyd");
        when(artistProjection.getDescription()).thenReturn("Progressive Rock");
        when(artistProjection.getAlbumCount()).thenReturn(5L);
    }

    @Test
    void findAll_ShouldReturnPageOfArtists() {
        stubArtistProjection();
        ArtistFilterDTO filter = new ArtistFilterDTO();
        Pageable pageable = PageRequest.of(0, 10);
        Page<ArtistProjection> page = new PageImpl<>(List.of(artistProjection));

        when(artistRepository.findAllWithAlbumCount(pageable)).thenReturn(page);

        Page<ArtistResponseDTO> result = artistService.findAll(filter, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Pink Floyd", result.getContent().get(0).getName());
        verify(artistRepository).findAllWithAlbumCount(pageable);
    }

    @Test
    void findAll_WithNameFilter_ShouldReturnFilteredPage() {
        stubArtistProjection();
        ArtistFilterDTO filter = new ArtistFilterDTO();
        filter.setName("Pink");
        Pageable pageable = PageRequest.of(0, 10);
        Page<ArtistProjection> page = new PageImpl<>(List.of(artistProjection));

        when(artistRepository.findByNameContainingIgnoreCaseWithAlbumCount(eq("Pink"), eq(pageable))).thenReturn(page);

        Page<ArtistResponseDTO> result = artistService.findAll(filter, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(artistRepository).findByNameContainingIgnoreCaseWithAlbumCount("Pink", pageable);
    }

    @Test
    void findById_ShouldReturnArtist() {
        stubArtistProjection();
        when(artistRepository.findByIdWithAlbumCount(artistId)).thenReturn(Optional.of(artistProjection));

        ArtistResponseDTO result = artistService.findById(artistId);

        assertNotNull(result);
        assertEquals("Pink Floyd", result.getName());
        verify(artistRepository).findByIdWithAlbumCount(artistId);
    }

    @Test
    void findById_WhenNotFound_ShouldThrowException() {
        when(artistRepository.findByIdWithAlbumCount(artistId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> artistService.findById(artistId));
    }

    @Test
    void create_ShouldSaveAndReturnArtist() {
        stubArtistProjection();
        ArtistRequestDTO request = new ArtistRequestDTO("Pink Floyd", "Progressive Rock", List.of());

        when(artistRepository.saveAndFlush(any(Artist.class))).thenReturn(artist);
        when(artistRepository.findByIdWithAlbumCount(any())).thenReturn(Optional.of(artistProjection));

        ArtistResponseDTO result = artistService.create(request);

        assertNotNull(result);
        assertEquals("Pink Floyd", result.getName());
        verify(artistRepository).saveAndFlush(any(Artist.class));
    }

    @Test
    void update_ShouldUpdateAndReturnArtist() {
        stubArtistProjection();
        ArtistRequestDTO request = new ArtistRequestDTO("Updated Name", "Updated Desc", null);

        when(artistRepository.findById(artistId)).thenReturn(Optional.of(artist));
        when(artistRepository.saveAndFlush(any(Artist.class))).thenReturn(artist);
        when(artistRepository.findByIdWithAlbumCount(artistId)).thenReturn(Optional.of(artistProjection));

        ArtistResponseDTO result = artistService.update(artistId, request);

        assertNotNull(result);
        verify(artistRepository).saveAndFlush(any(Artist.class));
    }
}
