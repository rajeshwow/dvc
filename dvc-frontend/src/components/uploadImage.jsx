import axios from "axios";
import { useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";

const ImageUploader = ({
  onImageUploaded,
  uploadType = "background",
  className = "",
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError("");
    setSuccess("");

    if (!file) {
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPG, PNG, or GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    // Create form data
    const formData = new FormData();
    formData.append(
      uploadType === "background" ? "backgroundImage" : "logoImage",
      selectedFile
    );

    try {
      const response = await axios.post(
        `http://localhost:5000/api/upload/${uploadType}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess("Image uploaded successfully!");
      setSelectedFile(null);

      // Call the callback with the image URL
      if (response.data && response.data.fileUrl) {
        onImageUploaded(response.data.fileUrl);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.error || "Failed to upload image. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mt-2">
          {success}
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label>
          {uploadType === "background"
            ? "Upload Background Image"
            : "Upload Logo"}
        </Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Form.Text className="text-muted">
          Max file size: 5MB. Supported formats: JPG, PNG, GIF
        </Form.Text>
      </Form.Group>

      {preview && (
        <div className="mb-3 text-center">
          <p>Preview:</p>
          <img
            src={preview}
            alt="Preview"
            className="img-thumbnail"
            style={{
              maxHeight: uploadType === "background" ? "100px" : "150px",
              maxWidth: "100%",
            }}
          />
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        variant="primary"
        size="sm"
      >
        {uploading ? (
          <>
            <Spinner as="span" animation="border" size="sm" className="me-2" />
            Uploading...
          </>
        ) : (
          "Upload Image"
        )}
      </Button>
    </div>
  );
};

export default ImageUploader;
