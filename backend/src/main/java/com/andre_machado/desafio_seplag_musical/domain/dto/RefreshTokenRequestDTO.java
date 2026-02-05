package com.andre_machado.desafio_seplag_musical.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Dados para renovação do token")
public record RefreshTokenRequestDTO(
    @Schema(description = "Refresh token recebido no login")
    String refreshToken
) {
}

