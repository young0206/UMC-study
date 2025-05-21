import { NavLink } from "react-router-dom";
import clsx from "clsx";
import ThemeToggleButton from "./ThemeToggleButton";
import { THEME, useTheme } from "./context/ThemeProvider";

const LINKS = [
  { to: "/", label: "홈" },
  { to: "/movies/popular", label: "인기 영화" },
  { to: "/movies/now_playing", label: "상영 중" },
  { to: "/movies/top_rated", label: "평점 높은" },
  { to: "/movies/upcoming", label: "개봉 예정" },
];

export const Navbar = () => {
  const { theme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  return (
    <div className={clsx("flex gap-3 p-4", isLightMode ? "bg-white" : "1a1a1a")}>
      {LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => {
            return clsx(
              isActive ? "text-[#b2dab1] font-bold" : "text-gray-500",
              isLightMode ? "hover:text-black" : "hover:text-white"
            );
          }}
        >
          {label}
        </NavLink>
      ))}
      <div className="ml-auto">
        <ThemeToggleButton />
      </div>
    </div>
  );
};
