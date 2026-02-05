package com.andre_machado.desafio_seplag_musical.domain.dto;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlbumFilterDTO {
    private String title;
    private UUID artistId;
}

