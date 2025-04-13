import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Credit, Movie } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import YouTube from "react-youtube";

export default function MovieDetailPage() {
  const [credit, setCredit] = useState<Credit | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const { movieId } = useParams<{ movieId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        const details = await axios.get<Movie>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        const credits = await axios.get<Credit>(
          `https://api.themoviedb.org/3/movie/${movieId}/credits`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovie(details.data);
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
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <>
      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      <img
        src={`https://image.tmdb.org/t/p/w200${movie?.poster_path}`}
        alt={`${movie?.title}의 이미지`}
        className=""
      />

      <div className=" justify-center items-center">
        <h2 className="text-lg font-bold leading-snug">{movie?.title}</h2>
        <div>
          {(() => {
            const stars = Math.round(movie?.vote_average || 0);
            const starArray = [];

            for (let i = 0; i < 10; i++) {
              if (i < stars) {
                starArray.push("★");
              } else {
                starArray.push("☆");
              }
            }

            return starArray.map((star, index) => (
              <span key={index}>{star}</span>
            ));
          })()}
        </div>

        <p>{movie?.release_date}</p>
        <p>{movie?.overview}</p>
        <button
          onClick={() => {
            <YouTube
              videoId={movie?.video}
              onEnd={(e) => {
                e.target.stopVideo(0);
              }}
            />;
          }}
        >
          예고편 ▶
        </button>
      </div>

      <h2 className="text-xl font-bold mt-6">감독/출연</h2>

      {!isPending && (
        <div>
          {credit?.cast.map((character) => (
            <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {character.profile_path &&
              character.profile_path !== "null" &&
              character.profile_path !== "" ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${character.profile_path}`}
                  className="h-30"
                />
              ) : (
                <div className="p-5 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  No image
                </div>
              )}
              <p>{character.name}</p>
              <p>{character.character}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
