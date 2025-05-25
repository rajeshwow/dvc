import { useState } from "react";

const CookiePolicy = () => {
  const lastUpdated = "December 15, 2024";
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const cookieTypes = [
    {
      id: "essential",
      name: "Essential Cookies",
      description:
        "These cookies are necessary for the website to function and cannot be switched off.",
      examples: [
        "Authentication tokens",
        "Session management",
        "Security preferences",
        "Load balancing",
      ],
      retention: "Session or up to 30 days",
      canDisable: false,
    },
    {
      id: "functional",
      name: "Functional Cookies",
      description:
        "These cookies enable enhanced functionality and personalization.",
      examples: [
        "Language preferences",
        "Theme settings",
        "Form data persistence",
        "Recently viewed cards",
      ],
      retention: "Up to 1 year",
      canDisable: true,
    },
    {
      id: "analytics",
      name: "Analytics Cookies",
      description:
        "These cookies help us understand how visitors interact with our website.",
      examples: [
        "Google Analytics",
        "Page view tracking",
        "User behavior analysis",
        "Performance monitoring",
      ],
      retention: "Up to 2 years",
      canDisable: true,
    },
    {
      id: "marketing",
      name: "Marketing Cookies",
      description:
        "These cookies are used to track visitors and display relevant advertisements.",
      examples: [
        "Social media pixels",
        "Retargeting cookies",
        "Conversion tracking",
        "Ad performance metrics",
      ],
      retention: "Up to 1 year",
      canDisable: true,
    },
  ];

  return (
    <>
      <style>{`
        .legal-document {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          background: #fff;
          line-height: 1.7;
          color: #333;
        }

        .document-header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #667eea;
        }

        .document-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 10px;
        }

        .last-updated {
          color: #666;
          font-style: italic;
        }

        .section {
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #667eea;
          margin-bottom: 15px;
          border-left: 4px solid #667eea;
          padding-left: 15px;
        }

        .section-content {
          margin-bottom: 20px;
        }

        .highlight {
          background: #f0f4ff;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
          margin: 20px 0;
        }

        .cookie-type-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          margin-bottom: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .cookie-type-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .cookie-header {
          padding: 20px;
          background: #fff;
          border-bottom: 1px solid #e9ecef;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cookie-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cookie-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-essential {
          background: #d4edda;
          color: #155724;
        }

        .status-optional {
          background: #fff3cd;
          color: #856404;
        }

        .expand-icon {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .expand-icon.expanded {
          transform: rotate(180deg);
        }

        .cookie-details {
          padding: 20px;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }

        .cookie-description {
          margin-bottom: 15px;
          color: #555;
        }

        .cookie-examples {
          margin-bottom: 15px;
        }

        .examples-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .examples-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .examples-list li {
          padding: 4px 0;
          color: #666;
          font-size: 0.9rem;
        }

        .examples-list li::before {
          content: '• ';
          color: #667eea;
          font-weight: bold;
          margin-right: 8px;
        }

        .cookie-retention {
          padding: 12px;
          background: #e3f2fd;
          border-radius: 6px;
          font-size: 0.9rem;
          color: #1565c0;
        }

        .preferences-section {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 10px;
          margin: 30px 0;
        }

        .preferences-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #333;
        }

        .preference-controls {
          display: grid;
          gap: 15px;
        }

        .preference-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .preference-info {
          flex: 1;
        }

        .preference-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .preference-desc {
          font-size: 0.9rem;
          color: #666;
        }

        .toggle-switch {
          position: relative;
          width: 50px;
          height: 24px;
        }

        .toggle-input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          border-radius: 24px;
          transition: 0.3s;
        }

        .toggle-slider:before {
          position: absolute;
          content: '';
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          border-radius: 50%;
          transition: 0.3s;
        }

        .toggle-input:checked + .toggle-slider {
          background-color: #667eea;
        }

        .toggle-input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        .toggle-input:disabled + .toggle-slider {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .contact-info {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 10px;
          margin-top: 30px;
        }

        .contact-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #333;
        }

        .list {
          margin: 15px 0;
          padding-left: 20px;
        }

        .list li {
          margin-bottom: 8px;
        }

        @media (max-width: 768px) {
          .legal-document {
            padding: 20px 15px;
          }
          
          .document-title {
            font-size: 2rem;
          }
          
          .section-title {
            font-size: 1.3rem;
          }

          .preference-item {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="legal-document">
        <div className="document-header">
          <h1 className="document-title">Cookie Policy</h1>
          <p className="last-updated">Last updated: {lastUpdated}</p>
        </div>

        <div className="highlight">
          <strong>What are Cookies?</strong> Cookies are small text files stored
          on your device when you visit our website. They help us provide you
          with a better, more personalized experience.
        </div>

        <div className="section">
          <h2 className="section-title">1. How We Use Cookies</h2>
          <div className="section-content">
            <p>DVC uses cookies and similar tracking technologies to:</p>
            <ul className="list">
              <li>Keep you signed in to your account</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze how our website is used</li>
              <li>Provide personalized content and features</li>
              <li>Improve our service performance</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">2. Types of Cookies We Use</h2>
          <div className="section-content">
            {cookieTypes.map((type) => (
              <div key={type.id} className="cookie-type-card">
                <div
                  className="cookie-header"
                  onClick={() => toggleSection(type.id)}
                >
                  <div className="cookie-name">
                    {type.name}
                    <span
                      className={`cookie-status ${
                        type.canDisable ? "status-optional" : "status-essential"
                      }`}
                    >
                      {type.canDisable ? "Optional" : "Essential"}
                    </span>
                  </div>
                  <span
                    className={`expand-icon ${
                      expandedSections.has(type.id) ? "expanded" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>

                {expandedSections.has(type.id) && (
                  <div className="cookie-details">
                    <p className="cookie-description">{type.description}</p>

                    <div className="cookie-examples">
                      <div className="examples-title">Examples:</div>
                      <ul className="examples-list">
                        {type.examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="cookie-retention">
                      <strong>Retention Period:</strong> {type.retention}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">3. Third-Party Cookies</h2>
          <div className="section-content">
            <p>We may use third-party services that set their own cookies:</p>

            <div style={{ marginTop: "20px" }}>
              <h4 style={{ color: "#333", marginBottom: "10px" }}>
                Google Analytics
              </h4>
              <p>
                Helps us understand how visitors use our website. You can
                opt-out at:{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Analytics Opt-out
                </a>
              </p>
            </div>

            <div style={{ marginTop: "20px" }}>
              <h4 style={{ color: "#333", marginBottom: "10px" }}>
                Social Media Plugins
              </h4>
              <p>
                Social sharing buttons may set cookies from platforms like
                Facebook, Twitter, and LinkedIn.
              </p>
            </div>

            <div style={{ marginTop: "20px" }}>
              <h4 style={{ color: "#333", marginBottom: "10px" }}>
                Payment Processors
              </h4>
              <p>
                Stripe and PayPal may set cookies for payment processing and
                fraud prevention.
              </p>
            </div>
          </div>
        </div>

        <div className="preferences-section">
          <h3 className="preferences-title">🍪 Cookie Preferences</h3>
          <p style={{ marginBottom: "20px", color: "#666" }}>
            Manage your cookie preferences below. Note that disabling certain
            cookies may affect website functionality.
          </p>

          <div className="preference-controls">
            {cookieTypes.map((type) => (
              <div key={type.id} className="preference-item">
                <div className="preference-info">
                  <div className="preference-name">{type.name}</div>
                  <div className="preference-desc">{type.description}</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    className="toggle-input"
                    defaultChecked={!type.canDisable}
                    disabled={!type.canDisable}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#e3f2fd",
              borderRadius: "8px",
            }}
          >
            <p style={{ margin: 0, color: "#1565c0", fontSize: "0.9rem" }}>
              💡 <strong>Tip:</strong> Your preferences are saved locally and
              will need to be set again if you clear your browser data.
            </p>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">4. Managing Cookies</h2>
          <div className="section-content">
            <p>You can control cookies through your browser settings:</p>

            <div style={{ marginTop: "20px" }}>
              <h4 style={{ color: "#333", marginBottom: "10px" }}>
                Browser Controls
              </h4>
              <ul className="list">
                <li>
                  <strong>Chrome:</strong> Settings → Privacy and Security →
                  Cookies and other site data
                </li>
                <li>
                  <strong>Firefox:</strong> Options → Privacy & Security →
                  Cookies and Site Data
                </li>
                <li>
                  <strong>Safari:</strong> Preferences → Privacy → Manage
                  Website Data
                </li>
                <li>
                  <strong>Edge:</strong> Settings → Cookies and site permissions
                </li>
              </ul>
            </div>

            <div style={{ marginTop: "20px" }}>
              <h4 style={{ color: "#333", marginBottom: "10px" }}>
                Mobile Devices
              </h4>
              <ul className="list">
                <li>
                  <strong>iOS Safari:</strong> Settings → Safari → Privacy &
                  Security
                </li>
                <li>
                  <strong>Android Chrome:</strong> Chrome menu → Settings → Site
                  settings → Cookies
                </li>
              </ul>
            </div>

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "#fff3cd",
                borderRadius: "8px",
              }}
            >
              <p style={{ margin: 0, color: "#856404" }}>
                ⚠️ <strong>Note:</strong> Blocking or deleting cookies may
                impact your experience on our website and limit available
                features.
              </p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">5. Cookie Consent</h2>
          <div className="section-content">
            <p>
              When you first visit our website, we'll ask for your consent to
              use non-essential cookies. You can:
            </p>
            <ul className="list">
              <li>Accept all cookies for the full experience</li>
              <li>Customize your preferences by cookie type</li>
              <li>
                Reject optional cookies (essential cookies will still be used)
              </li>
              <li>
                Change your preferences at any time using the cookie banner
              </li>
            </ul>

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "#d4edda",
                borderRadius: "8px",
              }}
            >
              <p style={{ margin: 0, color: "#155724" }}>
                ✅ Your consent choices are remembered for up to 12 months or
                until you change them.
              </p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">6. Updates to This Policy</h2>
          <div className="section-content">
            <p>We may update this Cookie Policy to reflect changes in:</p>
            <ul className="list">
              <li>The cookies we use</li>
              <li>Legal requirements</li>
              <li>Our data practices</li>
              <li>Third-party integrations</li>
            </ul>
            <p>
              We'll notify you of significant changes through our website or
              email. The "Last updated" date at the top indicates when changes
              were made.
            </p>
          </div>
        </div>

        <div className="contact-info">
          <h3 className="contact-title">Questions About Cookies?</h3>
          <p>
            If you have questions about our use of cookies or this policy,
            contact us:
          </p>
          <ul className="list">
            <li>
              <strong>Email:</strong> privacy@dvc-cards.com
            </li>
            <li>
              <strong>Subject Line:</strong> "Cookie Policy Inquiry"
            </li>
            <li>
              <strong>Address:</strong> DVC Privacy Team, 123 Digital Avenue,
              Tech City, TC 12345
            </li>
          </ul>
          <p>
            We typically respond to cookie-related inquiries within 2 business
            days.
          </p>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;
