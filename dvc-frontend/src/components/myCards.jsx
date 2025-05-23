// src/components/MyCards.js
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { cardAPI } from "../services/api";

const MyCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch user's cards when component mounts
    const fetchUserCards = async () => {
      try {
        setLoading(true);
        const data = await cardAPI.getUserCards();
        setCards(data);
      } catch (err) {
        console.error("Error fetching cards:", err);
        setError("Failed to load your cards. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserCards();
  }, []);

  console.log("gggggggggggggggggggggggggg", cards);

  const handleDeleteCard = async (cardId) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        await cardAPI.deleteCard(cardId);
        // Remove the deleted card from state
        setCards(cards.filter((card) => card._id !== cardId));
      } catch (err) {
        console.error("Error deleting card:", err);
        alert("Failed to delete card. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your cards...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Digital Cards</h1>
        <Button as={Link} to="/create" variant="primary">
          <i className="bi bi-plus-lg me-2"></i>
          Create New Card
        </Button>
      </div>

      {cards.length === 0 ? (
        <Alert variant="info">
          <p className="mb-0">
            You haven't created any cards yet. Click "Create New Card" to get
            started!
          </p>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {cards.map((card) => (
            <Col key={card._id}>
              <div className="card-container position-relative">
                <Link
                  to={`/edit/${card._id}`}
                  className="edit-button-float"
                  title="Edit Card"
                >
                  <i className="bi bi-pencil"></i>
                </Link>

                <Card className="h-100 shadow-sm card-hover-effect">
                  <div
                    style={{
                      height: "100px",
                      background:
                        card.backgroundType === "image" && card.backgroundImage
                          ? `url(${card.backgroundImage})`
                          : card.theme
                          ? card.theme === "blue"
                            ? "#1565c0"
                            : card.theme === "dark"
                            ? "#212121"
                            : card.theme === "green"
                            ? "#2e7d32"
                            : card.theme === "purple"
                            ? "#6a1b9a"
                            : card.theme === "orange"
                            ? "#e65100"
                            : "#1565c0"
                          : "#1565c0",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  {/* Circular logo overlay */}
                  <div
                    className="position-relative"
                    style={{ marginTop: "-50px", zIndex: 2 }}
                  >
                    <div
                      className="rounded-circle bg-white d-flex align-items-center justify-content-center border shadow-sm mx-auto"
                      style={{
                        width: "80px",
                        height: "80px",
                        overflow: "hidden",
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
                            fontSize: "2rem",
                            fontWeight: "bold",
                            color:
                              card.theme === "blue"
                                ? "#1565c0"
                                : card.theme === "dark"
                                ? "#212121"
                                : card.theme === "green"
                                ? "#2e7d32"
                                : card.theme === "purple"
                                ? "#6a1b9a"
                                : card.theme === "orange"
                                ? "#e65100"
                                : "#1565c0",
                          }}
                        >
                          {card.name ? card.name.charAt(0).toUpperCase() : "C"}
                        </span>
                      )}
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Title>{card.name}</Card.Title>
                    {card.title && (
                      <Card.Subtitle className="mb-2 text-muted">
                        {card.title}
                      </Card.Subtitle>
                    )}
                    <div className="mt-3 d-flex justify-content-between">
                      <small className="text-muted">
                        Created: {new Date(card.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white">
                    <div className="d-flex justify-content-between">
                      <Button
                        as={Link}
                        to={`/view/${card._id}`}
                        variant="outline-primary"
                        size="sm"
                        className="rounded-circle"
                      >
                        <i className="bi bi-eye "></i>
                        {/* View */}
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteCard(card._id)}
                      >
                        <i className="bi bi-trash "></i>
                      </Button>

                      <Button
                        as={Link}
                        to={`/analytics/${card._id}`}
                        variant="outline-primary"
                        size="sm"
                        className="rounded-circle"
                      >
                        <i className="bi bi-bar-chart "></i>
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyCards;
