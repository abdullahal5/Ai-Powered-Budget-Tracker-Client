import { Outlet } from "react-router-dom";
import { Navbar } from "../shared/Navbar";
import { Footer } from "../shared/Footer";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-5 my-24">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
