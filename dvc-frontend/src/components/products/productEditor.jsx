// src/components/ProductEditor.js
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Button, CloseButton, Col, Form, Modal, Row } from "react-bootstrap";
// import "./ProductEditor.css";

const ProductEditor = ({ show, onHide, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    images: [],
    price: "",
    description: "",
    category: "",
    featured: false,
    ctaType: "inquiry",
    ctaLink: "",
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        images: product.images || [],
        price: product.price || "",
        description: product.description || "",
        category: product.category || "",
        featured: product.featured || false,
        ctaType: product.ctaType || "inquiry",
        ctaLink: product.ctaLink || "",
      });
      setImageUrls(product.images || []);
    } else {
      resetForm();
    }
  }, [product, show]);

  const resetForm = () => {
    setFormData({
      name: "",
      images: [],
      price: "",
      description: "",
      category: "",
      featured: false,
      ctaType: "inquiry",
      ctaLink: "",
    });
    setImageUrls([]);
    setImageFiles([]);
    setUploadProgress(0);
    setIsUploading(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImageFiles = [...imageFiles, ...files];
    setImageFiles(newImageFiles);

    // Generate preview URLs
    const newImageUrls = [...imageUrls];
    files.forEach((file) => {
      const previewUrl = URL.createObjectURL(file);
      newImageUrls.push(previewUrl);
    });
    setImageUrls(newImageUrls);
  };

  const handleRemoveImage = (index) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);

    // Only remove from imageFiles if it's a new file
    if (index >= (formData.images?.length || 0)) {
      const newImageFiles = [...imageFiles];
      newImageFiles.splice(index - (formData.images?.length || 0), 1);
      setImageFiles(newImageFiles);
    } else {
      // It's an existing image
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      setFormData({
        ...formData,
        images: newImages,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (formData.ctaType === "buy" && !formData.ctaLink.trim()) {
      newErrors.ctaLink = "Link is required for Buy Now button";
    }

    if (
      formData.ctaType === "buy" &&
      formData.ctaLink &&
      !formData.ctaLink.startsWith("http")
    ) {
      newErrors.ctaLink =
        "Please enter a valid URL starting with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsUploading(true);

      // Create a FormData object to hold both product data and files
      const formDataToSend = new FormData();

      // IMPORTANT: Add basic product data - these fields must match the model's requirements
      formDataToSend.append("name", formData.name.trim()); // Make sure name is not empty
      formDataToSend.append("price", formData.price || "");
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("category", formData.category || "");
      formDataToSend.append("featured", formData.featured);
      formDataToSend.append("ctaType", formData.ctaType || "inquiry");
      formDataToSend.append("ctaLink", formData.ctaLink || "");

      // Add existing images if any (convert array to JSON string)
      if (formData.images && formData.images.length > 0) {
        formDataToSend.append(
          "existingImages",
          JSON.stringify(formData.images)
        );
      }

      // Add new image files
      if (imageFiles && imageFiles.length > 0) {
        // Simulate upload progress
        for (let i = 1; i <= 100; i++) {
          await new Promise((resolve) => setTimeout(resolve, 5)); // Faster simulation
          setUploadProgress(i);
        }

        // Append each file to FormData - IMPORTANT: use "productImages" to match your backend
        imageFiles.forEach((file) => {
          formDataToSend.append("productImages", file);
        });
      }

      // Log FormData content for debugging
      console.log("FormData being sent:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(
          `${key}: ${value instanceof File ? `File: ${value.name}` : value}`
        );
      }

      // Call the parent component's onSave with the FormData
      await onSave(formDataToSend);

      // Clean up blob URLs to prevent memory leaks
      imageUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });

      setIsUploading(false);
      setUploadProgress(0);
      onHide();
    } catch (error) {
      console.error("Error saving product:", error);
      setIsUploading(false);
      setErrors({
        submit: "Failed to save product. Please try again.",
      });
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {product ? "Edit Product" : "Add New Product"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              Product Name<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              isInvalid={!!errors.name}
              placeholder="Enter product name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Product Images</Form.Label>
            <div className="image-upload-container">
              <div className="image-previews d-flex flex-wrap">
                {imageUrls.map((url, index) => (
                  <div key={index} className="image-preview-container">
                    <img
                      src={url}
                      alt={`Preview ${index}`}
                      className="image-preview"
                    />
                    <CloseButton
                      className="remove-image-btn"
                      onClick={() => handleRemoveImage(index)}
                    />
                  </div>
                ))}
                <label className="add-image-btn">
                  <i className="bi bi-plus-lg"></i>
                  <span>Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>
            <Form.Text className="text-muted">
              Add up to 5 images. First image will be the main product image.
            </Form.Text>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., $99 or $10-$20"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Electronics, Clothing"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your product..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Feature this product"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
            />
            <Form.Text className="text-muted">
              Featured products appear highlighted and may appear first in your
              catalog.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Call-to-Action Button</Form.Label>
            <Form.Select
              name="ctaType"
              value={formData.ctaType}
              onChange={handleInputChange}
            >
              <option value="inquiry">Inquire</option>
              <option value="buy">Buy Now</option>
              <option value="contact">Contact</option>
            </Form.Select>
          </Form.Group>

          {formData.ctaType === "buy" && (
            <Form.Group className="mb-3">
              <Form.Label>Purchase Link</Form.Label>
              <Form.Control
                type="url"
                name="ctaLink"
                value={formData.ctaLink}
                onChange={handleInputChange}
                placeholder="https://..."
                isInvalid={!!errors.ctaLink}
              />
              <Form.Control.Feedback type="invalid">
                {errors.ctaLink}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Enter the URL where customers can purchase this product.
              </Form.Text>
            </Form.Group>
          )}

          {errors.submit && (
            <div className="alert alert-danger" role="alert">
              {errors.submit}
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {isUploading && (
          <div className="upload-progress w-100 mb-2">
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
                aria-valuenow={uploadProgress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <small className="text-muted">
              Uploading images: {uploadProgress}%
            </small>
          </div>
        )}
        <Button variant="secondary" onClick={onHide} disabled={isUploading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isUploading}>
          {isUploading ? "Saving..." : "Save Product"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ProductEditor.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  product: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default ProductEditor;
