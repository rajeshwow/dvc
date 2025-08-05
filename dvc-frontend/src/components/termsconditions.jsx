const TermsOfService = () => {
  const lastUpdated = "December 15, 2024";

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

        .warning-box {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 20px;
          border-radius: 8px;
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
          <h1 className="document-title">Terms of Service</h1>
          <p className="last-updated">Last updated: {lastUpdated}</p>
        </div>

        <div className="highlight">
          <strong>Agreement:</strong> By accessing or using CardFlare (Digital
          Visiting Cards), you agree to be bound by these Terms of Service.
          Please read them carefully.
        </div>

        <div className="section">
          <h2 className="section-title">1. Acceptance of Terms</h2>
          <div className="section-content">
            <p>
              These Terms of Service ("Terms") govern your use of the CardFlare
              platform, website, and related services (collectively, the
              "Service") operated by CardFlare Inc. ("we," "us," or "our").
            </p>
            <p>
              By creating an account or using our Service, you acknowledge that
              you have read, understood, and agree to be bound by these Terms
              and our Privacy Policy.
            </p>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">2. Description of Service</h2>
          <div className="section-content">
            <p>
              CardFlare provides a platform for creating, customizing, and
              sharing digital visiting cards. Our Service includes:
            </p>
            <ul className="list">
              <li>Digital business card creation tools</li>
              <li>Customizable templates and designs</li>
              <li>Analytics and tracking features</li>
              <li>QR code generation and sharing</li>
              <li>Contact information management</li>
              <li>Integration with social media and professional networks</li>
            </ul>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">3. User Accounts and Registration</h2>

          <div className="subsection">
            <h3 className="subsection-title">Account Creation</h3>
            <p>
              To use certain features of our Service, you must create an
              account. You agree to:
            </p>
            <ul className="list">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information as needed</li>
              <li>Keep your login credentials secure and confidential</li>
              <li>Be responsible for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </div>

          <div className="subsection">
            <h3 className="subsection-title">Eligibility</h3>
            <p>
              You must be at least 18 years old to use our Service. By using
              CardFlare, you represent that you meet this age requirement and
              have the legal capacity to enter into these Terms.
            </p>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">4. Acceptable Use Policy</h2>
          <div className="section-content">
            <p>
              You agree to use our Service responsibly and in compliance with
              all applicable laws. You may not:
            </p>

            <div className="subsection">
              <h3 className="subsection-title">Prohibited Content</h3>
              <ul className="list">
                <li>
                  Upload content that is illegal, harmful, or violates others'
                  rights
                </li>
                <li>Include false, misleading, or fraudulent information</li>
                <li>
                  Share content that is offensive, discriminatory, or harassing
                </li>
                <li>Upload malicious code, viruses, or harmful software</li>
                <li>Infringe on intellectual property rights</li>
              </ul>
            </div>

            <div className="subsection">
              <h3 className="subsection-title">Prohibited Activities</h3>
              <ul className="list">
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use automated tools to access or scrape our platform</li>
                <li>Impersonate others or create fake accounts</li>
                <li>Spam or send unsolicited communications</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">
            5. Content and Intellectual Property
          </h2>

          <div className="subsection">
            <h3 className="subsection-title">Your Content</h3>
            <p>
              You retain ownership of the content you upload to create your
              digital visiting cards. By using our Service, you grant us a
              limited license to:
            </p>
            <ul className="list">
              <li>Host, store, and display your content</li>
              <li>Process and analyze your content to provide our Service</li>
              <li>
                Make your digital cards accessible to recipients you choose
              </li>
            </ul>
          </div>

          <div className="subsection">
            <h3 className="subsection-title">Our Intellectual Property</h3>
            <p>
              The CardFlare platform, including all software, designs, text,
              graphics, and trademarks, is owned by us or our licensors. You may
              not:
            </p>
            <ul className="list">
              <li>Copy, modify, or distribute our proprietary content</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use our trademarks without written permission</li>
            </ul>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">6. Payment Terms</h2>

          <div className="subsection">
            <h3 className="subsection-title">Subscription Plans</h3>
            <p>
              CardFlare offers both free and paid subscription plans. Paid
              features include:
            </p>
            <ul className="list">
              <li>Advanced customization options</li>
              <li>Detailed analytics and insights</li>
              <li>Premium templates and designs</li>
              <li>Priority customer support</li>
              <li>Enhanced sharing capabilities</li>
            </ul>
          </div>

          <div className="subsection">
            <h3 className="subsection-title">Billing and Refunds</h3>
            <ul className="list">
              <li>
                Subscriptions are billed in advance on a monthly or annual basis
              </li>
              <li>All fees are non-refundable except as required by law</li>
              <li>You may cancel your subscription at any time</li>
              <li>
                Upon cancellation, you retain access until the end of your
                billing period
              </li>
              <li>
                We reserve the right to change pricing with 30 days' notice
              </li>
            </ul>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">7. Privacy and Data Protection</h2>
          <div className="section-content">
            <p>
              Your privacy is important to us. Our collection and use of
              personal information is governed by our Privacy Policy, which is
              incorporated into these Terms by reference. Key points include:
            </p>
            <ul className="list">
              <li>
                We collect only necessary information to provide our Service
              </li>
              <li>Your data is encrypted and securely stored</li>
              <li>We do not sell your personal information</li>
              <li>You can request data deletion at any time</li>
            </ul>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">
            8. Service Availability and Modifications
          </h2>
          <div className="section-content">
            <p>
              We strive to provide reliable service but cannot guarantee 100%
              uptime. We reserve the right to:
            </p>
            <ul className="list">
              <li>Modify or discontinue features with reasonable notice</li>
              <li>Perform maintenance that may temporarily affect service</li>
              <li>Update these Terms as needed</li>
              <li>Suspend or terminate accounts that violate these Terms</li>
            </ul>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">
            9. Disclaimers and Limitation of Liability
          </h2>

          <div className="warning-box">
            <strong>Important Legal Notice:</strong> Please read this section
            carefully as it limits our liability.
          </div>

          <div className="subsection">
            <h3 className="subsection-title">Service Disclaimers</h3>
            <p>
              Our Service is provided "as is" and "as available." We disclaim
              all warranties, including:
            </p>
            <ul className="list">
              <li>Merchantability and fitness for a particular purpose</li>
              <li>Uninterrupted or error-free service</li>
              <li>Security or accuracy of information</li>
              <li>Third-party integrations or services</li>
            </ul>
          </div>

          <div className="subsection">
            <h3 className="subsection-title">Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, we shall not be liable
              for:
            </p>
            <ul className="list">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>
                Damages exceeding the amount paid for our Service in the past 12
                months
              </li>
              <li>Actions of third parties or external services</li>
            </ul>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">10. Indemnification</h2>
          <div className="section-content">
            <p>
              You agree to indemnify and hold us harmless from any claims,
              damages, or expenses arising from:
            </p>
            <ul className="list">
              <li>Your use of the Service</li>
              <li>Content you upload or share</li>
              <li>Violation of these Terms</li>
              <li>Infringement of third-party rights</li>
            </ul>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">11. Termination</h2>

          <div className="subsection">
            <h3 className="subsection-title">Termination by You</h3>
            <p>You may terminate your account at any time by:</p>
            <ul className="list">
              <li>Using the account deletion feature in your settings</li>
              <li>Contacting our support team</li>
              <li>Canceling your subscription (if applicable)</li>
            </ul>
          </div>

          <div className="subsection">
            <h3 className="subsection-title">Termination by Us</h3>
            <p>We may suspend or terminate your account if you:</p>
            <ul className="list">
              <li>Violate these Terms or our policies</li>
              <li>Fail to pay subscription fees</li>
              <li>Engage in fraudulent or illegal activities</li>
              <li>Abuse our platform or other users</li>
            </ul>
          </div>

          <div className="subsection">
            <h3 className="subsection-title">Effect of Termination</h3>
            <p>Upon termination:</p>
            <ul className="list">
              <li>Your access to the Service will cease</li>
              <li>Your digital cards may become inaccessible</li>
              <li>We may delete your data according to our retention policy</li>
              <li>
                Certain provisions of these Terms will survive termination
              </li>
            </ul>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">12. Governing Law and Disputes</h2>
          <div className="section-content">
            <p>
              These Terms are governed by the laws of [Your State/Country]. Any
              disputes will be resolved through:
            </p>
            <ul className="list">
              <li>Good faith negotiation first</li>
              <li>Binding arbitration if negotiation fails</li>
              <li>Courts in [Your Jurisdiction] for non-arbitrable matters</li>
            </ul>
            <p>
              You waive the right to participate in class action lawsuits
              against us.
            </p>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">13. General Provisions</h2>

          <div className="subsection">
            <h3 className="subsection-title">Entire Agreement</h3>
            <p>
              These Terms, together with our Privacy Policy and any additional
              terms, constitute the entire agreement between you and us.
            </p>
          </div>

          <div className="subsection">
            <h3 className="subsection-title">Severability</h3>
            <p>
              If any provision of these Terms is found unenforceable, the
              remaining provisions will continue in full force.
            </p>
          </div>

          <div className="subsection">
            <h3 className="subsection-title">Assignment</h3>
            <p>
              You may not assign your rights under these Terms. We may assign
              our rights with reasonable notice.
            </p>
          </div>

          <div className="subsection">
            <h3 className="subsection-title">Updates to Terms</h3>
            <p>
              We may update these Terms periodically. We will notify users of
              material changes via email or platform notifications. Continued
              use constitutes acceptance of updated Terms.
            </p>
          </div>
        </div>

        <div className="contact-info">
          <h3 className="contact-title">Contact Information</h3>
          <p>Questions about these Terms of Service? Contact us:</p>
          <ul className="list">
            <li>
              <strong>Email:</strong> legal@CardFlare-cards.com
            </li>
            <li>
              <strong>Address:</strong> CardFlare Legal Department, 123 Digital
              Avenue, Tech City, TC 12345
            </li>
            <li>
              <strong>Phone:</strong> +1 (555) 123-4567
            </li>
          </ul>
          <p>We will respond to inquiries within 5 business days.</p>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;
