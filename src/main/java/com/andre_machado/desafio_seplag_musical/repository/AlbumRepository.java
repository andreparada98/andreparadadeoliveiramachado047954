package com.andre_machado.desafio_seplag_musical.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.andre_machado.desafio_seplag_musical.domain.model.Album;

@Repository
public interface AlbumRepository extends JpaRepository<Album, UUID> {
}

