package com.andre_machado.desafio_seplag_musical.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.andre_machado.desafio_seplag_musical.domain.model.Album;
import org.springframework.data.jpa.repository.EntityGraph;

@Repository
public interface AlbumRepository extends JpaRepository<Album, UUID> {

       @EntityGraph(attributePaths = { "artists" })
       Page<Album> findAll(Pageable pageable);

       @EntityGraph(attributePaths = { "artists" })
       Page<Album> findByTitleContainingIgnoreCase(String title, Pageable pageable);

       @EntityGraph(attributePaths = { "artists" })
       @Query("SELECT DISTINCT alb FROM Album alb JOIN alb.artists art WHERE art.id = :artistId")
       Page<Album> findByArtistId(@Param("artistId") UUID artistId, Pageable pageable);

       @Query("SELECT DISTINCT alb FROM Album alb JOIN alb.artists art WHERE art.id = :artistId")
       List<Album> findAllByArtistId(@Param("artistId") UUID artistId);

       @EntityGraph(attributePaths = { "artists" })
       @Query("SELECT DISTINCT alb FROM Album alb JOIN alb.artists art WHERE art.id = :artistId AND LOWER(alb.title) LIKE LOWER(CONCAT('%', :title, '%'))")
       Page<Album> findByArtistIdAndTitleContainingIgnoreCase(@Param("artistId") UUID artistId,
                     @Param("title") String title, Pageable pageable);
}
