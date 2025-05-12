import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div
      className={`w-64 h-full bg-gray-800 text-white p-4 fixed top-0 left-0 transition-transform ${
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
