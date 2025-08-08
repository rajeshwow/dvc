import { notification } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../featuresdemo.css";

const FeaturesDemo = () => {
  const [animatedCards, setAnimatedCards] = useState(new Set());
  const cardsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setAnimatedCards(
            (prev) => new Set([...prev, entry.target.dataset.index])
          );
        }
      });
    }, observerOptions);

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const startCreating = () => {
    notification.success({
      message: "Redirecting",
      description: "You will be redirected to the card creator shortly.",
    });
  };

  const features = [
    {
      icon: "📱",
      title: "Mobile Optimized",
      description:
        "Perfect experience across all devices. Your card adapts beautifully to any screen size.",
      demo: (
        <div className="d-flex flex-column align-items-center">
          <div className="demo-phone mb-2">
            <div className="demo-screen">📇</div>
          </div>
          <small className="text-white-50">Responsive Design</small>
        </div>
      ),
    },
    {
      icon: "🔗",
      title: "Easy Sharing",
      description:
        "Share via QR code, direct link, or social media. No app downloads required!",
      demo: (
        <div className="d-flex flex-column align-items-center">
          <div className="demo-qr mb-2">⬜</div>
          <div className="d-flex justify-content-center">
            <div className="share-icon me-2">📧</div>
            <div className="share-icon me-2">💬</div>
            <div className="share-icon">🔗</div>
          </div>
        </div>
      ),
    },
    {
      icon: "🎨",
      title: "Fully Customizable",
      description:
        "Design your card your way. Choose colors, layouts, and add your personal touch.",
      demo: (
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex justify-content-center mb-2">
            <div
              className="color-dot me-2"
              style={{ background: "#ff6b6b" }}
            ></div>
            <div
              className="color-dot me-2"
              style={{ background: "#4ecdc4" }}
            ></div>
            <div
              className="color-dot me-2"
              style={{ background: "#45b7d1" }}
            ></div>
            <div className="color-dot" style={{ background: "#96ceb4" }}></div>
          </div>
          <small className="text-white-50">Unlimited Themes</small>
        </div>
      ),
    },
    {
      icon: "📊",
      title: "Smart Analytics",
      description:
        "Track views, clicks, and engagement. Know who's interested in connecting with you.",
      demo: (
        <div className="d-flex flex-column align-items-center">
          <div
            className="d-flex justify-content-center align-items-end mb-2"
            style={{ height: "30px" }}
          >
            <div className="chart-bar me-1" style={{ height: "15px" }}></div>
            <div className="chart-bar me-1" style={{ height: "25px" }}></div>
            <div className="chart-bar me-1" style={{ height: "20px" }}></div>
            <div className="chart-bar" style={{ height: "30px" }}></div>
          </div>
          <small className="text-white-50">Real-time Insights</small>
        </div>
      ),
    },
    {
      icon: "🌱",
      title: "Eco-Friendly",
      description:
        "Go green! No more paper waste. Update your information instantly without reprinting.",
      demo: (
        <div className="text-center">
          <div className="fs-1 my-2">🌍</div>
          <small className="text-white-50">Save the Planet</small>
        </div>
      ),
    },
    {
      icon: "💼",
      title: "One-Click Contact",
      description:
        "Direct links to call, email, or add to contacts. Make networking effortless.",
      demo: (
        <div className="d-flex justify-content-center">
          <div className="contact-item me-2">📞</div>
          <div className="contact-item me-2">📧</div>
          <div className="contact-item">💼</div>
        </div>
      ),
    },
  ];

  return (
    <>
      <section className="features-section" id="features">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center text-white">
              <h2 className="section-title-feature mb-4">
                Revolutionary Features
              </h2>
              <p className="section-subtitle">
                Experience the future of professional networking with our
                cutting-edge digital visiting card technology
              </p>
            </div>
          </div>

          <div className="row g-4 mb-5">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div
                  ref={(el) => (cardsRef.current[index] = el)}
                  data-index={index.toString()}
                  className="feature-card text-center text-white"
                  style={{
                    opacity: animatedCards.has(index.toString()) ? 1 : 0,
                    transform: animatedCards.has(index.toString())
                      ? "translateY(0)"
                      : "translateY(50px)",
                  }}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="h4 mb-3">{feature.title}</h3>
                  <p className="text-white-50 mb-3">{feature.description}</p>
                  <div className="feature-demo">{feature.demo}</div>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="row">
            <div className="col-lg-6 mx-auto">
              <div className="text-center p-5">
                <h3 className="text-white mb-4 h2">See It In Action</h3>
                <div className="demo-card-preview pulse">
                  <div className="demo-avatar">👤</div>
                  <h4 className="text-dark mb-1">Alex Thompson</h4>
                  <p className="text-muted mb-3">Digital Marketing Director</p>
                  <div className="d-flex justify-content-around">
                    <div className="demo-contact-item">📞</div>
                    <div className="demo-contact-item">📧</div>
                    <div className="demo-contact-item">🌐</div>
                    <div className="demo-contact-item">💼</div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="row mt-5">
            <div className="col text-center">
              <button
                className="cta-button btn-lg"
                onClick={() => {
                  navigate("/create");
                }}
              >
                Create Your Digital Presence Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturesDemo;
