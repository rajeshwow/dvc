import { Spinner } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext"; // Adjust path to your AuthContext

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // If user is authenticated, render the private route
  // Otherwise, redirect to login page
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
