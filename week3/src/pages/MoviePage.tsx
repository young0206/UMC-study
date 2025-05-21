import { useEffect, useState } from "react";
import axios from "axios";
import { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import { THEME, useTheme } from "../components/context/ThemeProvider";
import clsx from "clsx";

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  // 1. 로딩 상태
  const [isPending, setIsPending] = useState(false);
  // 2. 에러 상태;
  const [isError, setIsError] = useState(false);
  //3. 페이지
  const [page, setPage] = useState(1);
  const { theme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  const { category } = useParams<{
    category: string;
  }>();

  useEffect((): void => {
    const fetchMovies = async (): Promise<void> => {
      setIsPending(true);

      try {
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovies(data.results);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovies();
  }, [page, category]);

  if (isError) {
    return (
      <div className={clsx("p-4", isLightMode ? "text-red-500" : "text-red-400")}>
        <span className="text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <div className={clsx("min-h-screen", isLightMode ? "bg-white" : "1a1a1a")}>
      <div className="flex items-center justify-center gap-6 mt-5">
        <button
          className={clsx(
            "px-6 py-3 rounded-lg shadow-md transition-all duration-200 disabled:cursor-not-allowed",
            isLightMode
              ? "bg-[#dda5e3] text-white hover:bg-[#b2dab1] disabled:bg-gray-300"
              : "bg-[#b2dab1] text-gray-900 hover:bg-[#dda5e3] disabled:bg-gray-600"
          )}
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >{`<`}</button>
        <span className={isLightMode ? "text-gray-900" : "text-white"}>{page} 페이지</span>
        <button
          className={clsx(
            "px-6 py-3 rounded-lg shadow-md transition-all duration-200",
            isLightMode
              ? "bg-[#dda5e3] text-white hover:bg-[#b2dab1]"
              : "bg-[#b2dab1] text-gray-900 hover:bg-[#dda5e3]"
          )}
          onClick={() => setPage((prev) => prev + 1)}
        >{`>`}</button>
      </div>
      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
