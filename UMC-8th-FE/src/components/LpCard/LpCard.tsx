import { useState } from "react";
import { Lp } from "../../types/lp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface LpCardProps {
  lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const handleClick = () => {
    if (!accessToken) {
      const confirmLogin = window.confirm("로그인이 필요한 서비스입니다. 로그인을 해 주세요.");
      if (confirmLogin) {
        navigate("/login");
      }
      return;
    }

    navigate(`/lp/${lp.id}`);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      <img src={lp.thumbnail} className="object-cover w-80 h-80" />

      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md flex flex-col items-center justify-center text-white p-4">
          <h2 className="text-lg font-bold leading-snug">{lp.title}</h2>
          <p className="text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5">
            {new Date(lp.updatedAt).toLocaleDateString("ko-KR")}
          </p>
          <p className="text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5">
            좋아요 {lp.likes.length}개
          </p>
        </div>
      )}
    </div>
  );
};

export default LpCard;
