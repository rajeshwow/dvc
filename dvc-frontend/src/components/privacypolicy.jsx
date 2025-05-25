import moment from "moment";
const PrivacyPolicy = () => {
  const lastUpdated = moment().subtract(15, "days").format("MMMM DD, YYYY");

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

        .subsection {
          margin-bottom: 25px;
        }

        .subsection-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
        }

        .list {
          margin: 15px 0;
          padding-left: 20px;
        }

        .list li {
          margin-bottom: 8px;
        }

        .highlight {
          background: #f0f4ff;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
          margin: 20px 0;
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
        }
      `}</style>

      <div className="legal-document">
        <div className="document-header">
          <h1 className="document-title">Privacy Policy</h1>
          <p className="last-updated">Last updated: {lastUpdated}</p>
        </div>

        <div className="highlight">
          <strong>Your Privacy Matters:</strong> At DVC (Digital Visiting
          Cards), we are committed to protecting your personal information and
          being transparent about how we collect, use, and share your data.
        </div>

        <div className="section">
          <h2 className="section-title">1. Information We Collect</h2>

          <div className="subsection">
            <h3 className="subsection-title">Personal Information</h3>
            <p>
              When you create an account or digital visiting card, we collect:
            </p>
            <ul className="list">
              <li>Name and professional title</li>
              <li>Email address and phone number</li>
              <li>Company information and job details</li>
              <li>Profile photos and logos</li>
              <li>Social media profiles and website URLs</li>
              <li>
                Payment information (processed securely by third-party
                providers)
              </li>
            </ul>
          </div>

          <div className="subsection">
            <h3 className="subsection-title">Usage Data</h3>
            <p>
              We automatically collect information about how you use our
              service:
            </p>
            <ul className="list">
              <li>Device information (browser type, operating system)</li>
              <li>IP address and location data</li>
              <li>Pages visited and features used</li>
              <li>Time spent on our platform</li>
              <li>Card views and interaction analytics</li>
            </ul>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">2. How We Use Your Information</h2>
          <div className="section-content">
            <p>We use your personal information to:</p>
            <ul className="list">
              <li>
                <strong>Provide our service:</strong> Create and host your
                digital visiting cards
              </li>
              <li>
                <strong>Account management:</strong> Process registrations,
                payments, and support requests
              </li>
              <li>
                <strong>Analytics:</strong> Provide you with insights about your
                card performance
              </li>
              <li>
                <strong>Communication:</strong> Send service updates,
                newsletters, and promotional content
              </li>
              <li>
                <strong>Improvement:</strong> Enhance our platform based on
                usage patterns
              </li>
              <li>
                <strong>Security:</strong> Protect against fraud and maintain
                platform security
              </li>
            </ul>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">3. Information Sharing</h2>
          <div className="section-content">
            <p>
              We do not sell your personal information. We may share your data
              in these limited circumstances:
            </p>

            <div className="subsection">
              <h3 className="subsection-title">With Your Consent</h3>
              <p>
                When you choose to share your digital visiting card, the
                information on that card becomes visible to recipients.
              </p>
            </div>

            <div className="subsection">
              <h3 className="subsection-title">Service Providers</h3>
              <p>We work with trusted third-party providers for:</p>
              <ul className="list">
                <li>Payment processing (Stripe, PayPal)</li>
                <li>Email services (SendGrid, Mailchimp)</li>
                <li>Analytics (Google Analytics)</li>
                <li>Cloud hosting (AWS, Google Cloud)</li>
              </ul>
            </div>

            <div className="subsection">
              <h3 className="subsection-title">Legal Requirements</h3>
              <p>
                We may disclose information when required by law or to protect
                our rights and safety.
              </p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">4. Data Security</h2>
          <div className="section-content">
            <p>We implement industry-standard security measures:</p>
            <ul className="list">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Encrypted data storage</li>
              <li>Regular security audits and updates</li>
              <li>Limited access controls for our team</li>
              <li>Secure payment processing</li>
            </ul>
            <p>
              While we strive to protect your information, no internet
              transmission is 100% secure. We encourage users to protect their
              account credentials.
            </p>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">5. Your Rights and Choices</h2>
          <div className="section-content">
            <p>
              You have the following rights regarding your personal information:
            </p>

            <div className="subsection">
              <h3 className="subsection-title">Access and Portability</h3>
              <p>
                Request a copy of your personal data in a commonly used format.
              </p>
            </div>

            <div className="subsection">
              <h3 className="subsection-title">Correction</h3>
              <p>
                Update or correct inaccurate personal information through your
                account settings.
              </p>
            </div>

            <div className="subsection">
              <h3 className="subsection-title">Deletion</h3>
              <p>
                Request deletion of your account and associated data (some
                information may be retained for legal compliance).
              </p>
            </div>

            <div className="subsection">
              <h3 className="subsection-title">Marketing Communications</h3>
              <p>
                Opt-out of promotional emails using the unsubscribe link or your
                account preferences.
              </p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">6. Cookies and Tracking</h2>
          <div className="section-content">
            <p>We use cookies and similar technologies to:</p>
            <ul className="list">
              <li>Remember your login status</li>
              <li>Understand how you use our service</li>
              <li>Provide personalized experiences</li>
              <li>Analyze website performance</li>
            </ul>
            <p>
              You can manage cookie preferences through your browser settings.
              See our Cookie Policy for detailed information.
            </p>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">7. International Data Transfers</h2>
          <div className="section-content">
            <p>
              Your information may be processed in countries other than your
              residence. We ensure appropriate safeguards are in place for
              international transfers, including:
            </p>
            <ul className="list">
              <li>EU-US Privacy Shield compliance</li>
              <li>Standard contractual clauses</li>
              <li>Adequacy decisions by relevant authorities</li>
            </ul>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">8. Children's Privacy</h2>
          <div className="section-content">
            <p>
              Our service is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13. If you become aware that a child has provided us with personal
              information, please contact us immediately.
            </p>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">9. Changes to This Policy</h2>
          <div className="section-content">
            <p>
              We may update this Privacy Policy periodically. We will notify you
              of material changes by:
            </p>
            <ul className="list">
              <li>Email notification to registered users</li>
              <li>Prominent notice on our website</li>
              <li>In-app notifications</li>
            </ul>
            <p>
              Continued use of our service after changes constitutes acceptance
              of the updated policy.
            </p>
          </div>
        </div>

        <div className="contact-info">
          <h3 className="contact-title">Contact Us</h3>
          <p>
            If you have questions about this Privacy Policy or want to exercise
            your rights, contact us:
          </p>
          <ul className="list">
            <li>
              <strong>Email:</strong> privacy@dvc-cards.com
            </li>
            <li>
              <strong>Address:</strong> DVC Privacy Team, 123 Digital Avenue,
              Tech City, TC 12345
            </li>
            <li>
              <strong>Phone:</strong> +1 (555) 123-4567
            </li>
          </ul>
          <p>We will respond to your request within 30 days.</p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
