import { THEME, useTheme } from "./context/ThemeProvider";
import clsx from "clsx";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "px-4 py-2 rounded-md transition-all",
        isLightMode
          ? "bg-gray-800 text-white hover:bg-gray-700"
          : "bg-white text-gray-800 hover:bg-gray-100"
      )}
    >
      {isLightMode ? "🌕" : "☀️"}
    </button>
  );
}