export interface TMDBAdminSearchResult {
  original_title: string;
  TMDB_id: number;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  mediaType: 'tv' | 'movie';
}
