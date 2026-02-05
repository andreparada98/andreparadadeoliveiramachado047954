-- Artistas
INSERT INTO artist (id, name, description, created_at, updated_at) VALUES 
('58a70d0c-22ad-461a-824c-b674dc68c9e9', 'Serj Tankian', 'Vocalista do System of a Down e artista solo.', NOW(), NOW()),
('e96f4a18-db25-49f4-ae06-f78d3d16e994', 'Mike Shinoda', 'Co-fundador do Linkin Park e Fort Minor.', NOW(), NOW()),
('c7c1f175-a774-40d1-97f8-ce86b861fac6', 'Michel Teló', 'Cantor e compositor sertanejo brasileiro.', NOW(), NOW()),
('72a50d0c-22ad-461a-824c-b674dc68c9e9', 'Guns N’ Roses', 'Banda americana de hard rock formada em 1985.', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Álbuns Serj Tankian
INSERT INTO album (id, title, released_at, created_at, updated_at) VALUES 
('a1a1a1a1-1111-4111-a111-111111111111', 'Harakiri', '2012-07-10 00:00:00', NOW(), NOW()),
('a1a1a1a1-1111-4111-a111-222222222222', 'Black Blooms', '2019-02-01 00:00:00', NOW(), NOW()),
('a1a1a1a1-1111-4111-a111-333333333333', 'The Rough Dog', '2018-01-01 00:00:00', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Álbuns Mike Shinoda
INSERT INTO album (id, title, released_at, created_at, updated_at) VALUES 
('b2b2b2b2-2222-4222-b222-111111111111', 'The Rising Tied', '2005-11-22 00:00:00', NOW(), NOW()),
('b2b2b2b2-2222-4222-b222-222222222222', 'Post Traumatic', '2018-06-15 00:00:00', NOW(), NOW()),
('b2b2b2b2-2222-4222-b222-333333333333', 'Post Traumatic EP', '2018-01-25 00:00:00', NOW(), NOW()),
('b2b2b2b2-2222-4222-b222-444444444444', 'Where’d You Go', '2006-04-14 00:00:00', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Álbuns Michel Teló
INSERT INTO album (id, title, released_at, created_at, updated_at) VALUES 
('c3c3c3c3-3333-4333-c333-111111111111', 'Bem Sertanejo', '2014-01-01 00:00:00', NOW(), NOW()),
('c3c3c3c3-3333-4333-c333-222222222222', 'Bem Sertanejo - O Show (Ao Vivo)', '2017-01-01 00:00:00', NOW(), NOW()),
('c3c3c3c3-3333-4333-c333-333333333333', 'Bem Sertanejo - (1ª Temporada) - EP', '2014-01-01 00:00:00', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Álbuns Guns N’ Roses
INSERT INTO album (id, title, released_at, created_at, updated_at) VALUES 
('d4d4d4d4-4444-4444-d444-111111111111', 'Use Your Illusion I', '1991-09-17 00:00:00', NOW(), NOW()),
('d4d4d4d4-4444-4444-d444-222222222222', 'Use Your Illusion II', '1991-09-17 00:00:00', NOW(), NOW()),
('d4d4d4d4-4444-4444-d444-333333333333', 'Greatest Hits', '2004-03-23 00:00:00', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Vínculos (album_artist)
INSERT INTO album_artist (album_id, artist_id) VALUES 
('a1a1a1a1-1111-4111-a111-111111111111', '58a70d0c-22ad-461a-824c-b674dc68c9e9'),
('a1a1a1a1-1111-4111-a111-222222222222', '58a70d0c-22ad-461a-824c-b674dc68c9e9'),
('a1a1a1a1-1111-4111-a111-333333333333', '58a70d0c-22ad-461a-824c-b674dc68c9e9'),
('b2b2b2b2-2222-4222-b222-111111111111', 'e96f4a18-db25-49f4-ae06-f78d3d16e994'),
('b2b2b2b2-2222-4222-b222-222222222222', 'e96f4a18-db25-49f4-ae06-f78d3d16e994'),
('b2b2b2b2-2222-4222-b222-333333333333', 'e96f4a18-db25-49f4-ae06-f78d3d16e994'),
('b2b2b2b2-2222-4222-b222-444444444444', 'e96f4a18-db25-49f4-ae06-f78d3d16e994'),
('c3c3c3c3-3333-4333-c333-111111111111', 'c7c1f175-a774-40d1-97f8-ce86b861fac6'),
('c3c3c3c3-3333-4333-c333-222222222222', 'c7c1f175-a774-40d1-97f8-ce86b861fac6'),
('c3c3c3c3-3333-4333-c333-333333333333', 'c7c1f175-a774-40d1-97f8-ce86b861fac6'),
('d4d4d4d4-4444-4444-d444-111111111111', '72a50d0c-22ad-461a-824c-b674dc68c9e9'),
('d4d4d4d4-4444-4444-d444-222222222222', '72a50d0c-22ad-461a-824c-b674dc68c9e9'),
('d4d4d4d4-4444-4444-d444-333333333333', '72a50d0c-22ad-461a-824c-b674dc68c9e9')
ON CONFLICT DO NOTHING;

INSERT INTO users (id, name, username, password, created_at, updated_at)
VALUES ('f9a1e2d3-c4b5-4a6b-9c8d-7e6f5a4b3c2d', 'Administrador', 'admin', '$2a$10$4o6q4rf3I.fwraEoBPmpbe6MfofGNbgEisdG40gcOwLzQDMhfw0PG', NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

