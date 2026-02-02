package com.andre_machado.desafio_seplag_musical.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Dados de resposta de um usuário")
public class UserResponseDTO {
    @Schema(description = "ID único do usuário")
    private UUID id;

    @Schema(description = "Nome completo do usuário", example = "João Silva")
    private String name;

    @Schema(description = "Nome de usuário", example = "joao.silva")
    private String username;
}

