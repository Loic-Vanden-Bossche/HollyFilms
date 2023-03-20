interface TMDBMovie {
  media_type: "movie";
  title: string;
  id: number;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  revenue: number;
  budget: number;
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  runtime: number[];
  translations: {
    translations: {
      iso_3166_1: string;
      data: {
        title: string;
        overview: string;
        tagline: string;
      };
    }[];
  };
  genres: {
    name: string;
  }[];
  production_companies: {
    name: string;
    logo_path: string;
  }[];
  tagline: string;
  credits: {
    cast: {
      character: string;
      name: string;
      profile_path: string;
    }[];
    crew: {
      job: string;
      name: string;
      profile_path: string;
    }[];
  };
  reviews: {
    results: {
      content: string;
      author_details: {
        avatar_path: string;
        username: string;
        rating: number;
      };
    }[];
  };
  videos: {
    results: {
      site: string;
      type: string;
      key: string;
    }[];
  };
}

interface TMDBSeason {
  episode_count: number;
  name: string;
  poster_path: string;
  season_number: number;
  overview: string;
  episodes?: {
    name: string;
    episode_number: number;
    overview: string;
    still_path: string;
    vote_average: number;
    air_date: string;
  }[];
}

interface TMDBTVShow {
  media_type: "tv";
  name: string;
  id: number;
  backdrop_path: string;
  poster_path: string;
  first_air_date: string;
  revenue: number;
  budget: number;
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  episode_run_time: number[];
  translations: {
    translations: {
      iso_3166_1: string;
      data: {
        name: string;
        overview: string;
        tagline: string;
      };
    }[];
  };
  genres: {
    name: string;
  }[];
  production_companies: {
    name: string;
    logo_path: string;
  }[];
  tagline: string;
  created_by: {
    name: string;
    profile_path: string;
  }[];
  credits: {
    cast: {
      character: string;
      name: string;
      profile_path: string;
    }[];
  };
  seasons: TMDBSeason[];
  reviews: {
    results: {
      content: string;
      author_details: {
        avatar_path: string;
        username: string;
        rating: number;
      };
    }[];
  };
  videos: {
    results: {
      site: string;
      type: string;
      key: string;
    }[];
  };
}

interface TMDBSearchResults {
  results: TMDBMedia[];
}

interface TMDBMicroSearchResult {
  original_title: string;
  TMDB_id: number;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  mediaType: "tv" | "movie";
}

type TMDBMedia = TMDBMovie | TMDBTVShow;

export {
  TMDBMovie,
  TMDBTVShow,
  TMDBSeason,
  TMDBSearchResults,
  TMDBMicroSearchResult,
  TMDBMedia,
};
