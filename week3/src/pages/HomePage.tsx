import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navber";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default HomePage;
