import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import cardBanner from "../assets/images/banner-group.png";
import FeaturesDemo from "./featuresDemo";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleMakeButtonClick = () => {
    navigate(isLoggedIn ? "/create" : "/login");
  };

  return (
    <>
      <Container fluid className="py-2 px-md-5 mb-5">
        <Row className="align-items-center">
          {/* Left Column - Information */}
          <Col md={5} className="mb-5 mb-md-0 pe-md-5 ps-md-5 ps-lg-5 ">
            <h1 className="fw-bold display-5 mb-4">
              Create Your Digital Visiting Card
            </h1>

            <p className="fs-5 text-muted mb-4">
              Share your professional identity instantly with a modern digital
              card. Stand out from the crowd with interactive features and easy
              sharing options.
            </p>

            {/* Features */}
            <div className="mb-4">
              {[
                {
                  title: "Mobile Optimized",
                  desc: "Works perfectly on all devices",
                },
                {
                  title: "Easy Sharing",
                  desc: "Share via QR code or direct link",
                },
                {
                  title: "Fully Customizable",
                  desc: "Design your card your way",
                },
              ].map((item, i) => (
                <div key={i} className="mb-3">
                  <h5 className="mb-1 fw-semibold">{item.title}</h5>
                  <p className="mb-0 text-muted">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-start">
              <Button
                className="btn-primary px-4 py-2"
                style={{
                  fontSize: "16px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)",
                }}
                onClick={handleMakeButtonClick}
              >
                Let's Create
              </Button>
            </div>
          </Col>

          {/* Right Column - Image */}
          <Col md={7} className="text-center">
            <Image
              src={cardBanner}
              alt="Digital Visiting Card on Phone"
              fluid
              style={{ maxWidth: "100%", width: "720px" }}
            />
          </Col>
        </Row>
      </Container>

      <FeaturesDemo />
    </>
  );
};

export default Home;
