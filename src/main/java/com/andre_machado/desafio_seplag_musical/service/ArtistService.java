package com.andre_machado.desafio_seplag_musical.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andre_machado.desafio_seplag_musical.domain.dto.ArtistResponseDTO;
import com.andre_machado.desafio_seplag_musical.repository.ArtistRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArtistService {

    private final ArtistRepository artistRepository;

    @Transactional(readOnly = true)
    public List<ArtistResponseDTO> findAll() {
        return artistRepository.findAll()
                .stream()
                .map(artist -> new ArtistResponseDTO(artist.getId(), artist.getName()))
                .collect(Collectors.toList());
    }
}

