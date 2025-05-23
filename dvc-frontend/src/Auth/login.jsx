// eslint-disable-next-line import/default
import { jwtDecode } from "jwt-decode"; // Add JWT decode for token validation
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { userAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Login started");

    // Form validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      console.log("Calling login API...");
      const response = await userAPI.login(formData);
      console.log("Login API response:", response);

      if (response && response.token) {
        // Store token in localStorage
        localStorage.setItem("token", response.token);
        console.log("Token stored in localStorage");

        try {
          // Decode token
          const decodedToken = jwtDecode(response.token);
          console.log("Token decoded, user info:", decodedToken.user);

          // Important: Update auth context
          const userData = {
            user: decodedToken.user || response.user,
            token: response.token,
          };

          // Call login to update auth context
          login(userData);
          console.log("Auth context updated with user data");

          // Short delay before navigation to ensure context updates
          setTimeout(() => {
            console.log("Navigating to /my-cards");
            navigate("/my-cards");
          }, 100);
        } catch (tokenError) {
          console.error("Token decode error:", tokenError);
          setError("Authentication failed. Invalid token received.");
          localStorage.removeItem("token");
        }
      } else {
        setError("No authentication token received");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card className="shadow border-0 rounded-lg">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Please sign in to your account</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <div className="d-flex justify-content-between">
                    <Form.Label>Password</Form.Label>
                    <Link
                      to="/forgot-password"
                      className="small text-decoration-none"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="py-2"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="py-2"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <span className="text-muted">Don't have an account? </span>
                  <Link to="/register" className="text-decoration-none">
                    Sign Up
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
