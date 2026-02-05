package com.andre_machado.desafio_seplag_musical.controller;

import com.andre_machado.desafio_seplag_musical.service.RegionalSyncService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/regional")
@RequiredArgsConstructor
@Tag(name = "Regional", description = "Endpoints para gerenciamento de regionais")
public class RegionalController {

    private final RegionalSyncService regionalSyncService;

    @Operation(summary = "Sincroniza as regionais", description = "Busca as regionais da API externa e sincroniza com o banco local seguindo as regras do edital")
    @PostMapping("/sync")
    public ResponseEntity<Void> sync() {
        regionalSyncService.syncRegionals();
        return ResponseEntity.ok().build();
    }
}
