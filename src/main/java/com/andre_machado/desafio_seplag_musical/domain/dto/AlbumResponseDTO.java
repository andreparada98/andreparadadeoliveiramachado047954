package com.andre_machado.desafio_seplag_musical.domain.dto;

import java.time.LocalDateTime;
import java.util.List;
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
@Schema(description = "Dados de resposta de um álbum")
public class AlbumResponseDTO {
    @Schema(description = "ID único do álbum")
    private UUID id;

    @Schema(description = "Título do álbum", example = "The Dark Side of the Moon")
    private String title;

    @Schema(description = "Data de lançamento do álbum", example = "1973-03-01T00:00:00")
    private LocalDateTime releasedAt;

    @Schema(description = "Lista de artistas do álbum")
    private List<ArtistResponseDTO> artists;
}

