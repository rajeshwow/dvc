import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext"; // Adjust path as needed

const Navbars = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user and logout function from auth context

  const handleLogout = () => {
    logout(); // Call the logout function from your auth context
    navigate("/login"); // Redirect to login page
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          DVC
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/create">
              Create Card
            </Nav.Link>
            <Nav.Link as={NavLink} to="/my-cards">
              My Cards
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              About
            </Nav.Link>
          </Nav>

          {/* Right-aligned logout button */}
          <Nav>
            {user ? (
              <Button
                variant="outline-primary"
                onClick={handleLogout}
                className="ms-2"
              >
                Logout
              </Button>
            ) : (
              <Nav.Link as={NavLink} to="/login" className="ms-2">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbars;
