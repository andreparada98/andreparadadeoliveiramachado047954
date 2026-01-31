package com.andre_machado.desafio_seplag_musical.domain.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AlbumResponseDTO {
    private UUID id;
    private String title;
    private LocalDateTime releasedAt;
    private List<ArtistResponseDTO> artists;
}

