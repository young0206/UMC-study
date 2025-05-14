import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const { accessToken, userInfo } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    console.log("네비게이션 바 userInfo 변경:", userInfo);
  }, [userInfo]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleSidebar}
            className="absolute top-4 left-4 z-50 text-white px-3 py-2 rounded"
          >
            ☰
          </button>

          <Link
            to="/"
            className="ml-16 text-xl font-bold text-gray-900 dark:text-white"
          >
            SpinningSpinning Dolimpan
          </Link>
          <div className="space-x-6">
            {!accessToken && (
              <>
                <Link
                  to={"/login"}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                >
                  로그인
                </Link>
                <Link
                  to={"/signup"}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                >
                  회원가입
                </Link>
              </>
            )}
            {accessToken && userInfo && (
              <Link
                to={"/my"}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                {userInfo.name} 님, 환영합니다.
              </Link>
            )}
            <Link
              to={"/search"}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            >
              검색
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
