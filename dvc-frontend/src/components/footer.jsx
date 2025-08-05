import { useNavigate } from "react-router-dom";
import brandLogo from "../assets/images/cardflare_logo.svg"; // Adjust path as needed
import "../footer.css";

const ElegantFooter = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const quickLinks = [
    { name: "Home", href: "/home" },
    { name: "Create Card", href: "/create" },
    { name: "My Cards", href: "/my-cards" },
    // { name: "Pricing", href: "#pricing" },
    { name: "About Us", href: "/about" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "📘", href: "#" },
    { name: "Twitter", icon: "🐦", href: "#" },
    { name: "LinkedIn", icon: "💼", href: "#" },
    { name: "Instagram", icon: "📷", href: "#" },
    { name: "YouTube", icon: "📺", href: "#" },
  ];

  const supportLinks = [
    // { name: "Help Center", href: "#help" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "FAQ", href: "/faq" },
    // { name: "Live Chat", href: "#chat" },
    // { name: "Documentation", href: "#docs" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-and-conditions" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    // { name: "GDPR", href: "#gdpr" },
  ];

  return (
    <>
      <footer className="elegant-footer">
        <div className="footer-wave"></div>
        <div className="floating-elements">
          <div className="floating-card"></div>
          <div className="floating-card"></div>
          <div className="floating-card"></div>
        </div>

        <div className="footer-content">
          <div className="container">
            <div className="row">
              {/* Brand Section */}
              <div className="col-lg-4 col-md-6">
                <div className="footer-brand">
                  <img
                    src={brandLogo}
                    alt="Brand Logo"
                    style={{ maxWidth: "100px" }}
                  />
                  <h3 style={{ color: "#ffd700" }}>CardFlare</h3>
                  <p className="brand-tagline">
                    Create stunning digital visiting cards that make lasting
                    impressions. Share your professional identity instantly with
                    our modern, eco-friendly solution.
                  </p>
                  <div className="social-links">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className="social-link"
                        title={social.name}
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-lg-2 col-md-6 col-sm-6">
                <div className="footer-section">
                  <h4 className="footer-title">Quick Links</h4>
                  <ul className="footer-links">
                    {quickLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          onClick={() => {
                            navigate(link.href);
                          }}
                          className="footer-link"
                          style={{ cursor: "pointer" }}
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Support */}
              <div className="col-lg-2 col-md-6 col-sm-6">
                <div className="footer-section">
                  <h4 className="footer-title">Support</h4>
                  <ul className="footer-links">
                    {supportLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          onClick={() => {
                            navigate(link.href);
                          }}
                          className="footer-link"
                          style={{ cursor: "pointer" }}
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Newsletter */}
              <div className="col-lg-4 col-md-6">
                <div className="newsletter-section">
                  <h4 className="newsletter-title">Stay Updated</h4>
                  <p className="newsletter-subtitle">
                    Get the latest updates, tips, and exclusive offers delivered
                    to your inbox.
                  </p>
                  <div className="newsletter-form">
                    <input
                      type="email"
                      className="newsletter-input"
                      placeholder="Enter your email address"
                    />
                    <button
                      className="newsletter-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Thank you for subscribing! 🎉");
                      }}
                    >
                      Subscribe
                    </button>
                  </div>
                  <p className="newsletter-privacy">
                    🔒 We respect your privacy. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="row">
              <div className="col-12">
                <div className="trust-badges">
                  <div className="trust-badge">🔒 SSL Secured</div>
                  <div className="trust-badge">⚡ 99.9% Uptime</div>
                  <div className="trust-badge">🌍 Global CDN</div>
                  <div className="trust-badge">📱 Mobile First</div>
                  <div className="trust-badge">🌱 Carbon Neutral</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="container">
            <div className="footer-bottom-content">
              <div className="copyright">
                © {currentYear} CardFlare. All rights reserved.
              </div>
              <div className="footer-bottom-links">
                {legalLinks.map((link, index) => (
                  <a
                    key={index}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(link.href);
                    }}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ElegantFooter;
