import { Outlet } from "react-router-dom";
import Navbars from "./Navbar";

const PublicLayout = () => (
  <>
    <Navbars />
    <main className="p-6">
      <Outlet />
    </main>
  </>
);

export default PublicLayout;
