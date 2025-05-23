import { useEffect, useState } from "react";

// Enhanced version of CardView with animations and transitions
// Import the animations CSS

const AnimatedCardView = ({ card, theme }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
  }, []);

  // Determine header background style based on backgroundType
  const getHeaderStyle = () => {
    let style = {
      height: "120px",
      position: "relative",
    };

    // Add background based on type
    if (card.backgroundType === "image" && card.backgroundImage) {
      style.background = `url(${card.backgroundImage})`;
      style.backgroundSize = "cover";
      style.backgroundPosition = "center";
    } else if (card.backgroundType === "gradient" && card.backgroundImage) {
      style.background = card.backgroundImage;
      // Add animated gradient effect if it's a gradient
      style.backgroundSize = "200% 200%";
      style.animation = "gradientShift 10s ease infinite";
    } else if (card.backgroundType === "pattern" && card.backgroundImage) {
      style.backgroundImage = card.backgroundImage;
      style.backgroundColor = theme.primary;
    } else {
      style.background = theme.primary;
    }

    return style;
  };

  return (
    <div
      className={`card shadow border-0 mb-4 ${
        isVisible ? "card-animate-in" : ""
      } card-hover-effect`}
      style={{ fontFamily: card.fontStyle }}
    >
      {/* Card header - Add animated-background for shine effect */}
      <div style={getHeaderStyle()} className="animated-background">
        {/* Profile image/logo */}
        <div
          className={`rounded-circle bg-white d-flex align-items-center justify-content-center border shadow-sm position-absolute profile-image-animate`}
          style={{
            width: "120px",
            height: "120px",
            bottom: "-60px",
            left: "50%",
            transform: "translateX(-50%)",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          {card.logoUrl ? (
            <img
              src={card.logoUrl}
              alt={card.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <span
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                color: theme.primary,
              }}
            >
              {card.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className="card-body text-center pt-5 mt-4">
        <h2 className="mb-1 fw-bold fade-in-fast">{card.name}</h2>
        {card.title && (
          <p className="text-muted mb-1 fade-in-medium">{card.title}</p>
        )}
        {card.company && <p className="mb-3 fade-in-medium">{card.company}</p>}

        {card.bio && <p className="my-3 fade-in-medium">{card.bio}</p>}

        {/* Contact buttons */}
        <div className="d-flex justify-content-center flex-wrap gap-2 my-4 fade-in-slow">
          {card.email && (
            <a
              href={`mailto:${card.email}`}
              className="btn btn-outline-primary rounded-pill action-button"
            >
              <i className="bi bi-envelope me-2"></i>
              Email
            </a>
          )}

          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              className="btn btn-outline-primary rounded-pill action-button"
            >
              <i className="bi bi-telephone me-2"></i>
              Call
            </a>
          )}

          {card.website && (
            <a
              href={card.website}
              className="btn btn-outline-primary rounded-pill action-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-globe me-2"></i>
              Website
            </a>
          )}
        </div>

        {/* Social links */}
        <div className="d-flex justify-content-center gap-3 my-4 fade-in-slow">
          {card.linkedin && (
            <a
              href={card.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center social-icon"
                style={{
                  width: "40px",
                  height: "40px",
                  background: theme.primary,
                  color: "white",
                }}
              >
                <i className="bi bi-linkedin"></i>
              </div>
            </a>
          )}

          {card.twitter && (
            <a
              href={card.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center social-icon"
                style={{
                  width: "40px",
                  height: "40px",
                  background: theme.primary,
                  color: "white",
                }}
              >
                <i className="bi bi-twitter"></i>
              </div>
            </a>
          )}

          {card.instagram && (
            <a
              href={card.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center social-icon"
                style={{
                  width: "40px",
                  height: "40px",
                  background: theme.primary,
                  color: "white",
                }}
              >
                <i className="bi bi-instagram"></i>
              </div>
            </a>
          )}

          {card.github && (
            <a
              href={card.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center social-icon"
                style={{
                  width: "40px",
                  height: "40px",
                  background: theme.primary,
                  color: "white",
                }}
              >
                <i className="bi bi-github"></i>
              </div>
            </a>
          )}
        </div>

        {card.address && (
          <p className="text-muted fade-in-slow">
            <i className="bi bi-geo-alt me-2"></i>
            {card.address}
          </p>
        )}
      </div>
    </div>
  );
};

export default AnimatedCardView;
