import ElegantFooter from "./footer";
import Navbars from "./Navbar";

const LayoutComponent = ({ children }) => {
  return (
    <div className="layout">
      {/* Optional: Add navbar here too */}
      <Navbars />

      {/* Page content */}
      <main className="main-content">{children}</main>

      {/* Footer on all pages */}
      <ElegantFooter />
    </div>
  );
};

export default LayoutComponent;
