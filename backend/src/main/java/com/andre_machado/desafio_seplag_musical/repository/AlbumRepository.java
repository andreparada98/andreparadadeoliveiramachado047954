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

@Repository
public interface AlbumRepository extends JpaRepository<Album, UUID> {

       Page<Album> findAll(Pageable pageable);

       Page<Album> findByTitleContainingIgnoreCase(String title, Pageable pageable);

       @Query(value = "SELECT DISTINCT alb.* FROM album alb " +
                     "JOIN album_artist aa ON alb.id = aa.album_id " +
                     "JOIN artist art ON aa.artist_id = art.id " +
                     "WHERE art.id = :artistId " +
                     "ORDER BY alb.updated_at DESC, alb.title ASC", countQuery = "SELECT count(DISTINCT alb.id) FROM album alb "
                                   +
                                   "JOIN album_artist aa ON alb.id = aa.album_id " +
                                   "JOIN artist art ON aa.artist_id = art.id " +
                                   "WHERE art.id = :artistId", nativeQuery = true)
       Page<Album> findByArtistId(@Param("artistId") UUID artistId, Pageable pageable);

       @Query(value = "SELECT DISTINCT alb.* FROM album alb " +
                     "JOIN album_artist aa ON alb.id = aa.album_id " +
                     "JOIN artist art ON aa.artist_id = art.id " +
                     "WHERE art.id = :artistId " +
                     "ORDER BY alb.updated_at DESC, alb.title ASC", nativeQuery = true)
       List<Album> findAllByArtistId(@Param("artistId") UUID artistId);

       @Query(value = "SELECT DISTINCT alb.* FROM album alb " +
                     "JOIN album_artist aa ON alb.id = aa.album_id " +
                     "JOIN artist art ON aa.artist_id = art.id " +
                     "WHERE art.id = :artistId AND LOWER(alb.title) LIKE LOWER(CONCAT('%', :title, '%')) " +
                     "ORDER BY alb.updated_at DESC, alb.title ASC", countQuery = "SELECT count(DISTINCT alb.id) FROM album alb "
                                   +
                                   "JOIN album_artist aa ON alb.id = aa.album_id " +
                                   "JOIN artist art ON aa.artist_id = art.id " +
                                   "WHERE art.id = :artistId AND LOWER(alb.title) LIKE LOWER(CONCAT('%', :title, '%'))", nativeQuery = true)
       Page<Album> findByArtistIdAndTitleContainingIgnoreCase(@Param("artistId") UUID artistId,
                     @Param("title") String title, Pageable pageable);
}
