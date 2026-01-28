CREATE TABLE artist (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE album (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    title VARCHAR(255) NOT NULL,
    released_at TIMESTAMP NOT NULL
);

CREATE TABLE file (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    name VARCHAR(255) NOT NULL,
    size BIGINT,
    mime_type VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    album_id UUID,
    CONSTRAINT fk_album FOREIGN KEY (album_id) REFERENCES album(id) ON DELETE CASCADE
);

