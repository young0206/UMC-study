import { useState } from "react";
import type { Movie } from "../types/movie";
import MovieDetailModal from "./MovieDetailModal";

interface MovieCardProps {
  movie: Movie;
}
const MovieCard = ({ movie }: MovieCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImage =
    "https://andreaslloyd.dk/wp-content/themes/koji/assets/images/default-fallback-image.png";

  return (
    <>
      <div
        className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-80 overflow-hidden">
          <img
            src={
              movie.poster_path
                ? `${imageBaseUrl}${movie.poster_path}`
                : fallbackImage
            }
            alt={`${movie.title} 포스터`}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
          <div className="absolute right-2 top-2 rounded-md bg-black px-2 py-1 text-sm font-bold text-white">
            {movie.vote_average.toFixed(1)}
          </div>
        </div>
        <div className="p-4 text-center">
          <h3 className="mb-2 text-lg font-bold text-gray-800">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-600">
            {movie.release_date} | {movie.original_language.toUpperCase()}
          </p>
          <p className="mt-2 text-sm text-gray-700">
            {movie.overview.length > 100
              ? `${movie.overview.slice(0, 100)}...`
              : movie.overview}
          </p>
        </div>
      </div>

      {isModalOpen && (
        <MovieDetailModal movie={movie} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default MovieCard;
