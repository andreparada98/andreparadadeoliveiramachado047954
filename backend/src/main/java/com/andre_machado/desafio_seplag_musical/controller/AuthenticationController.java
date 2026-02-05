package com.andre_machado.desafio_seplag_musical.controller;

import com.andre_machado.desafio_seplag_musical.domain.dto.AuthenticationDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.LoginResponseDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.RefreshTokenRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.model.User;
import com.andre_machado.desafio_seplag_musical.repository.UserRepository;
import com.andre_machado.desafio_seplag_musical.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")
@Tag(name = "Autenticação", description = "Endpoints para autenticação de usuários")
public class AuthenticationController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private UserRepository userRepository;

    @Operation(summary = "Realiza o login do usuário", description = "Retorna um token JWT e um refresh token")
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.username(), data.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        var user = (User) auth.getPrincipal();
        var token = tokenService.generateToken(user);
        var refreshToken = tokenService.generateRefreshToken(user);

        return ResponseEntity.ok(new LoginResponseDTO(token, refreshToken));
    }

    @Operation(summary = "Renova o token de acesso", description = "Recebe um refresh token e retorna um novo token de acesso e um novo refresh token")
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(@RequestBody RefreshTokenRequestDTO data) {
        var username = tokenService.validateToken(data.refreshToken());
        if (username.isEmpty()) {
            return ResponseEntity.status(401).build();
        }

        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        var newToken = tokenService.generateToken(user);
        var newRefreshToken = tokenService.generateRefreshToken(user);

        return ResponseEntity.ok(new LoginResponseDTO(newToken, newRefreshToken));
    }
}
