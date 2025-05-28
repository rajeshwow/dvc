import { useEffect, useState } from "react";
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
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import { userAPI } from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validated, setValidated] = useState(false);

  // Validate token on component mount
  useEffect(() => {
    if (!token) {
      setError("Invalid reset link");
      return;
    }

    // Optional: Validate token with backend before showing form
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      // Assuming you have a validateResetToken method in userAPI
      await userAPI.validateResetToken(token);
    } catch (error) {
      setError("Invalid or expired reset link");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (error) setError("");
    if (message) setMessage("");
    if (validated) setValidated(false);
  };

  const validateForm = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setValidated(true);

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = {
        token,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      // Fixed: Added await here
      const response = await userAPI.resetPassword(data);

      setMessage("Password reset successful! Redirecting to login...");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5"
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-dark mb-2">Reset Your Password</h2>
                <p className="text-muted small">
                  Enter your new password below
                </p>
              </div>

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {/* New Password */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">New Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading}
                      required
                      minLength={6}
                      className="pr-5"
                    />
                    <Button
                      variant="link"
                      size="sm"
                      className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted p-2"
                      style={{ zIndex: 10 }}
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      {showPassword ? (
                        <EyeSlash size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </Button>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    Password must be at least 6 characters long.
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Confirm Password */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">
                    Confirm New Password
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={loading}
                      required
                      className="pr-5"
                    />
                    <Button
                      variant="link"
                      size="sm"
                      className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted p-2"
                      style={{ zIndex: 10 }}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      type="button"
                    >
                      {showConfirmPassword ? (
                        <EyeSlash size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </Button>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    Please confirm your password.
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Error Alert */}
                {error && (
                  <Alert variant="danger" className="mb-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                    </div>
                  </Alert>
                )}

                {/* Success Alert */}
                {message && (
                  <Alert variant="success" className="mb-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      {message}
                    </div>
                  </Alert>
                )}

                {/* Submit Button */}
                <div className="d-grid mb-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="fw-medium"
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
                        Resetting Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </div>

                {/* Back to Login Link */}
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => navigate("/login")}
                    className="text-decoration-none p-0"
                    disabled={loading}
                  >
                    Back to Login
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
