export interface Artist {
  id: string;
  name: string;
  description?: string;
  albumCount?: number;
}

export interface ArtistFilter {
  name?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

