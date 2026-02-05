package com.andre_machado.desafio_seplag_musical.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "regional")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Regional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSequencial;

    @Column(name = "id")
    private Integer id;

    @Column(name = "nome", length = 200)
    private String nome;

    @Column(name = "ativo")
    private Boolean ativo = true;
}

