package com.andre_machado.desafio_seplag_musical.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "artist")
@Getter
@Setter
public class Artist extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String name;
}
