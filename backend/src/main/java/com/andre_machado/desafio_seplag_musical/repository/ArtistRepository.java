package com.andre_machado.desafio_seplag_musical.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.andre_machado.desafio_seplag_musical.domain.model.Artist;

import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistResponseDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, UUID> {
    
    @Query("SELECT new com.andre_machado.desafio_seplag_musical.domain.dto.ArtistResponseDTO(a.id, a.name, a.description, COUNT(alb)) " +
           "FROM Artist a LEFT JOIN a.albums alb " +
           "GROUP BY a.id, a.name, a.description")
    Page<ArtistResponseDTO> findAllWithAlbumCount(Pageable pageable);

    @Query("SELECT new com.andre_machado.desafio_seplag_musical.domain.dto.ArtistResponseDTO(a.id, a.name, a.description, COUNT(alb)) " +
           "FROM Artist a LEFT JOIN a.albums alb " +
           "WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%')) " +
           "GROUP BY a.id, a.name, a.description")
    Page<ArtistResponseDTO> findByNameContainingIgnoreCaseWithAlbumCount(@Param("name") String name, Pageable pageable);

    @Query("SELECT new com.andre_machado.desafio_seplag_musical.domain.dto.ArtistResponseDTO(a.id, a.name, a.description, COUNT(alb)) " +
           "FROM Artist a LEFT JOIN a.albums alb " +
           "WHERE a.id = :id " +
           "GROUP BY a.id, a.name, a.description")
    Optional<ArtistResponseDTO> findByIdWithAlbumCount(@Param("id") UUID id);
}
