import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PAGINATION_ORDER } from "../../enums/common";
import { Comment } from "../../types/comments";
import CommentsSkeletionList from "./CommentsSkeletonList";
import usePostComment from "../../hooks/mutations/usePostComment";
import useDeleteComment from "../../hooks/mutations/useDeleteComment";
import useUpdateComment from "../../hooks/mutations/useUpdateComment";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getComments } from "../../apis/comments";
import { QUERY_KEY } from "../../constants/key";

const Comments = () => {
  const { lpid } = useParams();
  const { accessToken } = useAuth();
  const numericLpId = Number(lpid);
  const [order, setOrder] = useState(PAGINATION_ORDER.desc);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [myId, setMyId] = useState<number | null>(null);

  const { data: commentsData, isPending, isError } = useQuery({
    queryKey: [QUERY_KEY.comments, numericLpId, order],
    queryFn: () => getComments({ lpid: numericLpId, order }),
  });

  const { mutate: postComment, isPending: isPosting } = usePostComment();
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: updateComment } = useUpdateComment();

  // 사용자 ID 가져오기
  useEffect(() => {
    const fetchMyInfo = async () => {
      if (!accessToken) return;
      
      try {
        const response = await fetch("http://localhost:8000/v1/users/me", {
          headers: {
            Authorization: `Bearer ${accessToken.replace(/"/g, "")}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('사용자 정보를 가져오는데 실패했습니다.');
        }
        
        const data = await response.json();
        if (data?.data?.id) {
          setMyId(data.data.id);
        }
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
      }
    };

    fetchMyInfo();
  }, [accessToken]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      postComment(
        { content: newComment, lpid: numericLpId },
        {
          onSuccess: () => {
            setNewComment("");
          },
          onError: (error) => {
            console.error("댓글 작성 실패:", error);
            alert("댓글 작성에 실패했습니다.");
          }
        }
      );
    }
  };

  const toggleMenu = (id: number) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
    setOpenMenuId(null);
  };

  const handleEditSubmit = (id: number) => {
    if (editContent.trim() && lpid) {
      updateComment(
        {
          commentId: id,
          content: editContent,
          lpid: numericLpId,
        },
        {
          onSuccess: () => {
            setEditingId(null);
            setEditContent("");
          },
          onError: (error) => {
            console.error("댓글 수정 실패:", error);
            alert("댓글 수정에 실패했습니다.");
          }
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("댓글을 삭제하시겠습니까?") && lpid) {
      deleteComment(
        {
          commentId: id,
          lpid: numericLpId,
        },
        {
          onError: (error) => {
            console.error("댓글 삭제 실패:", error);
            alert("댓글 삭제에 실패했습니다.");
          }
        }
      );
    }
  };

  if (isPending) return <div>불러오는 중...</div>;
  if (isError) return <div>댓글을 불러올 수 없습니다.</div>;

  const comments = commentsData?.data.data || [];

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
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 border text-black"
            placeholder="댓글을 입력해 주세요."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="bg-white text-black px-4 py-2 rounded whitespace-nowrap"
            disabled={isPosting}
          >
            {isPosting ? "댓글 추가 중..." : "댓글 추가"}
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {comments.length > 0 ? (
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
                        className="bg-white text-black px-2 py-1 mt-1 rounded"
                      >
                        저장
                      </button>
                    </>
                  ) : (
                    <p>{comment.content}</p>
                  )}
                </div>

                {myId && comment.author?.id === myId && (
                  <div className="relative">
                    <button 
                      onClick={() => toggleMenu(comment.id)}
                      className="text-white hover:text-gray-300"
                    >
                      ⋯
                    </button>
                    {openMenuId === comment.id && (
                      <div className="absolute right-0 mt-2 bg-white text-black border rounded shadow p-2 z-10">
                        <button
                          className="block w-full text-center hover:bg-gray-100 px-2 py-1 whitespace-nowrap"
                          onClick={() => handleEdit(comment)}
                        >
                          수정
                        </button>
                        <button
                          className="block w-full text-center hover:bg-gray-100 px-2 py-1 whitespace-nowrap"
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
