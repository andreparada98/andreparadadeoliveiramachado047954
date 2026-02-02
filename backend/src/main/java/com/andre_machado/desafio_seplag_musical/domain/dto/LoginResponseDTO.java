package com.andre_machado.desafio_seplag_musical.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Resposta de login bem-sucedido")
public record LoginResponseDTO(
        @Schema(description = "Token JWT para autenticação nas demais requisições")
        String token
) {
}
