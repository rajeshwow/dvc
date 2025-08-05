// eslint-disable-next-line import/default
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
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
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle forgot password modal
  const handleForgotPassword = () => {
    setForgotEmail(formData.email); // Pre-fill with login email if available
    setForgotError("");
    setForgotSuccess(false);
    setShowForgotModal(true);
  };

  // Handle forgot password form submission
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");

    if (!forgotEmail) {
      setForgotError("Please enter your email address");
      setForgotLoading(false);
      return;
    }

    try {
      // Call forgot password API
      await userAPI.forgotPassword(forgotEmail);
      setForgotSuccess(true);

      // Auto close modal after 3 seconds
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSuccess(false);
        setForgotEmail("");
      }, 3000);
    } catch (err) {
      console.error("Forgot password error:", err);
      setForgotError(
        err.response?.data?.error ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  // Close forgot password modal
  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail("");
    setForgotError("");
    setForgotSuccess(false);
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
          await login(userData);
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
    <>
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
                <div className="text-center my-3">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        const decoded = jwtDecode(
                          credentialResponse.credential
                        );
                        console.log("✅ Google decoded:", decoded);

                        const response = await userAPI.googleLogin(decoded);
                        console.log("✅ Server response:", response);

                        if (response && response.token) {
                          localStorage.setItem("token", response.token);

                          await login({
                            user: response.user,
                            token: response.token,
                          });

                          // ✅ Add slight delay before navigation
                          setTimeout(() => {
                            console.log("Navigating after Google login...");
                            navigate("/my-cards");
                          }, 200); // Slight delay lets AuthContext update
                        } else {
                          console.log("❌ No token in response");
                          setError("No token received from server.");
                        }
                      } catch (err) {
                        console.error("Google Login Error:", err);
                        setError("Google login failed. Please try again.");
                      }
                    }}
                    onError={() => {
                      setError("Google login failed. Please try again.");
                    }}
                  />
                </div>
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  OR
                </div>
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
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none small"
                        onClick={handleForgotPassword}
                        disabled={loading}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="py-2"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={togglePasswordVisibility}
                        disabled={loading}
                        className="border-start-0"
                        style={{ borderColor: "#ced4da" }}
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </Button>
                    </InputGroup>
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

      {/* Forgot Password Modal */}
      <Modal show={showForgotModal} onHide={closeForgotModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {forgotSuccess ? (
            <div className="text-center py-3">
              <div className="text-success mb-3">
                <i
                  className="bi bi-check-circle-fill"
                  style={{ fontSize: "3rem" }}
                ></i>
              </div>
              <h5 className="text-success">Email Sent!</h5>
              <p className="text-muted">
                We've sent a password reset link to{" "}
                <strong>{forgotEmail}</strong>
              </p>
              <p className="small text-muted">
                Please check your inbox and follow the instructions to reset
                your password. This modal will close automatically.
              </p>
            </div>
          ) : (
            <>
              <p className="text-muted mb-3">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>

              {forgotError && (
                <Alert variant="danger" className="mb-3">
                  {forgotError}
                </Alert>
              )}

              <Form onSubmit={handleForgotSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    disabled={forgotLoading}
                    autoFocus
                  />
                </Form.Group>

                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    variant="secondary"
                    onClick={closeForgotModal}
                    disabled={forgotLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Login;
