import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useDeleteAccount from "../hooks/mutations/useDeleteAccount"; // useDeleteAccount 훅 import
import ConfirmModal from "./ConfirmModal"; // ConfirmModal 컴포넌트 import

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { mutate: deleteAccount, isPending } = useDeleteAccount(); // useDeleteAccount 훅을 이용해 계정 삭제 함수 가져오기
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 관리

  // 외부 클릭 시 사이드바 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose(); // 사이드바 닫기
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // 계정 삭제 처리 함수
  const handleDeleteAccount = () => {
    setIsModalOpen(true); // 모달 열기
  };

  // 모달에서 삭제 확인 후 처리
  const handleConfirmDelete = async () => {
    try {
      await deleteAccount(); // 계정 삭제 함수 호출
      setIsModalOpen(false); // 모달 닫기
      onClose(); // 사이드바 닫기
    } catch (error) {
      alert("계정 삭제 실패");
      console.log(error);
    }
  };

  // 모달에서 삭제 취소 후 처리
  const handleCancelDelete = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div
      ref={sidebarRef}
      className={`z-30 w-64 h-full bg-gray-800 text-white p-4 fixed top-0 left-0 transition-transform duration-300 ease-in-out ${
        isOpen ? "transform-none" : "-translate-x-full"
      }`}
    >
      <h2 className="text-2xl font-bold mb-6">메뉴</h2>
      <ul>
        <li>
          <Link to="/search" className="block py-2 px-4 hover:bg-gray-700 rounded">
            찾기
          </Link>
        </li>
        <li>
          <Link to="/my" className="block py-2 px-4 hover:bg-gray-700 rounded">
            마이페이지
          </Link>
        </li>
        <li>
          <button
            onClick={handleDeleteAccount} // 계정 삭제 함수 호출
            className="block py-2 px-4 hover:bg-gray-700 rounded"
            disabled={isPending} // 요청 중에는 버튼 비활성화
          >
            {isPending ? "삭제 중..." : "탈퇴하기"} {/* 요청 중에는 '삭제 중...'으로 변경 */}
          </button>
        </li>
      </ul>

      {/* 모달 열기 */}
      {isModalOpen && (
        <ConfirmModal
          onConfirm={handleConfirmDelete} // 삭제 확인 시 계정 삭제
          onCancel={handleCancelDelete} // 삭제 취소 시 모달 닫기
        />
      )}
    </div>
  );
};

export default Sidebar;
