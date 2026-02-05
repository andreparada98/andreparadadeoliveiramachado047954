package com.andre_machado.desafio_seplag_musical.domain.projection;

import java.util.UUID;

public interface ArtistProjection {
    UUID getId();
    String getName();
    String getDescription();
    Long getAlbumCount();
}


