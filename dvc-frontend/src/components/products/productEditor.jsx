import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";

const ProductEditor = ({ show, onHide, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null, // Changed back to single image
    featured: false,
    ctaType: "inquiry",
    ctaLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(""); // Single image preview
  const [isDragging, setIsDragging] = useState(false);

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      console.log("Editing product:", product);
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        image: null, // Don't set file, just show preview
        featured: product.featured || false,
        ctaType: product.ctaType || "inquiry",
        ctaLink: product.ctaLink || "",
      });

      // Set existing image preview (first image if array exists)
      const existingImage =
        product.images && product.images.length > 0
          ? product.images[0]
          : product.imageUrl || "";
      setImagePreview(existingImage);
    } else {
      console.log("Adding new product");
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
        featured: false,
        ctaType: "inquiry",
        ctaLink: "",
      });
      setImagePreview("");
      setIsDragging(false);
    }
  }, [product]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle single image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Only take the first file
    if (file) {
      processFile(file);
    }
  };

  // Process single file (used by both file input and drag-drop)
  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview for the file
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    // Only process the first image file
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  // Remove image
  const removeImage = () => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: null }));
    // Reset file input
    const fileInput = document.getElementById("imageInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("category", formData.category);
      submitData.append("featured", formData.featured);
      submitData.append("ctaType", formData.ctaType);
      submitData.append("ctaLink", formData.ctaLink);

      // Append single image if selected
      if (formData.image) {
        submitData.append("images", formData.image);
      }

      // If editing and no new image selected, preserve existing image
      if (
        product &&
        product.images &&
        product.images.length > 0 &&
        !formData.image
      ) {
        submitData.append("productImages", JSON.stringify([product.images[0]]));
      }

      console.log("Submitting product data:", {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        featured: formData.featured,
        ctaType: formData.ctaType,
        ctaLink: formData.ctaLink,
        hasNewImage: !!formData.image,
        imageFileName: formData.image?.name,
        isEditing: !!product,
      });

      await onSave(submitData);

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
        featured: false,
        ctaType: "inquiry",
        ctaLink: "",
      });
      setImagePreview("");
    } catch (error) {
      console.error("Error in ProductEditor:", error);
      alert("Error saving product. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
      featured: false,
      ctaType: "inquiry",
      ctaLink: "",
    });
    setImagePreview("");
    setIsDragging(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{product ? "Edit Product" : "Add Product"}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Product Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter product name"
                />
              </Form.Group>

              {/* Upload area positioned below name */}
              <Form.Group className="mb-4">
                <Form.Label>Product Image</Form.Label>
                <div
                  style={{
                    border: "2px dashed #d1ecf1",
                    borderRadius: "8px",
                    padding: "3rem 2rem",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backgroundColor: isDragging ? "#b8daff" : "#e7f3ff",
                    borderColor: isDragging ? "#007bff" : "#b8daff",
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("imageInput").click()}
                >
                  <div className="d-flex flex-column align-items-center">
                    <div
                      style={{
                        fontSize: "24px",
                        marginBottom: "8px",
                        color: "#6c757d",
                      }}
                    >
                      +
                    </div>
                    <span style={{ color: "#6c757d", fontSize: "14px" }}>
                      Upload
                    </span>
                    <span
                      style={{
                        color: "#6c757d",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      One image only
                    </span>
                  </div>
                </div>
                <Form.Control
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </Form.Group>

              {/* Single Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  <Form.Label>Image Preview</Form.Label>
                  <div
                    className="d-flex justify-content-center p-3 border rounded"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <div className="position-relative">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "2px solid #dee2e6",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          padding: "0",
                          fontSize: "14px",
                          transform: "translate(50%, -50%)",
                          lineHeight: "1",
                        }}
                        onClick={removeImage}
                        title="Remove image"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g., $99.99 or $50-$100"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Enter product category"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Call to Action</Form.Label>
                    <Form.Select
                      name="ctaType"
                      value={formData.ctaType}
                      onChange={handleChange}
                    >
                      <option value="inquiry">Send Inquiry</option>
                      <option value="buy">Buy Now</option>
                      <option value="contact">Contact Us</option>
                    </Form.Select>
                  </Form.Group>

                  {formData.ctaType === "buy" && (
                    <Form.Group className="mb-3">
                      <Form.Label>Buy Now Link</Form.Label>
                      <Form.Control
                        type="url"
                        name="ctaLink"
                        value={formData.ctaLink}
                        onChange={handleChange}
                        placeholder="https://your-store.com/product"
                      />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      label="Featured Product"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter detailed product description"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading || !formData.name.trim()}
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
                {product ? "Updating..." : "Adding..."}
              </>
            ) : product ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProductEditor;
