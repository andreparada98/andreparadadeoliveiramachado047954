package com.andre_machado.desafio_seplag_musical.domain.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FileResponseDTO {
    private UUID id;
    private String name;
    private Long size;
    private String mimeType;
    private String url;
}

