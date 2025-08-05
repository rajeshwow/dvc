import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { cardAPI } from "../services/api";
import { themes } from "../utils/utilities";

const CardEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Get card ID from URL

  const [validationErrors, setValidationErrors] = useState({});

  // Add this validation function
  const validatePersonalInfo = () => {
    const errors = {};

    // Full Name validation
    if (!cardData.name || cardData.name.trim() === "") {
      errors.name = "Full name is required";
    } else if (cardData.name.trim().length < 2) {
      errors.name = "Full name must be at least 2 characters";
    } else if (cardData.name.trim().length > 50) {
      errors.name = "Full name must be less than 50 characters";
    }

    // Job Title validation
    if (cardData.title && cardData.title.length > 50) {
      errors.title = "Job title must be less than 50 characters";
    }

    // Company validation
    if (cardData.company && cardData.company.length > 100) {
      errors.company = "Company name must be less than 100 characters";
    }

    // Email validation
    if (cardData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cardData.email)) {
        errors.email = "Please enter a valid email address";
      } else if (cardData.email.length > 100) {
        errors.email = "Email must be less than 100 characters";
      }
    }

    // Phone validation
    if (cardData.phone) {
      const phoneRegex = /^[+]?[\d\s\-()]{9,13}$/;
      if (!phoneRegex.test(cardData.phone)) {
        errors.phone = "Please enter a valid phone number";
      } else if (cardData.phone.length < 9) {
        errors.phone = "Phone number must be at least 9 characters";
      } else if (cardData.phone.length > 13) {
        errors.phone = "Phone number must be less than 13 characters";
      }
    }

    // Website validation
    if (cardData.website) {
      const urlRegex = /^https?:\/\/.+\..+/;
      if (!urlRegex.test(cardData.website)) {
        errors.website =
          "Please enter a valid website URL (http:// or https://)";
      } else if (cardData.website.length > 200) {
        errors.website = "Website URL must be less than 200 characters";
      }
    }

    // Address validation
    if (cardData.address && cardData.address.length > 200) {
      errors.address = "Address must be less than 200 characters";
    }

    // Bio validation
    if (cardData.bio && cardData.bio.length > 100) {
      errors.bio = "Bio must be less than 100 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add this function to handle phone input
  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    // Only allow digits, spaces, dashes, parentheses, and plus sign
    const phoneValue = value.replace(/[^+\d\s\-()]/g, "");

    setCardData((prev) => ({
      ...prev,
      [name]: phoneValue,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Card data state
  const [cardData, setCardData] = useState({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    bio: "",
    // Social links
    linkedin: "",
    twitter: "",
    instagram: "",
    github: "",
    // Card style options
    theme: "blue",
    fontStyle: "sans-serif",
    logoUrl: "",
    // Background options
    backgroundType: "color",
    backgroundImage: "",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // Font options
  const fonts = [
    { id: "sans-serif", name: "Sans Serif" },
    { id: "serif", name: "Serif" },
    { id: "monospace", name: "Monospace" },
  ];

  // Background image options
  const backgroundOptions = [
    {
      id: "gradient1",
      name: "Blue Gradient",
      url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&auto=format&fit=crop",
    },
    {
      id: "gradient2",
      name: "Purple Gradient",
      url: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=600&auto=format&fit=crop",
    },
    {
      id: "abstract1",
      name: "Geometric",
      url: "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=600&auto=format&fit=crop",
    },
    {
      id: "abstract2",
      name: "Soft Waves",
      url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&auto=format&fit=crop",
    },
    {
      id: "pattern1",
      name: "Minimal Pattern",
      url: "https://images.unsplash.com/photo-1554147090-e1221a04a025?w=600&auto=format&fit=crop",
    },
  ];

  // Load existing card data
  useEffect(() => {
    const fetchCard = async () => {
      if (!id) {
        setError("Card ID is required");
        setInitialLoading(false);
        return;
      }

      try {
        console.log("Fetching card data for ID:", id);
        const data = await cardAPI.getCard(id);
        console.log("Fetched card data:", data);

        // Check if user owns this card
        // if (data._id !== user?._id) {
        //   setError("You don't have permission to edit this card");
        //   setInitialLoading(false);
        //   return;
        // }

        // Populate form with existing data
        setCardData({
          name: data.name || "",
          title: data.title || "",
          company: data.company || "",
          email: data.email || "",
          phone: data.phone || "",
          website: data.website || "",
          address: data.address || "",
          bio: data.bio || "",
          linkedin: data.linkedin || "",
          twitter: data.twitter || "",
          instagram: data.instagram || "",
          github: data.github || "",
          theme: data.theme || "blue",
          fontStyle: data.fontStyle || "sans-serif",
          logoUrl: data.logoUrl || "",
          backgroundType: data.backgroundType || "color",
          backgroundImage: data.backgroundImage || "",
        });
      } catch (err) {
        console.error("Error fetching card:", err);
        setError("Failed to load card data. Please try again.");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCard();
  }, [id, user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle theme selection
  const handleThemeSelect = (themeId) => {
    setCardData((prev) => ({
      ...prev,
      theme: themeId,
    }));
  };

  // Handle font selection
  const handleFontSelect = (fontId) => {
    setCardData((prev) => ({
      ...prev,
      fontStyle: fontId,
    }));
  };

  // Handle background type toggle
  const handleBackgroundTypeChange = (type) => {
    setCardData((prev) => ({
      ...prev,
      backgroundType: type,
    }));
  };

  // Handle background image selection
  const handleBackgroundImageSelect = (imageUrl) => {
    setCardData((prev) => ({
      ...prev,
      backgroundImage: imageUrl,
    }));
  };

  // Save card data
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!cardData?.name) {
      setError("Please fill required fields.");
      setLoading(false);
      return;
    }

    try {
      console.log("Updating card with data:", cardData);

      const response = await cardAPI.updateCard(id, cardData);
      console.log("Update response:", response);

      setSuccess(true);
      setTimeout(() => {
        navigate(`/view/${id}`);
      }, 1500);
    } catch (err) {
      console.error("Error updating card:", err);
      setError(
        err.response?.data?.error || "Failed to update card. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Get the selected theme object
  const selectedTheme =
    themes.find((theme) => theme.id === cardData.theme) || themes[0];

  // Preview component
  const CardPreview = () => {
    const theme = themes.find((t) => t.id === cardData.theme) || themes[0];

    const cardHeaderStyle =
      cardData.backgroundType === "image" && cardData.backgroundImage
        ? {
            height: "120px",
            background: `url(${cardData.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
        : {
            height: "120px",
            background: theme.primary,
          };

    return (
      <Card
        className="shadow border-0 mb-4"
        style={{
          fontFamily: cardData.fontStyle,
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <div style={cardHeaderStyle}></div>

        <div className="position-relative px-3 text-center">
          <div
            className="rounded-circle bg-white d-flex align-items-center justify-content-center border shadow-sm"
            style={{
              width: "100px",
              height: "100px",
              position: "absolute",
              top: "-50px",
              left: "50%",
              transform: "translateX(-50%)",
              overflow: "hidden",
            }}
          >
            {cardData.logoUrl ? (
              <img
                src={cardData.logoUrl}
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  fontSize: "2rem",
                  color: theme.primary,
                }}
              >
                {cardData.name ? cardData.name.charAt(0).toUpperCase() : "C"}
              </span>
            )}
          </div>
        </div>

        <Card.Body className="pt-5 mt-4 text-center">
          <h3 className="fw-bold mb-1">{cardData.name || "Your Name"}</h3>
          <p className="text-muted mb-1">{cardData.title || "Job Title"}</p>
          <p className="mb-3">{cardData.company || "Company Name"}</p>

          {cardData.bio && <p className="small mb-3">{cardData.bio}</p>}

          <div className="d-flex justify-content-center gap-2 flex-wrap mb-3">
            {cardData.email && (
              <Button size="sm" variant="outline-primary">
                <i className="bi bi-envelope me-1"></i> Email
              </Button>
            )}
            {cardData.phone && (
              <Button size="sm" variant="outline-primary">
                <i className="bi bi-telephone me-1"></i> Call
              </Button>
            )}
            {cardData.website && (
              <Button size="sm" variant="outline-primary">
                <i className="bi bi-globe me-1"></i> Website
              </Button>
            )}
          </div>

          <div className="d-flex justify-content-center gap-3 my-3">
            {cardData.linkedin && (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "32px",
                  height: "32px",
                  background: theme.primary,
                  color: "white",
                }}
              >
                <i className="bi bi-linkedin"></i>
              </div>
            )}
            {cardData.twitter && (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "32px",
                  height: "32px",
                  background: theme.primary,
                  color: "white",
                }}
              >
                <i className="bi bi-twitter"></i>
              </div>
            )}
            {cardData.github && (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "32px",
                  height: "32px",
                  background: theme.primary,
                  color: "white",
                }}
              >
                <i className="bi bi-github"></i>
              </div>
            )}
            {cardData.instagram && (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "32px",
                  height: "32px",
                  background: theme.primary,
                  color: "white",
                }}
              >
                <i className="bi bi-instagram"></i>
              </div>
            )}
          </div>

          {cardData.address && (
            <p className="text-muted small mt-3 mb-0">
              <i className="bi bi-geo-alt me-1"></i> {cardData.address}
            </p>
          )}
        </Card.Body>
      </Card>
    );
  };

  // Loading state
  if (initialLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading card data...</p>
      </Container>
    );
  }

  // Error state
  if (error && !cardData.name) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={12} className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold">Edit Your Card</h2>
              <p className="text-muted">
                Update your information and customize your card's appearance.
              </p>
            </div>
            <Button
              variant="outline-secondary"
              onClick={() => navigate(`/view/${id}`)}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Card
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {success && (
            <Alert variant="success">
              Card updated successfully! Redirecting to view your card...
            </Alert>
          )}
        </Col>
      </Row>

      <Row>
        {/* Form Section */}
        <Col lg={8}>
          <Card className="shadow border-0 mb-4">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                <Tab eventKey="personal" title="Personal Info">
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Full Name <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={cardData.name}
                            onChange={handleChange}
                            required={true}
                            placeholder="Enter your full name"
                            isInvalid={!!validationErrors.name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Job Title</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={cardData.title}
                            onChange={handleChange}
                            placeholder="Enter your job title"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Company</Form.Label>
                      <Form.Control
                        type="text"
                        name="company"
                        value={cardData.company}
                        onChange={handleChange}
                        placeholder="Enter your company name"
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={cardData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            isInvalid={!!validationErrors.email}
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={cardData.phone}
                            onChange={handlePhoneChange}
                            placeholder="Enter your phone number"
                            isInvalid={!!validationErrors.phone}
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.phone}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Website</Form.Label>
                      <Form.Control
                        type="url"
                        name="website"
                        value={cardData.website}
                        onChange={handleChange}
                        placeholder="Enter your website URL"
                        isInvalid={!!validationErrors.website}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.website}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={cardData.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Bio/About</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="bio"
                        value={cardData.bio}
                        onChange={handleChange}
                        placeholder="Brief description about yourself"
                        isInvalid={!!validationErrors.bio}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.bio}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        {cardData.bio
                          ? `${cardData.bio.length}/100 characters`
                          : "0/100 characters"}
                      </Form.Text>
                    </Form.Group>
                  </Form>
                </Tab>

                <Tab eventKey="social" title="Social Links">
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>LinkedIn</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-linkedin"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="url"
                          name="linkedin"
                          value={cardData.linkedin}
                          onChange={handleChange}
                          placeholder="LinkedIn profile URL"
                        />
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Twitter</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-twitter"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="url"
                          name="twitter"
                          value={cardData.twitter}
                          onChange={handleChange}
                          placeholder="Twitter profile URL"
                        />
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Instagram</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-instagram"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="url"
                          name="instagram"
                          value={cardData.instagram}
                          onChange={handleChange}
                          placeholder="Instagram profile URL"
                        />
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>GitHub</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-github"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="url"
                          name="github"
                          value={cardData.github}
                          onChange={handleChange}
                          placeholder="GitHub profile URL"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Form>
                </Tab>

                <Tab eventKey="design" title="Design">
                  <Form>
                    {/* Background Type Selection */}
                    <Form.Group className="mb-4">
                      <Form.Label>Background Type</Form.Label>
                      <div>
                        <ToggleButtonGroup
                          type="radio"
                          name="backgroundType"
                          value={cardData.backgroundType}
                          onChange={handleBackgroundTypeChange}
                          className="w-100 mb-3"
                        >
                          <ToggleButton
                            id="background-color"
                            value="color"
                            variant={
                              cardData.backgroundType === "color"
                                ? "primary"
                                : "outline-primary"
                            }
                          >
                            <i className="bi bi-paint-bucket me-2"></i>
                            Solid Color
                          </ToggleButton>
                          <ToggleButton
                            id="background-image"
                            value="image"
                            variant={
                              cardData.backgroundType === "image"
                                ? "primary"
                                : "outline-primary"
                            }
                          >
                            <i className="bi bi-image me-2"></i>
                            Background Image
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </div>
                    </Form.Group>

                    {/* Show theme colors if 'color' is selected */}
                    {cardData.backgroundType === "color" && (
                      <Form.Group className="mb-4">
                        <Form.Label>Card Theme Color</Form.Label>
                        <div className="d-flex flex-wrap gap-2">
                          {themes.map((theme) => (
                            <div
                              key={theme.id}
                              onClick={() => handleThemeSelect(theme.id)}
                              style={{
                                width: "50px",
                                height: "50px",
                                backgroundColor: theme.primary,
                                borderRadius: "8px",
                                cursor: "pointer",
                                border:
                                  cardData.theme === theme.id
                                    ? "3px solid #000"
                                    : "3px solid transparent",
                              }}
                              title={theme.name}
                            ></div>
                          ))}
                        </div>
                      </Form.Group>
                    )}

                    {/* Show background images if 'image' is selected */}
                    {cardData.backgroundType === "image" && (
                      <Form.Group className="mb-4">
                        <Form.Label>Select Background Image</Form.Label>
                        <Row className="g-2">
                          {backgroundOptions.map((bg) => (
                            <Col xs={6} md={4} key={bg.id}>
                              <div
                                className="card h-100"
                                onClick={() =>
                                  handleBackgroundImageSelect(bg.url)
                                }
                                style={{
                                  cursor: "pointer",
                                  border:
                                    cardData.backgroundImage === bg.url
                                      ? "3px solid #007bff"
                                      : "1px solid #dee2e6",
                                }}
                              >
                                <img
                                  src={bg.url}
                                  alt={bg.name}
                                  className="card-img-top"
                                  style={{
                                    height: "120px",
                                    objectFit: "cover",
                                  }}
                                />
                                <div className="card-body p-2">
                                  <p className="card-text small text-center">
                                    {bg.name}
                                  </p>
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>

                        <Form.Label className="mt-3">
                          Or Enter Custom Image URL
                        </Form.Label>
                        <Form.Control
                          type="url"
                          name="backgroundImage"
                          value={cardData.backgroundImage}
                          onChange={handleChange}
                          placeholder="Enter image URL"
                          className="mb-2"
                        />
                        <Form.Text className="text-muted">
                          Provide a direct link to an image for the card
                          background
                        </Form.Text>
                      </Form.Group>
                    )}

                    <Form.Group className="mb-4">
                      <Form.Label>Font Style</Form.Label>
                      <div className="d-flex flex-wrap gap-2">
                        {fonts.map((font) => (
                          <div
                            key={font.id}
                            onClick={() => handleFontSelect(font.id)}
                            style={{
                              padding: "10px 15px",
                              border:
                                cardData.fontStyle === font.id
                                  ? "2px solid #000"
                                  : "1px solid #ddd",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontFamily: font.id,
                            }}
                          >
                            {font.name}
                          </div>
                        ))}
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Logo URL (optional)</Form.Label>
                      <Form.Control
                        type="url"
                        name="logoUrl"
                        value={cardData.logoUrl}
                        onChange={handleChange}
                        placeholder="Enter URL for your logo"
                      />
                      <Form.Text className="text-muted">
                        Leave empty to use your initial instead
                      </Form.Text>
                    </Form.Group>
                  </Form>
                </Tab>
              </Tabs>

              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    if (activeTab === "personal") setActiveTab("design");
                    else if (activeTab === "social") setActiveTab("personal");
                    else if (activeTab === "design") setActiveTab("social");
                  }}
                >
                  {activeTab === "personal" ? "Skip to Design" : "Previous"}
                </Button>

                {activeTab !== "design" ? (
                  <Button
                    variant="primary"
                    onClick={() => {
                      // if (activeTab === "personal") setActiveTab("social");
                      // else if (activeTab === "social") setActiveTab("design");
                      if (activeTab === "personal") {
                        if (validatePersonalInfo()) {
                          setActiveTab("social");
                        }
                      } else if (activeTab === "social") {
                        setActiveTab("design");
                      }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary"
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
                        Updating...
                      </>
                    ) : (
                      "Update Card"
                    )}
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Preview Section */}
        <Col lg={4}>
          <div className="sticky-top" style={{ top: "2rem" }}>
            <h4 className="mb-3">Card Preview</h4>
            <CardPreview />

            <Card className="border-0 bg-light mt-4">
              <Card.Body>
                <h5>Currently Using</h5>
                {cardData.backgroundType === "color" ? (
                  <div className="d-flex align-items-center mb-2">
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        backgroundColor: selectedTheme.primary,
                        borderRadius: "4px",
                        marginRight: "10px",
                      }}
                    ></div>
                    <span>{selectedTheme.name}</span>
                  </div>
                ) : (
                  <div className="mb-2">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-image me-2"></i>
                      <span>Background Image</span>
                    </div>
                    {cardData.backgroundImage && (
                      <div
                        className="mt-2"
                        style={{
                          maxWidth: "100%",
                          height: "30px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={cardData.backgroundImage}
                          alt="Selected background"
                          style={{
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-2">
                  <strong>Font:</strong>{" "}
                  <span style={{ fontFamily: cardData.fontStyle }}>
                    {fonts.find((f) => f.id === cardData.fontStyle)?.name ||
                      "Sans Serif"}
                  </span>
                </div>

                <div className="mt-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={loading}
                    className="w-100"
                  >
                    {loading ? "Updating..." : "Update Card"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CardEdit;
