import type { Movie } from "../types/movie";

interface MovieDetailModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieDetailModal = ({ movie, onClose }: MovieDetailModalProps) => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImage =
    "https://andreaslloyd.dk/wp-content/themes/koji/assets/images/default-fallback-image.png";

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white w-4/5 max-w-5xl rounded-lg overflow-hidden shadow-lg">
        {/* 상단 1/3 영상 부분 */}
        <div className="relative h-80">
          <img
            src={
              movie.backdrop_path
                ? `${imageBaseUrl}${movie.backdrop_path}`
                : fallbackImage
            }
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <h1 className="absolute bottom-4 left-6 text-3xl font-bold text-white drop-shadow-lg">
            {movie.title}
          </h1>
        </div>

        {/* 하단 콘텐츠 */}
        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* 왼쪽 포스터 */}
          <img
            src={
              movie.poster_path
                ? `${imageBaseUrl}${movie.poster_path}`
                : fallbackImage
            }
            alt={`${movie.title} 포스터`}
            className="max-w-[160px] h-auto rounded shadow-md"
          />

          {/* 오른쪽 설명 */}
          <div className="flex-1 text-gray-800">
            <p className="text-lg mb-2">
              <strong className="text-blue-500">
                {movie.vote_average.toFixed(1)}
              </strong>{" "}
              ({movie.vote_count} 평가)
            </p>
            <div>
              <p className="mb-1 text-center">
                <strong>개봉일</strong>
                <p>{movie.release_date}</p>
              </p>
            </div>
            <div>
              <p className="mb-4 text-center">
                <strong>인기도</strong>
                <p>{movie.popularity}</p>
              </p>
            </div>
            <div>
              <p className="mb-4 text-center">
                <strong>줄거리</strong>{" "}
                <p>{movie.overview || "줄거리 정보가 없습니다."}</p>
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pb-6 space-x-2">
          <button
            onClick={() => {
              const query = encodeURIComponent(movie.title);
              window.open(`https://www.imdb.com/find?q=${query}`, "_blank");
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            IMDB에서 검색하기
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
