import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Credit, MovieDetailResponse } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;

  const {
    isPending,
    isError,
    data: movie,
  } = useCustomFetch<MovieDetailResponse>(url, "en-US");

  const [credit, setCredit] = useState<Credit | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const credit = await axios.get<Credit>(
          `https://api.themoviedb.org/3/movie/${movieId}/credits`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setCredit(credit.data);
      } catch {}
    };
    fetchCredits();
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
        <p>{movie?.vote_average}</p>
        <p>{movie?.release_date}</p>
        <p>{movie?.overview}</p>
      </div>

      <h2 className="text-xl font-bold mt-6">감독/출연</h2>

      {!isPending && (
        <div>
          {credit?.cast.map((character) => (
            <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              <img
                src={`https://image.tmdb.org/t/p/w200${character.profile_path}`}
                className="h-30"
              />
              <p>{character.name}</p>
              <p>{character.character}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
