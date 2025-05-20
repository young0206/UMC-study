import { useState } from "react";
import { Movie } from "../types/movie";
import { useNavigate } from "react-router-dom";
import { THEME, useTheme } from "./context/ThemeProvider";
import clsx from "clsx";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className={clsx(
        "relative rounded-xl shadow-lg overflow-hidden cursor-pointer w-44 transition-transform duration-300 hover:scale-105",
        isLightMode ? "bg-white" : "bg-gray-800"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={`${movie.title}의 이미지`}
        className="w-full h-auto"
      />

      {isHovered && (
        <div
          className={clsx(
            "absolute inset-0 flex flex-col justify-center items-center p-4",
            isLightMode
              ? "bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md"
              : "bg-gradient-to-t from-gray-900/50 to-transparent backdrop-blur-md"
          )}
        >
          <h2 className={clsx("text-lg font-bold leading-snug", isLightMode ? "text-white" : "text-gray-100")}>
            {movie.title}
          </h2>
          <p className={clsx("text-sm leading-relaxed mt-2 line-clamp-5", isLightMode ? "text-gray-200" : "text-gray-300")}>
            {movie.overview}
          </p>
        </div>
      )}
    </div>
  );
}
