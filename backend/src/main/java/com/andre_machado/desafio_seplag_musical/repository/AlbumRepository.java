package com.andre_machado.desafio_seplag_musical.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.andre_machado.desafio_seplag_musical.domain.model.Album;

@Repository
public interface AlbumRepository extends JpaRepository<Album, UUID> {
    Page<Album> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    @Query(value = "SELECT DISTINCT a.* FROM album a " +
           "INNER JOIN album_artist aa ON aa.album_id = a.id " +
           "INNER JOIN artist a2 ON a2.id = aa.artist_id " +
           "WHERE a2.id = :artistId", 
           countQuery = "SELECT COUNT(DISTINCT a.id) FROM album a " +
                        "INNER JOIN album_artist aa ON aa.album_id = a.id " +
                        "WHERE aa.artist_id = :artistId",
           nativeQuery = true)
    Page<Album> findByArtistId(@Param("artistId") UUID artistId, Pageable pageable);

    @Query(value = "SELECT DISTINCT a.* FROM album a " +
           "INNER JOIN album_artist aa ON aa.album_id = a.id " +
           "INNER JOIN artist a2 ON a2.id = aa.artist_id " +
           "WHERE a2.id = :artistId AND LOWER(a.title) LIKE LOWER(CONCAT('%', :title, '%'))",
           countQuery = "SELECT COUNT(DISTINCT a.id) FROM album a " +
                        "INNER JOIN album_artist aa ON aa.album_id = a.id " +
                        "WHERE aa.artist_id = :artistId AND LOWER(a.title) LIKE LOWER(CONCAT('%', :title, '%'))",
           nativeQuery = true)
    Page<Album> findByArtistIdAndTitleContainingIgnoreCase(@Param("artistId") UUID artistId, @Param("title") String title, Pageable pageable);
}

