import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

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
            onClick={onClose}
            className="block py-2 px-4 hover:bg-gray-700 rounded"
          >
            탈퇴하기
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
