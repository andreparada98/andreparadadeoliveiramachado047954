package com.andre_machado.desafio_seplag_musical.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "file")
@Getter
@Setter
public class File extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = true)
    private Long size;

    @Column(nullable = false, length = 255)
    private String mimeType;

    @Column(nullable = false, length = 255)
    private String url;

    @ManyToOne
    @JoinColumn(name = "album_id")
    private Album album;
}
