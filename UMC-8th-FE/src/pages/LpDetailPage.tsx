import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useUpdateLp from "../hooks/mutations/useUpdateLp";
import Comments from "../components/comments/Comments";
import { Heart } from "lucide-react";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";
import useDeleteLp from "../hooks/mutations/usedeleteLp";
import { queryClient } from "../App";
import { QUERY_KEY } from "../constants/key";

const LpDetailPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const numericLpId = Number(lpid);
  const { accessToken } = useAuth();
  const {
    data: lp,
    isPending,
    isError,
  } = useGetLpDetail({ lpid: numericLpId, queryKey: QUERY_KEY.lps });

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const { data: me } = useGetMyInfo(accessToken);
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();
  const { mutate: deleteLpMutate } = useDeleteLp();
  const { mutate: updateLpMutate } = useUpdateLp();

  useEffect(() => {
    if (lp?.data) {
      setNewTitle(lp.data.title);
      setNewContent(lp.data.content);
    }
  }, [lp?.data]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateLp = () => {
    updateLpMutate(
      {
        lpid: numericLpId,
        title: newTitle,
        content: newContent,
        tags: lp?.data.tags.map(tag => tag.name) || [],
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.lps, numericLpId],
            exact: true,
          });
        },
        onError: (error: Error) => {
          console.error("LP 수정 실패:", error);
          alert("LP 수정에 실패했습니다.");
        },
      }
    );
  };

  if (!lpid || isNaN(numericLpId)) {
    return <>잘못된 접근입니다.</>;
  }

  const isLiked = lp?.data.likes?.some((like) => like.userId === me?.data.id);

  const handleLikeLp = () => {
    likeMutate({ lpid: numericLpId });
  };

  const handleDisLikeLp = () => {
    disLikeMutate({ lpid: numericLpId });
  };

  const handleDeleteLp = () => {
    if (window.confirm("정말로 이 LP를 삭제하시겠습니까?")) {
      deleteLpMutate(
        { lpid: numericLpId },
        {
          onSuccess: () => {
            navigate("/");
          },
          onError: (error) => {
            console.error("LP 삭제 실패:", error);
            alert("LP 삭제에 실패했습니다.");
          },
        }
      );
    }
  };

  if (isPending || isError) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-10">
      <div className="bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md rounded flex flex-col items-center justify-center p-4">
        <h2 className="text-lg font-bold leading-snug">
          {isEditing ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-transparent border-b-2 border-white"
            />
          ) : (
            lp?.data.title
          )}
        </h2>

        {isEditing ? (
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="bg-transparent border-b-2 border-white p-2 w-full"
          />
        ) : (
          <p>{lp?.data.content}</p>
        )}

        <img
          src={lp?.data.thumbnail}
          className="object-cover w-80 h-80 justify-center rounded transition-shadow"
        />

        <div className="flex flex-wrap gap-2 mt-4 mb-4">
          {lp?.data.tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
            >
              #{tag.name}
            </span>
          ))}
        </div>

        <button
          className="gap-2 mb-4"
          onClick={isLiked ? handleDisLikeLp : handleLikeLp}
        >
          <Heart
            color={isLiked ? "red" : "black"}
            fill={isLiked ? "red" : "transparent"}
          />
        </button>

        {isEditing ? (
          <button onClick={handleUpdateLp}>저장</button>
        ) : (
          <div className="flex gap-2">
            <button
              className="bg-white text-black px-4 py-2 rounded whitespace-nowrap"
              onClick={handleEditClick}
            >
              수정
            </button>
            <button
              className="bg-white text-black px-4 py-2 rounded whitespace-nowrap gap-2"
              onClick={handleDeleteLp}
            >
              삭제
            </button>
          </div>
        )}
      </div>
      <Comments />
    </div>
  );
};

export default LpDetailPage;
