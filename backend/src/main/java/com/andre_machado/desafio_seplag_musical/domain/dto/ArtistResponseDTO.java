package com.andre_machado.desafio_seplag_musical.domain.dto;

import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Dados de resposta de um artista")
public class ArtistResponseDTO {
    @Schema(description = "ID único do artista")
    private UUID id;

    @Schema(description = "Nome do artista", example = "Pink Floyd")
    private String name;

    @Schema(description = "Descrição ou biografia do artista", example = "Banda britânica de rock progressivo")
    private String description;
}

