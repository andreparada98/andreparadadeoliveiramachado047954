package com.andre_machado.desafio_seplag_musical.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Dados para autenticação")
public record AuthenticationDTO(
        @Schema(description = "Nome de usuário", example = "admin")
        String username,
        @Schema(description = "Senha do usuário", example = "admin123")
        String password
) {
}
