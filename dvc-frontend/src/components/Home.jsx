import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext"; // Import your auth context
import FeaturesDemo from "./featuresDemo";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleMakeButtonClick = () => {
    if (isLoggedIn) {
      navigate("/create"); // Navigate to create card component
    } else {
      navigate("/login"); // Navigate to login component
    }
  };

  return (
    <>
      <Container>
        <Row>
          {/* Left Column - Information and Form */}
          <Col md={6}>
            <h1 className="display-5 fw-bold text-primary mb-4">
              Create Your Digital Visiting Card
            </h1>
            <p className="lead mb-4">
              Share your professional identity instantly with a modern digital
              card. Stand out from the crowd with interactive features and easy
              sharing options.
            </p>

            {/* Features */}
            <div className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <div>
                  <h5 className="mb-0">Mobile Optimized</h5>
                  <p className="mb-0 text-muted">
                    Works perfectly on all devices
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div>
                  <h5 className="mb-0">Easy Sharing</h5>
                  <p className="mb-0 text-muted">
                    Share via QR code or direct link
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <div>
                  <h5 className="mb-0">Fully Customizable</h5>
                  <p className="mb-0 text-muted">Design your card your way</p>
                </div>
              </div>
            </div>
            <Button onClick={handleMakeButtonClick} variant="primary">
              Let's Make
            </Button>
          </Col>

          {/* Right Column - Phone Image */}
          <Col md={6} className="text-center">
            <Image
              src={"../assets/images/card-in-phone.jpg"}
              alt="Digital Visiting Card on Phone"
              fluid
            />
          </Col>
        </Row>
      </Container>
      <FeaturesDemo />
    </>
  );
};

export default Home;
