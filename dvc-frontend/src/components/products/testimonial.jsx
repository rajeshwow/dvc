// src/components/Testimonials.js
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { Alert, Badge, Button, Card, Form, Modal } from "react-bootstrap";
// import "./Testimonials.css";

const TestimonialItem = ({ testimonial, isActive }) => {
  return (
    <div className={`testimonial-item ${isActive ? "active" : ""}`}>
      <div className="testimonial-header d-flex align-items-center">
        <div className="testimonial-avatar me-2">
          {testimonial.name
            ? testimonial.name.substring(0, 2).toUpperCase()
            : "GU"}
        </div>
        <div>
          <h6 className="testimonial-name mb-0">
            {testimonial.name || "Guest"}
          </h6>
          <div className="testimonial-rating">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`bi ${
                  i < testimonial.rating ? "bi-star-fill" : "bi-star"
                }`}
              ></i>
            ))}
          </div>
        </div>
        <div className="testimonial-date ms-auto">
          {new Date(testimonial.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
      <div className="testimonial-content mt-2">
        <p className="testimonial-text mb-0">{testimonial.comment}</p>
      </div>
    </div>
  );
};

const TestimonialEditor = ({ show, onHide, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "Comment is required";
    } else if (formData.comment.length < 5) {
      newErrors.comment = "Comment must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Add date to the testimonial
      const testimonialData = {
        ...formData,
        date: new Date().toISOString(),
      };

      await onSubmit(testimonialData);
      onHide();
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      setErrors({
        submit: "Failed to submit testimonial. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Your Testimonial</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              Your Name<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              placeholder="Enter your name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <div className="rating-input">
              {[5, 4, 3, 2, 1].map((rating) => (
                <Form.Check
                  key={rating}
                  inline
                  type="radio"
                  id={`rating-${rating}`}
                  label={`${rating} ${rating === 1 ? "Star" : "Stars"}`}
                  name="rating"
                  value={rating}
                  checked={parseInt(formData.rating) === rating}
                  onChange={handleChange}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Your Testimonial<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              isInvalid={!!errors.comment}
              placeholder="Share your experience..."
            />
            <Form.Control.Feedback type="invalid">
              {errors.comment}
            </Form.Control.Feedback>
          </Form.Group>

          {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Testimonial"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Testimonials = ({
  testimonials,
  isOwner,
  onSubmitTestimonial,
  onApproveTestimonial,
  onDeleteTestimonial,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showManageModal, setShowManageModal] = useState(false);
  const [pendingTestimonials, setPendingTestimonials] = useState([]);
  const testimonialsRef = useRef(null);
  const approvedTestimonials = testimonials.filter((t) => t.approved);

  useEffect(() => {
    // Auto-rotate testimonials every 5 seconds
    const interval = setInterval(() => {
      if (approvedTestimonials.length > 1) {
        setActiveIndex((prev) => (prev + 1) % approvedTestimonials.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [approvedTestimonials.length]);

  useEffect(() => {
    // Filter pending testimonials
    if (isOwner) {
      setPendingTestimonials(testimonials.filter((t) => !t.approved));
    }
  }, [testimonials, isOwner]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  const handlePrevClick = () => {
    setActiveIndex((prev) =>
      prev === 0 ? approvedTestimonials.length - 1 : prev - 1
    );
  };

  const handleNextClick = () => {
    setActiveIndex((prev) => (prev + 1) % approvedTestimonials.length);
  };

  const handleTestimonialSubmit = async (testimonialData) => {
    // In a real app, this would be pending approval
    await onSubmitTestimonial({
      ...testimonialData,
      approved: false, // New testimonials require approval
    });
  };

  const handleApprove = async (testimonialId) => {
    await onApproveTestimonial(testimonialId);
    // Update pending testimonials
    setPendingTestimonials((prev) =>
      prev.filter((t) => t.id !== testimonialId)
    );
    setShowManageModal(false);
  };

  const handleDelete = async (testimonialId) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      await onDeleteTestimonial(testimonialId);
    }
  };

  return (
    <>
      <Card className="testimonials-card mt-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Testimonials</h5>
            <div>
              {isOwner && pendingTestimonials.length > 0 && (
                <Badge
                  bg="warning"
                  className="me-2 pending-badge"
                  onClick={() => setShowManageModal(true)}
                >
                  {pendingTestimonials.length} Pending
                </Badge>
              )}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowAddModal(true)}
              >
                <i className="bi bi-chat-quote me-1"></i>
                Add Testimonial
              </Button>
              {isOwner && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="ms-2"
                  onClick={() => setShowManageModal(true)}
                >
                  <i className="bi bi-gear me-1"></i>
                  Manage
                </Button>
              )}
            </div>
          </div>

          {approvedTestimonials.length > 0 ? (
            <div className="testimonials-carousel" ref={testimonialsRef}>
              <div className="testimonials-container">
                {approvedTestimonials.map((testimonial, index) => (
                  <TestimonialItem
                    key={testimonial._id || index}
                    testimonial={testimonial}
                    isActive={index === activeIndex}
                  />
                ))}
              </div>

              {approvedTestimonials.length > 1 && (
                <>
                  <button
                    className="carousel-nav prev"
                    onClick={handlePrevClick}
                    aria-label="Previous testimonial"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <button
                    className="carousel-nav next"
                    onClick={handleNextClick}
                    aria-label="Next testimonial"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>

                  <div className="carousel-dots">
                    {approvedTestimonials.map((_, index) => (
                      <button
                        key={index}
                        className={`carousel-dot ${
                          index === activeIndex ? "active" : ""
                        }`}
                        onClick={() => handleDotClick(index)}
                        aria-label={`Go to testimonial ${index + 1}`}
                      ></button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-chat-quote text-muted fs-1"></i>
              <p className="text-muted mt-2">No testimonials yet</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddModal(true)}
              >
                Be the first to add a testimonial
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add Testimonial Modal */}
      <TestimonialEditor
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={handleTestimonialSubmit}
      />

      {/* Manage Testimonials Modal */}
      <Modal
        show={showManageModal}
        onHide={() => setShowManageModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Manage Testimonials</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Pending Approval</h6>
          {pendingTestimonials.length > 0 ? (
            <div className="pending-testimonials">
              {pendingTestimonials.map((testimonial, index) => (
                <div
                  key={testimonial._id || index}
                  className="pending-testimonial-item p-3 border rounded mb-3"
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6>{testimonial.name}</h6>
                      <div className="testimonial-rating mb-2">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi ${
                              i < testimonial.rating
                                ? "bi-star-fill"
                                : "bi-star"
                            }`}
                          ></i>
                        ))}
                      </div>
                    </div>
                    <div className="pending-actions">
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleApprove(testimonial._id)}
                      >
                        <i className="bi bi-check-lg me-1"></i>
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(testimonial._id)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="testimonial-text mb-0">{testimonial.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No pending testimonials</p>
          )}

          <hr />

          <h6>Approved Testimonials</h6>
          {approvedTestimonials.length > 0 ? (
            <div className="approved-testimonials">
              {approvedTestimonials.map((testimonial, index) => (
                <div
                  key={testimonial._id || index}
                  className="approved-testimonial-item p-3 border rounded mb-3"
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6>{testimonial.name}</h6>
                      <div className="testimonial-rating mb-2">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi ${
                              i < testimonial.rating
                                ? "bi-star-fill"
                                : "bi-star"
                            }`}
                          ></i>
                        ))}
                      </div>
                    </div>
                    <div className="approved-actions">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(testimonial._id)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="testimonial-text mb-0">{testimonial.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No approved testimonials</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowManageModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

TestimonialItem.propTypes = {
  testimonial: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    rating: PropTypes.number,
    comment: PropTypes.string,
    date: PropTypes.string,
    approved: PropTypes.bool,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
};

TestimonialEditor.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

Testimonials.propTypes = {
  testimonials: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      rating: PropTypes.number,
      comment: PropTypes.string,
      date: PropTypes.string,
      approved: PropTypes.bool,
    })
  ),
  isOwner: PropTypes.bool,
  onSubmitTestimonial: PropTypes.func,
  onApproveTestimonial: PropTypes.func,
  onDeleteTestimonial: PropTypes.func,
};

Testimonials.defaultProps = {
  testimonials: [],
  isOwner: false,
  onSubmitTestimonial: () => {},
  onApproveTestimonial: () => {},
  onDeleteTestimonial: () => {},
};

export default Testimonials;
