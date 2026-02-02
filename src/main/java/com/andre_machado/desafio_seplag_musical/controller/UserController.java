package com.andre_machado.desafio_seplag_musical.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andre_machado.desafio_seplag_musical.domain.dto.UserRequestDTO;
import com.andre_machado.desafio_seplag_musical.domain.dto.UserResponseDTO;
import com.andre_machado.desafio_seplag_musical.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserRequestDTO request) {
        UserResponseDTO response = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
