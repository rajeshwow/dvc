import { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          priority: "medium",
        });
      }, 3000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Support",
      description: "Get in touch via email",
      contact: "support@dvc-cards.com",
      responseTime: "Within 24 hours",
      action: "mailto:support@dvc-cards.com",
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available 9 AM - 6 PM EST",
      responseTime: "Instant response",
      action: "#",
    },
    {
      icon: "📞",
      title: "Phone Support",
      description: "Speak directly with us",
      contact: "+1 (555) 123-4567",
      responseTime: "Mon-Fri, 9 AM - 6 PM EST",
      action: "tel:+15551234567",
    },
    {
      icon: "📍",
      title: "Office Location",
      description: "Visit our headquarters",
      contact: "123 Digital Avenue, Tech City, TC 12345",
      responseTime: "By appointment only",
      action: "https://maps.google.com",
    },
  ];

  const supportTopics = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing & Payments" },
    { value: "feature", label: "Feature Request" },
    { value: "bug", label: "Bug Report" },
    { value: "business", label: "Business Partnership" },
    { value: "other", label: "Other" },
  ];

  return (
    <>
      <style>{`
        .contact-page {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          min-height: 100vh;
          padding: 80px 0;
        }

        .contact-hero {
          text-align: center;
          margin-bottom: 80px;
        }

        .hero-title-contact {
          font-size: 3rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle-contact {
          font-size: 1.2rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-bottom: 80px;
        }

        .contact-form-section {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .contact-form-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .form-title {
          font-size: 2rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
        }

        .form-subtitle {
          color: #666;
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-select {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          font-size: 1rem;
          background: #f8f9fa;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .form-select:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-textarea {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          font-size: 1rem;
          min-height: 120px;
          resize: vertical;
          background: #f8f9fa;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .priority-options {
          display: flex;
          gap: 15px;
          margin-top: 10px;
        }

        .priority-option {
          flex: 1;
          padding: 12px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .priority-option.active {
          border-color: #667eea;
          background: #f0f4ff;
          color: #667eea;
          font-weight: 600;
        }

        .priority-option:hover {
          border-color: #667eea;
          background: #f0f4ff;
        }

        .submit-btn {
          width: 100%;
          padding: 18px 30px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s ease-in-out infinite;
          margin-right: 10px;
        }

        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 20px;
          border-radius: 10px;
          border: 1px solid #c3e6cb;
          margin-bottom: 20px;
          text-align: center;
        }

        .contact-methods {
          display: grid;
          gap: 25px;
        }

        .contact-method {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          cursor: pointer;
          border: 2px solid transparent;
        }

        .contact-method:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border-color: #667eea;
        }

        .method-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
          display: block;
        }

        .method-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .method-description {
          color: #666;
          margin-bottom: 15px;
          font-size: 0.95rem;
        }

        .method-contact {
          color: #667eea;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .method-response {
          color: #28a745;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .additional-info {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .info-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 20px;
        }

        .info-content {
          color: #666;
          line-height: 1.7;
          margin-bottom: 30px;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 30px;
        }

        .social-link {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-title-contact {
            font-size: 2.5rem;
          }

          .contact-form-section {
            padding: 30px 20px;
          }

          .priority-options {
            flex-direction: column;
          }

          .social-links {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="contact-page">
        <div className="contact-container">
          {/* Hero Section */}
          <div className="contact-hero">
            <h1 className="hero-title-contact">Get in Touch</h1>
            <p className="hero-subtitle-contact">
              Have questions about DVC? We're here to help! Reach out to our
              friendly support team and we'll get back to you as soon as
              possible.
            </p>
          </div>

          {/* Main Contact Grid */}
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2 className="form-title">Send us a Message</h2>
              <p className="form-subtitle">
                Fill out the form below and we'll respond within 24 hours.
              </p>

              {submitted && (
                <div className="success-message">
                  <strong>Thank you!</strong> Your message has been sent
                  successfully. We'll get back to you soon! 🎉
                </div>
              )}

              <div>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select a topic</option>
                    {supportTopics.map((topic) => (
                      <option key={topic.value} value={topic.value}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority Level</label>
                  <div className="priority-options">
                    {["low", "medium", "high"].map((level) => (
                      <div
                        key={level}
                        className={`priority-option ${
                          formData.priority === level ? "active" : ""
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, priority: level }))
                        }
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <button
                  type="button"
                  className="submit-btn"
                  disabled={loading || submitted}
                  onClick={handleSubmit}
                >
                  {loading && <span className="loading-spinner"></span>}
                  {loading
                    ? "Sending..."
                    : submitted
                    ? "Message Sent!"
                    : "Send Message"}
                </button>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="contact-methods">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.action}
                  className="contact-method"
                  target={method.action.startsWith("http") ? "_blank" : "_self"}
                  rel={
                    method.action.startsWith("http")
                      ? "noopener noreferrer"
                      : ""
                  }
                >
                  <span className="method-icon">{method.icon}</span>
                  <h3 className="method-title">{method.title}</h3>
                  <p className="method-description">{method.description}</p>
                  <div className="method-contact">{method.contact}</div>
                  <div className="method-response">{method.responseTime}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="additional-info">
            <h3 className="info-title">Need Immediate Help?</h3>
            <p className="info-content">
              Check out our comprehensive FAQ section for instant answers to
              common questions. You can also join our community forums where
              users and experts share tips and solutions.
            </p>

            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="/faq"
                style={{
                  padding: "12px 30px",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "25px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.target.style.transform = "translateY(-2px)")
                }
                onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
              >
                📚 Browse FAQ
              </a>
              <a
                href="#"
                style={{
                  padding: "12px 30px",
                  background: "transparent",
                  color: "#667eea",
                  textDecoration: "none",
                  borderRadius: "25px",
                  border: "2px solid #667eea",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#667eea";
                  e.target.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#667eea";
                }}
              >
                💬 Join Community
              </a>
            </div>

            <div className="social-links">
              <a href="#" className="social-link" title="Facebook">
                📘
              </a>
              <a href="#" className="social-link" title="Twitter">
                🐦
              </a>
              <a href="#" className="social-link" title="LinkedIn">
                💼
              </a>
              <a href="#" className="social-link" title="Instagram">
                📷
              </a>
              <a href="#" className="social-link" title="YouTube">
                📺
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
