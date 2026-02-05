DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='artist' AND column_name='description') THEN
        ALTER TABLE artist ADD COLUMN description TEXT;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS album_artist (
    album_id UUID NOT NULL,
    artist_id UUID NOT NULL,
    PRIMARY KEY (album_id, artist_id),
    CONSTRAINT fk_album_artist_album FOREIGN KEY (album_id) REFERENCES album(id) ON DELETE CASCADE,
    CONSTRAINT fk_album_artist_artist FOREIGN KEY (artist_id) REFERENCES artist(id) ON DELETE CASCADE
);
