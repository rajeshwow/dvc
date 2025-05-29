// src/components/ProductGallery.js
import PropTypes from "prop-types";
import { useState } from "react";
import { Badge, Button, Modal } from "react-bootstrap";
// import './ProductGallery.css';

const ProductGallery = ({
  products,
  isOwner,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleShowDetail = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };
  console.log("showDetailModal", showDetailModal);

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  };

  // Handle edit button click with event prevention
  const handleEditClick = (e, product) => {
    e.stopPropagation(); // Prevent bubbling to parent div
    onEditProduct(product);
  };

  // Handle delete button click with event prevention
  const handleDeleteClick = (e, product) => {
    e.stopPropagation(); // Prevent bubbling to parent div
    onDeleteProduct(product);
  };

  console.log("products", products);

  return (
    <div className="product-gallery mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Products & Services</h5>
        {isOwner && (
          <Button
            variant="outline-primary"
            size="sm"
            className="add-product-btn"
            onClick={onAddProduct}
          >
            <i className="bi bi-plus-lg me-1"></i>
            Add Product
          </Button>
        )}
      </div>

      <div className="row g-3">
        {products && products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} className="col-6 col-md-4">
              <div
                className="product-card"
                onClick={() => handleShowDetail(product)}
              >
                <div className="product-image-container">
                  <img
                    src={product.images[0] || "/placeholder-product.jpg"}
                    alt={product.name}
                    className="product-image"
                  />
                  {product.featured && (
                    <Badge bg="warning" className="featured-badge">
                      Featured
                    </Badge>
                  )}
                  {isOwner && (
                    <div className="position-absolute top-0 end-0 m-2">
                      <div className="d-flex gap-1">
                        {/* Edit Button */}
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-circle"
                          style={{
                            width: "32px",
                            height: "32px",
                            padding: "0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={(e) => handleEditClick(e, product)}
                          title="Edit product"
                        >
                          <i
                            className="bi bi-pencil"
                            style={{ fontSize: "14px" }}
                          ></i>
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="danger"
                          size="sm"
                          className="rounded-circle"
                          style={{
                            width: "32px",
                            height: "32px",
                            padding: "0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={(e) => handleDeleteClick(e, product)}
                          title="Delete product"
                        >
                          <i
                            className="bi bi-x"
                            style={{ fontSize: "16px", fontWeight: "bold" }}
                          ></i>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="product-info p-2">
                  <h6 className="product-name">{product.name}</h6>
                  {product.price && (
                    <p className="product-price mb-0">{product.price}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-4 bg-light rounded">
            <i className="bi bi-bag text-muted fs-1"></i>
            <p className="text-muted mt-2">No products added yet</p>
            {isOwner && (
              <Button variant="primary" size="sm" onClick={onAddProduct}>
                Add Your First Product
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={handleCloseDetail}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProduct?.name}
            {selectedProduct?.featured && (
              <Badge bg="warning" className="ms-2">
                Featured
              </Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div className="product-detail">
              <div className="row">
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="product-detail-image-container">
                    <img
                      src={
                        selectedProduct.images[0] || "/placeholder-product.jpg"
                      }
                      alt={selectedProduct.name}
                      className="product-detail-image"
                    />
                  </div>
                  {selectedProduct.images.length > 1 && (
                    <div className="product-thumbnails mt-2 d-flex">
                      {selectedProduct.images.slice(0, 4).map((img, idx) => (
                        <div
                          key={idx}
                          className="product-thumbnail-container me-2"
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx}`}
                            className="product-thumbnail"
                          />
                        </div>
                      ))}
                      {selectedProduct.images.length > 4 && (
                        <div className="product-thumbnail-container me-2 d-flex align-items-center justify-content-center">
                          <span>+{selectedProduct.images.length - 4}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  {selectedProduct.price && (
                    <p className="product-detail-price">
                      {selectedProduct.price}
                    </p>
                  )}
                  {selectedProduct.category && (
                    <Badge bg="secondary" className="mb-2">
                      {selectedProduct.category}
                    </Badge>
                  )}
                  {selectedProduct.description && (
                    <p className="product-detail-description">
                      {selectedProduct.description}
                    </p>
                  )}
                  <div className="product-actions mt-4">
                    {selectedProduct.ctaType === "buy" &&
                      selectedProduct.ctaLink && (
                        <Button
                          variant="primary"
                          href={selectedProduct.ctaLink}
                          target="_blank"
                          className="me-2"
                        >
                          <i className="bi bi-cart me-1"></i>
                          Buy Now
                        </Button>
                      )}
                    {selectedProduct.ctaType === "inquiry" && (
                      <Button variant="outline-primary" className="me-2">
                        <i className="bi bi-chat-dots me-1"></i>
                        Inquire
                      </Button>
                    )}
                    {selectedProduct.ctaType === "contact" && (
                      <Button variant="outline-primary" className="me-2">
                        <i className="bi bi-telephone me-1"></i>
                        Contact
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {isOwner && (
            <Button variant="outline-secondary" onClick={handleEditClick}>
              <i className="bi bi-pencil me-1"></i>
              Edit Product
            </Button>
          )}
          <Button variant="secondary" onClick={handleCloseDetail}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

ProductGallery.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string),
      price: PropTypes.string,
      description: PropTypes.string,
      category: PropTypes.string,
      featured: PropTypes.bool,
      ctaType: PropTypes.oneOf(["inquiry", "buy", "contact"]),
      ctaLink: PropTypes.string,
    })
  ),
  isOwner: PropTypes.bool,
  onAddProduct: PropTypes.func,
  onEditProduct: PropTypes.func,
};

ProductGallery.defaultProps = {
  products: [],
  isOwner: false,
  onAddProduct: () => {},
  onEditProduct: () => {},
};

export default ProductGallery;
