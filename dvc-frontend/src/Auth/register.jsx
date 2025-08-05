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

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    // if (!formData.name.trim()) {
    //   newErrors.name = "Name is required";
    // }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccess(false);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create user data object from form data
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      console.log("Registering user:", userData);

      // ADD AWAIT HERE - This was missing!
      const response = await userAPI.register(userData);

      console.log("Registration successful:", response);

      // Show success message
      setSuccess(true);

      // Store token if returned from API
      if (response.token) {
        localStorage.setItem("token", response.token);
        // Update auth context
        login(response.data);
        // Redirect after brief delay to show success message
        setTimeout(() => {
          navigate("/create");
        }, 1500);
      } else {
        // If no token, just show success and redirect to login
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response) {
        // Handle different error cases
        const { data } = err.response;

        if (
          data.error &&
          (data.error.includes("duplicate") ||
            data.error.includes("already exists"))
        ) {
          setErrors({
            ...errors,
            email: "Email already registered",
          });
        } else {
          setServerError(
            data.error ||
              data.message ||
              "Registration failed. Please try again."
          );
        }
      } else if (err.request) {
        // Network error - request was made but no response received
        setServerError(
          "Cannot connect to server. Please check your connection."
        );
      } else {
        // Something else happened
        setServerError("Registration failed. Please try again.");
      }
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
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">
                  Sign up to get started with your digital card
                </p>
              </div>

              {serverError && (
                <Alert variant="danger" className="mb-4">
                  {serverError}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mb-4">
                  Registration successful! Redirecting...
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
                    isInvalid={!!errors.email}
                    disabled={loading}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col span={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        disabled={loading}
                        className="py-2"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Password must be at least 6 characters long
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col span={12}>
                    <Form.Group className="mb-4">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                        disabled={loading}
                        className="py-2"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                      {formData.confirmPassword &&
                        formData.password === formData.confirmPassword &&
                        !errors.confirmPassword && (
                          <div
                            style={{
                              color: "green",
                              fontSize: "0.9rem",
                              marginTop: "4px",
                            }}
                          >
                            ✅ Passwords match
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                </Row>

                {/* Submit Button */}
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
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <span className="text-muted">Already have an account? </span>
                  <Link to="/login" className="text-decoration-none">
                    Sign In
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

export default Register;
