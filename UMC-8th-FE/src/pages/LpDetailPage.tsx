import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate로 변경
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useUpdateLp from "../hooks/mutations/updateLp";
import useDeleteLp from "../hooks/mutations/deleteLp";
import Comments from "../components/comments/Comments";
import { Heart } from "lucide-react";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";

const LpDetailPage = () => {
  const { lpid } = useParams();
  const numericLpId = Number(lpid);
  const navigate = useNavigate(); // useHistory 대신 사용
  const { accessToken } = useAuth();
  const {
    data: lp,
    isPending,
    isError,
  } = useGetLpDetail({ lpid: numericLpId });
  const { mutate: updateMutate } = useUpdateLp();
  const { mutate: deleteMutate } = useDeleteLp();

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(lp?.data.title || "");
  const [newContent, setNewContent] = useState(lp?.data.content || "");
  const { data: me } = useGetMyInfo(accessToken);
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await updateMutate(numericLpId); // 수정된 내용 API 호출 (필요한 경우 인자 변경)
      setIsEditing(false); // 수정 모드 종료
    } catch (error) {
      console.error("LP 수정 실패:", error);
    }
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

  const handleDeleteClick = async () => {
    try {
      await deleteMutate(numericLpId); // LP 삭제 API 호출
      navigate("/lps"); // LP 삭제 후 목록 페이지로 이동
    } catch (error) {
      console.error("LP 삭제 실패:", error);
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
              onChange={(e) => setNewTitle(e.target.value)} // 수정된 제목 관리
              className="bg-transparent border-b-2 border-white"
            />
          ) : (
            lp?.data.title
          )}
        </h2>

        {isEditing ? (
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)} // 수정된 내용 관리
            className="bg-transparent border-b-2 border-white p-2 w-full"
          />
        ) : (
          <p>{lp?.data.content}</p>
        )}

        <img
          src={lp?.data.thumbnail}
          className="object-cover w-80 h-80 justify-center rounded transition-shadow"
        />

        <div>{lp?.data.content}</div>
        <p className="bg-gray-300 to-transparent backdrop-blur-md rounded">
          {lp?.data.tags?.join(", ")}
        </p>

        <button onClick={isLiked ? handleDisLikeLp : handleLikeLp}>
          <Heart
            color={isLiked ? "red" : "black"}
            fill={isLiked ? "red" : "transparent"}
          />
        </button>

        {isEditing ? (
          <button onClick={handleSaveClick}>저장</button>
        ) : (
          <>
            <button onClick={handleEditClick}>수정</button>
            <button onClick={handleDeleteClick}>삭제</button>
          </>
        )}
      </div>
      <Comments />
    </div>
  );
};

export default LpDetailPage;
