// Modified CardView component to include analytics tracking
import { jwtDecode } from "jwt-decode";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { analyticsAPI, cardAPI } from "../services/api";
import { themes } from "../utils/utilities";
import BusinessHours from "./products/businessHours";
import ProductEditor from "./products/productEditor";
import ProductGallery from "./products/productGallery";
import Testimonials from "./products/testimonial";
import QRCodeGenerator from "./qrcodegenerator";

const CardView = () => {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [isOwner, setIsOwner] = useState(false);
  const [showProductEditor, setShowProductEditor] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Handle delete product confirmation
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Confirm delete product
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await cardAPI.deleteCardProduct(id, productToDelete._id);

      // Refresh card data
      const updatedCard = await cardAPI.getCard(id);
      setCard(updatedCard);

      // Close modal and reset state
      setShowDeleteModal(false);
      setProductToDelete(null);

      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Handle adding a new product
  const handleAddProduct = () => {
    setCurrentProduct(null); // No product to edit
    setShowProductEditor(true);
  };

  // Handle editing a product
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setShowProductEditor(true);
  };

  // Save product (create or update)
  const handleSaveProduct = async (productData) => {
    // Log the FormData contents for debugging (optional)
    console.log("Product data being sent:");
    for (let [key, value] of productData.entries()) {
      console.log(
        `${key}: ${value instanceof File ? `File: ${value.name}` : value}`
      );
    }
    try {
      if (currentProduct && currentProduct.id) {
        // Update existing product
        await cardAPI.updateCardProduct(id, currentProduct.id, productData);
      } else {
        // Create new product
        await cardAPI.addCardProduct(id, productData);
      }

      // Refresh card data
      const updatedCard = await cardAPI.getCard(id);
      setCard(updatedCard);
      setShowProductEditor(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Save business hours
  const handleSaveHours = async (hoursData) => {
    try {
      await cardAPI.updateBusinessHours(id, hoursData);

      // Refresh card data
      const updatedCard = await cardAPI.getCard(id);
      setCard(updatedCard);
    } catch (error) {
      console.error("Error saving business hours:", error);
    }
  };

  // Submit testimonial
  const handleSubmitTestimonial = async (testimonialData) => {
    try {
      await cardAPI.addTestimonial(id, testimonialData);

      // Refresh card data
      const updatedCard = await cardAPI.getCard(id);
      setCard(updatedCard);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
    }
  };

  // Approve testimonial
  const handleApproveTestimonial = async (testimonialId) => {
    try {
      await cardAPI.approveTestimonial(id, testimonialId);

      // Refresh card data
      const updatedCard = await cardAPI.getCard(id);
      setCard(updatedCard);
    } catch (error) {
      console.error("Error approving testimonial:", error);
    }
  };

  // Delete testimonial
  const handleDeleteTestimonial = async (testimonialId) => {
    try {
      await cardAPI.deleteTestimonial(id, testimonialId);

      // Refresh card data
      const updatedCard = await cardAPI.getCard(id);
      setCard(updatedCard);
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  // Fetch card data
  useEffect(() => {
    const fetchCard = async () => {
      try {
        const data = await cardAPI.getCard(id);
        setCard(data);

        // Get token and decode
        // eslint-disable-next-line no-debugger
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setIsOwner(decoded.id === data.userId);
        }
      } catch (err) {
        console.error("Error fetching card:", err);
        setError(
          "Failed to load card. It may have been deleted or you don't have permission to view it."
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchCard();
    }

    // Trigger animations after component mounts
    setIsVisible(true);
  }, [id]);

  useEffect(() => {
    if (!loading) {
      analyticsAPI.trackView(id);
    }
  }, [id, loading]);

  // Handle share
  const handleShare = () => {
    // Track share interaction
    analyticsAPI.trackShare(id, "share_button");

    if (navigator.share) {
      navigator
        .share({
          title: `${card.name}'s Digital Card`,
          text: `Check out ${card.name}'s digital business card`,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      setShowQRModal(true);
    }
  };

  // Handle download as vCard
  const handleDownloadVCard = () => {
    // Track download interaction
    analyticsAPI.trackDownload(id);

    // Create vCard format
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${card.name}
TITLE:${card.title || ""}
ORG:${card.company || ""}
EMAIL:${card.email || ""}
TEL:${card.phone || ""}
URL:${card.website || ""}
ADR:;;${card.address || ""};;;
NOTE:${card.bio || ""}
${card.linkedin ? `URL;type=LINKEDIN:${card.linkedin}` : ""}
${card.twitter ? `URL;type=TWITTER:${card.twitter}` : ""}
${card.instagram ? `URL;type=INSTAGRAM:${card.instagram}` : ""}
${card.github ? `URL;type=GITHUB:${card.github}` : ""}
END:VCARD`;

    // Create a download link
    const blob = new Blob([vCard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${card.name.replace(/\s+/g, "_")}.vcf`;
    link.href = url;
    link.click();
  };

  // Handle contact button clicks with tracking
  const handleContactClick = (contactType, url) => {
    // Track the contact interaction
    analyticsAPI.trackContactClick(id, contactType);

    // Navigate to the URL
    window.open(url, "_blank");
  };

  // Handle social media link clicks with tracking
  const handleSocialClick = (network, url) => {
    // Track the social media interaction
    analyticsAPI.trackSocialClick(id, network);

    // Navigate to the URL
    window.open(url, "_blank");
  };

  // If loading
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading card...</p>
      </Container>
    );
  }

  // If error
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // If card not found
  if (!card) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Card not found</Alert>
      </Container>
    );
  }
  console.log("card", card);

  const theme = themes[card.theme] || themes[0];

  // Determine header background style based on backgroundType
  const getHeaderStyle = () => {
    let style = {
      height: "120px",
      position: "relative",
    };

    // Add background based on type
    if (card.backgroundType === "image" && card.backgroundImage) {
      style.background = `url(${card.backgroundImage})`;
      style.backgroundSize = "cover";
      style.backgroundPosition = "center";
    } else if (card.backgroundType === "gradient" && card.backgroundImage) {
      style.background = card.backgroundImage;
      // Add animated gradient effect if it's a gradient
      style.backgroundSize = "200% 200%";
      style.animation = "gradientShift 10s ease infinite";
    } else if (card.backgroundType === "pattern" && card.backgroundImage) {
      style.backgroundImage = card.backgroundImage;
      style.backgroundColor = theme.primary;
    } else {
      style.background = theme.primary;
    }

    return style;
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card
            className={`shadow border-0 mb-4 ${
              isVisible ? "card-animate-in" : ""
            } card-hover-effect`}
            style={{ fontFamily: card.fontStyle }}
          >
            {/* Card header with animated background */}
            <div style={getHeaderStyle()} className="animated-background">
              {/* Profile image/logo */}
              <div
                className="rounded-circle bg-white d-flex align-items-center justify-content-center border shadow-sm position-absolute profile-image-animate"
                style={{
                  width: "120px",
                  height: "120px",
                  bottom: "-60px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                {card.logoUrl ? (
                  <img
                    src={card.logoUrl}
                    alt={card.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: "3rem",
                      fontWeight: "bold",
                      color: theme.primary,
                    }}
                  >
                    {card.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <Card.Body className="text-center pt-5 mt-4">
              <h2 className="mb-1 fw-bold fade-in-fast">{card.name}</h2>
              {card.title && (
                <p className="text-muted mb-1 fade-in-medium">{card.title}</p>
              )}
              {card.company && (
                <p className="mb-3 fade-in-medium">{card.company}</p>
              )}

              {card.bio && <p className="my-3 fade-in-medium">{card.bio}</p>}

              {/* Contact buttons */}
              <div className="d-flex justify-content-center flex-wrap gap-2 my-4 fade-in-slow">
                {card.email && (
                  <Button
                    onClick={() =>
                      handleContactClick("email", `mailto:${card.email}`)
                    }
                    variant="outline-primary"
                    className="rounded-pill action-button"
                  >
                    <i className="bi bi-envelope me-2"></i>
                    Email
                  </Button>
                )}

                {card.phone && (
                  <Button
                    onClick={() =>
                      handleContactClick("phone", `tel:${card.phone}`)
                    }
                    variant="outline-primary"
                    className="rounded-pill action-button"
                  >
                    <i className="bi bi-telephone me-2"></i>
                    Call
                  </Button>
                )}

                {card.website && (
                  <Button
                    onClick={() => handleContactClick("website", card.website)}
                    variant="outline-primary"
                    className="rounded-pill action-button"
                  >
                    <i className="bi bi-globe me-2"></i>
                    Website
                  </Button>
                )}
              </div>

              {/* Social links */}
              <div className="d-flex justify-content-center gap-3 my-4 fade-in-slow">
                {card.linkedin && (
                  <a
                    onClick={() => handleSocialClick("linkedin", card.linkedin)}
                    href={card.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center social-icon"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: theme.primary,
                        color: "white",
                      }}
                    >
                      <i className="bi bi-linkedin"></i>
                    </div>
                  </a>
                )}

                {card.twitter && (
                  <a
                    onClick={() => handleSocialClick("twitter", card.twitter)}
                    href={card.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center social-icon"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: theme.primary,
                        color: "white",
                      }}
                    >
                      <i className="bi bi-twitter"></i>
                    </div>
                  </a>
                )}

                {card.instagram && (
                  <a
                    onClick={() =>
                      handleSocialClick("instagram", card.instagram)
                    }
                    href={card.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center social-icon"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: theme.primary,
                        color: "white",
                      }}
                    >
                      <i className="bi bi-instagram"></i>
                    </div>
                  </a>
                )}

                {card.github && (
                  <a
                    onClick={() => handleSocialClick("github", card.github)}
                    href={card.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center social-icon"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: theme.primary,
                        color: "white",
                      }}
                    >
                      <i className="bi bi-github"></i>
                    </div>
                  </a>
                )}
              </div>

              {card.address && (
                <p className="text-muted fade-in-slow">
                  <i className="bi bi-geo-alt me-2"></i>
                  {card.address}
                </p>
              )}
            </Card.Body>
          </Card>

          {/* Product Gallery Section */}
          <ProductGallery
            products={card?.products || []}
            isOwner={isOwner}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />

          {/* Business Hours Section */}
          <BusinessHours
            businessHours={card?.businessHours}
            isOwner={isOwner}
            onSave={handleSaveHours}
          />

          {/* Testimonials Section */}
          <Testimonials
            testimonials={card?.testimonials || []}
            isOwner={isOwner}
            onSubmitTestimonial={handleSubmitTestimonial}
            onApproveTestimonial={handleApproveTestimonial}
            onDeleteTestimonial={handleDeleteTestimonial}
          />

          {/* Product Editor Modal */}
          <ProductEditor
            show={showProductEditor}
            onHide={() => setShowProductEditor(false)}
            product={currentProduct}
            onSave={handleSaveProduct}
          />

          {/* Delete Confirmation Modal */}
          <Modal show={showDeleteModal} onHide={cancelDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title>Delete Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure you want to delete this product?</p>
              {productToDelete && (
                <div className="d-flex align-items-center gap-3 p-3 border rounded">
                  {productToDelete.images &&
                    productToDelete.images.length > 0 && (
                      <img
                        src={productToDelete.images[0]}
                        alt={productToDelete.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                  <div>
                    <h6 className="mb-1">{productToDelete.name}</h6>
                    {productToDelete.price && (
                      <small className="text-muted">
                        {productToDelete.price}
                      </small>
                    )}
                  </div>
                </div>
              )}
              <p className="text-danger mt-3 mb-0">
                <small>This action cannot be undone.</small>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDeleteProduct}>
                Delete Product
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Action buttons */}
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              onClick={handleShare}
              className="mb-2 action-button"
            >
              <i className="bi bi-share me-2"></i>
              Share Card
            </Button>

            <Button
              variant="outline-primary"
              onClick={handleDownloadVCard}
              className="action-button"
            >
              <i className="bi bi-download me-2"></i>
              Add to Contacts
            </Button>
          </div>

          <QRCodeGenerator cardId={card._id} userName={card.name} />
        </Col>
      </Row>

      {/* QR Code Modal */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Share Digital Card</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <QRCodeSVG
            value={window.location.href}
            size={200}
            level="H"
            includeMargin={true}
          />
          <p className="mt-3 mb-0">
            Scan this QR code to view this digital card
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQRModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CardView;
