import { useEffect, useRef, useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext"; // Adjust path as needed
import brandLogo from "../assets/images/cardflare_logo.svg"; // Adjust path as needed

const Navbars = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user and logout function from auth context

  const [expanded, setExpanded] = useState(false);
  const navRef = useRef(null);

  // Collapse navbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        expanded &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expanded]);

  const handleLogout = () => {
    logout(); // Call the logout function from your auth context
    navigate("/login"); // Redirect to login page
    setExpanded(false);
  };

  return (
    <Navbar
      expanded={expanded}
      ref={navRef}
      bg="light"
      expand="lg"
      className="navbar mb-3"
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/" onClick={() => setExpanded(false)}>
          <img
            src={brandLogo}
            alt="Brand Logo"
            style={{ maxWidth: "50px" }}
            // className="brand-logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded((prev) => !prev)}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" onClick={() => setExpanded(false)}>
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/create"
              onClick={() => setExpanded(false)}
            >
              Create Card
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/my-cards"
              onClick={() => setExpanded(false)}
            >
              My Cards
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/analytics"
              onClick={() => setExpanded(false)}
            >
              Analytics
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/about"
              onClick={() => setExpanded(false)}
            >
              About
            </Nav.Link>
          </Nav>

          {/* Right-aligned logout button */}
          <Nav>
            {user ? (
              <Button onClick={handleLogout} className="ms-2">
                Logout
              </Button>
            ) : (
              <Nav.Link
                as={NavLink}
                to="/login"
                className="ms-2"
                onClick={() => setExpanded(false)}
              >
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
