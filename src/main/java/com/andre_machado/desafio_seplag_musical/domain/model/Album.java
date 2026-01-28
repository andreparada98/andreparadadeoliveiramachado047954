package com.andre_machado.desafio_seplag_musical.domain.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "album")
@Getter
@Setter
public class Album extends BaseEntity {
    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false)
    private LocalDateTime releasedAt;

    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<File> covers = new ArrayList<>();
}
