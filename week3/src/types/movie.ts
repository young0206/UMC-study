export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  tagline: string;
  runtime: number;
  videos?: {
    results: {
      key: string;
      type: string;
    }[];
  };
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Credit {
  id: number;
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
}
