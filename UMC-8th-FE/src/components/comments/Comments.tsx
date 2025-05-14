import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { PAGINATION_ORDER } from "../../enums/common";
import { Comment } from "../../types/comments";
import CommentsSkeletionList from "./CommentsSkeletonList";
import usePostComment from "../../hooks/mutations/usePostComment";
import useDeleteComment from "../../hooks/mutations/useDeleteComment";
import useUpdateComment from "../../hooks/mutations/useUpdateComment";

const Comments = () => {
  const { lpid } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [order, setOrder] = useState(PAGINATION_ORDER.desc);
  const [isFetching, setIsFetching] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const myId = Number(localStorage.getItem("userId")); // 본인 ID

const { mutate: postComment, isPending: isPosting } = usePostComment();
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: updateComment } = useUpdateComment();

  useEffect(() => {
    const fetchComments = async () => {
      if (!lpid) {
        setError(true);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError(true);
        setLoading(false);
        return;
      }

      setIsFetching(true);

      try {
        const res = await axios.get(
          `http://localhost:8000/v1/lps/${lpid}/comments`,
          {
            headers: {
              Authorization: `Bearer ${token.replace(/"/g, "")}`,
            },
          }
        );
        setComments(res.data.data.data);
      } catch (error) {
        console.error("API 요청 오류:", error);
        setError(true);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchComments();
  }, [lpid, order]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      postComment({ content: newComment, lpid: Number(lpid) });
      setNewComment("");
    }
  };

  const toggleMenu = (id: number) => {
  console.log("Toggling menu for id:", id);
  setOpenMenuId((prev) => (prev === id ? null : id));
};


  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
    setOpenMenuId(null);
  };

  const handleEditSubmit = (id: number) => {
  if (editContent.trim() && lpid) {
    updateComment({
      commentId: id,
      content: editContent,
      lpid: Number(lpid),
    });
    setEditingId(null);
    setEditContent("");
  }
};

const handleDelete = (id: number) => {
  if (window.confirm("댓글을 삭제하시겠습니까?") && lpid) {
    deleteComment({
      commentId: id,
      lpid: Number(lpid),
    });
  }
};


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

      <form onSubmit={handleCommentSubmit} className="mb-4">
        <input
          className="p-2 border text-black w-full"
          placeholder="댓글을 입력해 주세요."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          disabled={isPosting}
        >
          {isPosting ? "댓글 추가 중..." : "댓글 추가"}
        </button>
      </form>

<ul className="space-y-3">
  {isFetching ? (
    <CommentsSkeletionList count={20} />
  ) : Array.isArray(comments) && comments.length > 0 ? (
    comments.map((comment) => (
      <li key={comment.id} className="bg-gray-600 p-3 rounded relative">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold">{comment.author?.name}</p>
            {editingId === comment.id ? (
              <>
                <textarea
                  className="w-full p-2 text-black"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button
                  onClick={() => handleEditSubmit(comment.id)}
                  className="bg-green-500 px-2 py-1 mt-1 rounded"
                >
                  저장
                </button>
              </>
            ) : (
              <p>{comment.content}</p>
            )}
          </div>

          {comment.author?.id === myId && (
  <div className="relative">
    <button onClick={() => toggleMenu(comment.id)}>⋯</button> 
    {openMenuId === comment.id && (  
      <div className="absolute right-0 mt-2 bg-white text-black border rounded shadow p-2 z-10">
        <button
          className="block w-full text-left hover:bg-gray-100 px-2 py-1"
          onClick={() => handleEdit(comment)}  
        >
          수정
        </button>
        <button
          className="block w-full text-left hover:bg-gray-100 px-2 py-1"
          onClick={() => handleDelete(comment.id)}
        >
          삭제
        </button>
      </div>
    )}
  </div>
)}

        </div>
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
