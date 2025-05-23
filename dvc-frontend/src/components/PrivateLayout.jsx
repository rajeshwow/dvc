import { Outlet } from "react-router-dom";
import Navbars from "./Navbar";

const PrivateLayout = () => (
  <>
    <Navbars />
    <main className="p-6">
      <Outlet />
    </main>
  </>
);

export default PrivateLayout;
