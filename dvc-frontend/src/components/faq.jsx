import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState(new Set());

  const navigate = useNavigate();

  const toggleItem = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const categories = [
    { id: "all", name: "All Questions", icon: "📋" },
    { id: "getting-started", name: "Getting Started", icon: "🚀" },
    { id: "features", name: "Features", icon: "⭐" },
    { id: "billing", name: "Billing & Plans", icon: "💳" },
    { id: "technical", name: "Technical", icon: "🔧" },
    { id: "customization", name: "Customization", icon: "🎨" },
    { id: "sharing", name: "Sharing & Analytics", icon: "📊" },
    { id: "account", name: "Account Management", icon: "👤" },
  ];

  const faqData = [
    {
      id: 1,
      category: "getting-started",
      question: "How do I create my first digital visiting card?",
      answer:
        'Creating your first digital visiting card is simple! Sign up for a free account, click "Create New Card," choose a template, fill in your information, customize the design, and publish. Your card will be ready to share in minutes.',
      popular: true,
    },
    {
      id: 2,
      category: "getting-started",
      question: "Is CardFlare really free to use?",
      answer:
        "Yes! We offer a generous free plan that includes basic card creation, sharing via QR code and link, and essential analytics. Premium plans unlock advanced features like custom branding, detailed analytics, and priority support.",
      popular: true,
    },
    {
      id: 3,
      category: "features",
      question: "What information can I include on my digital card?",
      answer:
        "You can include your name, title, company, phone numbers, email addresses, website, social media profiles, location, bio, profile photo, company logo, and much more. The possibilities are endless!",
      popular: true,
    },
    {
      id: 4,
      category: "sharing",
      question: "How do people view my digital card?",
      answer:
        "Recipients can view your card by scanning your QR code, clicking your custom link, or through direct sharing via messaging apps. No app download is required - it works on any device with a web browser.",
      popular: true,
    },
    {
      id: 5,
      category: "technical",
      question: "Do my contacts need to download an app?",
      answer:
        "No! That's the beauty of CardFlare. Your digital visiting card works on any device with a web browser. Recipients simply scan your QR code or click your link to view your information instantly.",
      popular: false,
    },
    {
      id: 6,
      category: "customization",
      question: "Can I customize the design of my card?",
      answer:
        "Absolutely! Choose from dozens of professional templates, customize colors, fonts, layouts, add your logo, change backgrounds, and make it truly yours. Premium users get access to advanced customization options.",
      popular: false,
    },
    {
      id: 7,
      category: "billing",
      question: "What's included in the premium plans?",
      answer:
        "Premium plans include unlimited cards, advanced analytics, custom branding, priority support, lead capture forms, CRM integrations, custom domains, and much more. Check our pricing page for detailed comparisons.",
      popular: false,
    },
    {
      id: 8,
      category: "sharing",
      question: "Can I track who views my card?",
      answer:
        "Yes! Our analytics dashboard shows you view counts, geographic data, device information, and engagement metrics. Premium users get detailed insights including contact information of people who interact with your card.",
      popular: false,
    },
    {
      id: 9,
      category: "account",
      question: "How do I update my card information?",
      answer:
        "Simply log into your account, select the card you want to edit, make your changes, and save. Updates are reflected immediately across all your shared links and QR codes. No need to redistribute!",
      popular: false,
    },
    {
      id: 10,
      category: "technical",
      question: "Is my data secure on CardFlare?",
      answer:
        "Absolutely! We use enterprise-grade security with SSL encryption, secure data centers, regular backups, and comply with GDPR and other privacy regulations. Your data is safe and private with us.",
      popular: false,
    },
    {
      id: 11,
      category: "features",
      question: "Can I create multiple cards for different purposes?",
      answer:
        "Yes! Create separate cards for different roles, events, or businesses. For example, have one for your main job, another for your side business, and one for networking events.",
      popular: false,
    },
    {
      id: 12,
      category: "billing",
      question: "Can I cancel my subscription anytime?",
      answer:
        "Of course! You can cancel your subscription at any time from your account settings. You'll continue to have access to premium features until the end of your billing period, then automatically switch to our free plan.",
      popular: false,
    },
    {
      id: 13,
      category: "customization",
      question: "Can I add my company branding?",
      answer:
        "Yes! Premium users can add custom logos, brand colors, custom domains, and even remove CardFlare branding entirely. Perfect for businesses that want a fully branded experience.",
      popular: false,
    },
    {
      id: 14,
      category: "sharing",
      question: "How do I share my card at networking events?",
      answer:
        "Print your QR code on business cards, add it to email signatures, display it on your phone screen, or use our Apple Wallet and Google Pay integration for instant sharing via NFC.",
      popular: false,
    },
    {
      id: 15,
      category: "technical",
      question: "What happens if I lose internet connection?",
      answer:
        "Your digital cards are hosted on our reliable cloud infrastructure with 99.9% uptime. However, recipients who have viewed your card before may have it cached on their device for offline viewing.",
      popular: false,
    },
  ];

  const filteredFAQs = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFAQs = faqData.filter((item) => item.popular);

  return (
    <>
      <style>{`
        .faq-page {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          min-height: 100vh;
          padding: 80px 0;
        }

        .faq-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .faq-hero {
          text-align: center;
          margin-bottom: 60px;
        }

        .hero-title-faq {
          font-size: 3rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle-faq {
          font-size: 1.2rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }

        .search-section {
          margin-bottom: 50px;
        }

        .search-container {
          position: relative;
          max-width: 500px;
          margin: 0 auto;
        }

        .search-input {
          width: 100%;
          padding: 18px 25px 18px 55px;
          border: 2px solid #e9ecef;
          border-radius: 50px;
          font-size: 1.1rem;
          background: white;
          transition: all 0.3s ease;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 5px 30px rgba(102, 126, 234, 0.2);
        }

        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          color: #666;
        }

        .categories-section {
          margin-bottom: 50px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .category-item {
          padding: 15px 20px;
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 25px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .category-item:hover {
          border-color: #667eea;
          background: #f0f4ff;
        }

        .category-item.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: transparent;
        }

        .popular-section {
          margin-bottom: 50px;
        }

        .section-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .popular-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .popular-item {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .popular-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border-color: #667eea;
        }

        .faq-list {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .faq-item {
          border-bottom: 1px solid #e9ecef;
          transition: all 0.3s ease;
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question {
          padding: 25px 30px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          transition: all 0.3s ease;
        }

        .faq-question:hover {
          background: #f8f9fa;
        }

        .faq-question.expanded {
          background: #f0f4ff;
          border-bottom: 1px solid #e9ecef;
        }

        .question-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          flex: 1;
          margin-right: 20px;
        }

        .expand-icon {
          font-size: 1.2rem;
          color: #667eea;
          transition: transform 0.3s ease;
        }

        .expand-icon.expanded {
          transform: rotate(180deg);
        }

        .faq-answer {
          padding: 0 30px 25px;
          background: #f8f9fa;
          color: #555;
          line-height: 1.7;
          border-top: 1px solid #e9ecef;
        }

        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .no-results-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .help-section {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          text-align: center;
          margin-top: 50px;
        }

        .help-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 15px;
        }

        .help-text {
          color: #666;
          margin-bottom: 25px;
          line-height: 1.6;
        }

        .help-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .help-btn {
          padding: 12px 30px;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .help-btn.primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .help-btn.secondary {
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .help-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .help-btn.secondary:hover {
          background: #667eea;
          color: white;
        }

        @media (max-width: 768px) {
          .hero-title-faq {
            font-size: 2.5rem;
          }

          .categories-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }

          .popular-grid {
            grid-template-columns: 1fr;
          }

          .faq-question {
            padding: 20px;
          }

          .faq-answer {
            padding: 0 20px 20px;
          }

          .help-buttons {
            flex-direction: column;
            align-items: center;
          }

          .help-btn {
            width: 100%;
            justify-content: center;
            max-width: 250px;
          }
        }
      `}</style>

      <div className="faq-page">
        <div className="faq-container">
          {/* Hero Section */}
          <div className="faq-hero">
            <h1 className="hero-title-faq">Frequently Asked Questions</h1>
            <p className="hero-subtitle-faq">
              Find answers to common questions about CardFlare. Can't find what
              you're looking for? Our support team is always ready to help!
            </p>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="categories-section">
            <div className="categories-grid">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`category-item ${
                    activeCategory === category.id ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Questions */}
          {searchTerm === "" && activeCategory === "all" && (
            <div className="popular-section">
              <h2 className="section-title">
                <span>🔥</span>
                Most Popular Questions
              </h2>
              <div className="popular-grid">
                {popularFAQs.map((item) => (
                  <div
                    key={item.id}
                    className="popular-item"
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="question-text">{item.question}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ List */}
          <div className="faq-list">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((item) => (
                <div key={item.id} className="faq-item">
                  <div
                    className={`faq-question ${
                      expandedItems.has(item.id) ? "expanded" : ""
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="question-text">{item.question}</div>
                    <span
                      className={`expand-icon ${
                        expandedItems.has(item.id) ? "expanded" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                  {expandedItems.has(item.id) && (
                    <div className="faq-answer">{item.answer}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🤔</div>
                <h3>No results found</h3>
                <p>
                  Try adjusting your search terms or browse our categories
                  above.
                </p>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="help-section">
            <h3 className="help-title">Still need help?</h3>
            <p className="help-text">
              Can't find the answer you're looking for? Our friendly support
              team is here to help you succeed with CardFlare.
            </p>
            <div className="help-buttons">
              <a
                onClick={() => {
                  navigate("/contact-us");
                }}
                className="help-btn primary"
              >
                <span>💬</span>
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
