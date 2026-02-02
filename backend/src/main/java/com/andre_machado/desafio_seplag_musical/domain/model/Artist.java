package com.andre_machado.desafio_seplag_musical.domain.model;

import java.util.ArrayList;
import java.util.List;

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

    @Column(nullable = true)
    private String description;

    @ManyToMany(mappedBy = "artists")
    private List<Album> albums = new ArrayList<>();
}
