import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { PAGINATION_ORDER } from "../../enums/common";
import { Comment } from "../../types/comments";
import CommentsSkeletionList from "./CommentsSkeletonList";

const Comments = () => {
  const { LPid } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [order, setOrder] = useState(PAGINATION_ORDER.desc);
  

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError(true);
        setLoading(false);
        return;
      }

      setIsFetching(true);

      try {
        const res = await axios.get(
          `http://localhost:8000/v1/lps/${LPid}/comments`,
          {
            headers: {
              Authorization: `Bearer ${token.replace(/"/g, "")}`,
            },
          }
        );
        setComments(res.data.data.data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchComments();
  }, [LPid, order]);

  if (loading) return <div>불러오는 중...</div>;
  if (error) return <div>댓글을 불러올 수 없습니다.</div>;

  return (
    <div className="bg-gray-700 text-white backdrop-blur-md rounded p-4 mt-5">
      <h3>댓글</h3>
      <div className="flex gap-2 justify-end mb-4">
        <button
          onClick={() => setOrder(PAGINATION_ORDER.desc)}
          className={`px-4 py-2 border rounded ${
            order === PAGINATION_ORDER.desc ? "text-gray-900 bg-white" : ""
          }`}
        >
          최신순
        </button>
        <button
          onClick={() => setOrder(PAGINATION_ORDER.asc)}
          className={`px-4 py-2 border rounded ${
            order === PAGINATION_ORDER.asc ? "text-gray-900 bg-white" : ""
          }`}
        >
          오래된순
        </button>
      </div>

      <input
        className="mb-4 p-2 border text-black w-full"
        placeholder="댓글을 입력해 주세요."
      />

      <ul className="space-y-3">
        {isFetching ? (
          <CommentsSkeletionList count={20} />
        ) : Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment.id} className="bg-gray-600 p-3 rounded">
              <p className="font-semibold">{comment.author?.name}</p>
              <p>{comment.content}</p>
            </li>
          ))
        ) : (
          <li>댓글이 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default Comments;
