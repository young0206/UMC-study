import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Credit, Movie } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import YouTube from "react-youtube";
import { THEME, useTheme } from "../components/context/ThemeProvider";
import clsx from "clsx";

export default function MovieDetailPage() {
  const [credit, setCredit] = useState<Credit | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const { theme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  const { movieId } = useParams<{ movieId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        const [details, credits, videos] = await Promise.all([
          axios.get<Movie>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
          axios.get<Credit>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }),
        ]);

        setMovie({ ...details.data, videos: videos.data });
        setCredit(credits.data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [movieId]);

  if (isError) {
    return (
      <div
        className={clsx("p-4", isLightMode ? "text-red-500" : "text-red-400")}
      >
        <span className="text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  if (!movie) return null;

  const trailerKey = movie.videos?.results.find(
    (video) => video.type === "Trailer"
  )?.key;

  return (
    <div
      className={clsx("min-h-screen", isLightMode ? "bg-white" : "bg-gray-900")}
    >
      {/* 영화 상세 헤더 섹션 */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="flex gap-8 items-end">
              {trailerKey && (
                <div className="aspect-video">
                  <YouTube
                    videoId={trailerKey}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 0,
                      },
                    }}
                    className="w-full h-full rounded-lg"
                  />
                </div>
              )}
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                <p className="text-lg mb-4">{movie.tagline}</p>
                <div className="flex gap-4 mb-4">
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span>{movie.release_date}</span>
                  <span>{movie.runtime}분</span>
                </div>
                <p className="text-gray-200 max-w-2xl">{movie.overview}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 영화 상세 내용 */}
      <div className="container mx-auto px-4 py-8">
        {/* 출연진 섹션 */}
        <div>
          <h2
            className={clsx(
              "text-2xl font-bold mb-4",
              isLightMode ? "text-gray-900" : "text-white"
            )}
          >
            출연진
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {credit?.cast.map((character) => (
              <div
                key={character.id}
                className={clsx(
                  "rounded-lg overflow-hidden",
                  isLightMode ? "bg-white shadow-md" : "bg-gray-800"
                )}
              >
                {character.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${character.profile_path}`}
                    alt={character.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                    <span
                      className={
                        isLightMode ? "text-gray-600" : "text-gray-400"
                      }
                    >
                      No image
                    </span>
                  </div>
                )}
                <div className="p-3">
                  <p
                    className={clsx(
                      "font-semibold",
                      isLightMode ? "text-gray-900" : "text-white"
                    )}
                  >
                    {character.name}
                  </p>
                  <p
                    className={clsx(
                      "text-sm",
                      isLightMode ? "text-gray-600" : "text-gray-400"
                    )}
                  >
                    {character.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
