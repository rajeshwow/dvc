import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useAuth } from "../Auth/AuthContext";
import { analyticsAPI, cardAPI } from "../services/api";

const CardAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState("all");
  const [analyticsData, setAnalyticsData] = useState({
    totalViews: 0,
    totalShares: 0,
    totalDownloads: 0,
    totalContacts: 0,
    recentActivity: [],
    cardStats: [],
    topPerformingCards: [],
  });
  const [dateRange, setDateRange] = useState("7"); // 7 days default

  useEffect(() => {
    fetchCardsAndAnalytics();
  }, [selectedCard, dateRange]);

  const fetchCardsAndAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch user's cards
      const userCards = await cardAPI.getUserCards();
      setCards(userCards);

      // Fetch analytics data
      let analytics;
      if (selectedCard === "all") {
        analytics = await analyticsAPI.getAllCardsAnalytics(dateRange);
      } else {
        analytics = await analyticsAPI.getCardAnalytics(
          selectedCard,
          dateRange
        );
      }

      setAnalyticsData(analytics);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case "view":
          return "bi-eye";
        case "share":
          return "bi-share";
        case "download":
          return "bi-download";
        case "contact":
          return "bi-telephone";
        default:
          return "bi-activity";
      }
    };

    const getActivityColor = (type) => {
      switch (type) {
        case "view":
          return "primary";
        case "share":
          return "success";
        case "download":
          return "info";
        case "contact":
          return "warning";
        default:
          return "secondary";
      }
    };

    return (
      <div className="d-flex align-items-center py-2 border-bottom">
        <div
          className={`rounded-circle d-flex align-items-center justify-content-center me-3`}
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: `var(--bs-${getActivityColor(activity.type)}`,
            color: "white",
          }}
        >
          <i className={`${getActivityIcon(activity.type)} small`}></i>
        </div>
        <div className="flex-grow-1">
          <p className="mb-0 small">
            <strong>{activity.cardName}</strong> was {activity.type}ed
          </p>
          <small className="text-muted">
            {activity.location && `${activity.location} • `}
            {new Date(activity.timestamp).toLocaleDateString()}
          </small>
        </div>
        <Badge bg={getActivityColor(activity.type)} className="ms-2">
          {activity.type}
        </Badge>
      </div>
    );
  };

  if (loading) {
    return (
      <Container className="py-2 py-md-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading analytics...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-2 py-md-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-2 py-md-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Card Analytics</h2>
          <p className="text-muted mb-3 mb-md-0">
            Track your digital card performance and engagement
          </p>
        </div>
        <div className="d-flex gap-2">
          {/* Card Filter */}
          <Form.Select
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="all">All Cards</option>
            {cards?.map((card) => (
              <option key={card._id} value={card._id}>
                {card.name}
              </option>
            ))}
          </Form.Select>

          {/* Date Range Filter */}
          <Form.Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </Form.Select>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col sm={6} lg={3} className="mb-3">
          <StatCard
            title="Total Views"
            value={analyticsData?.totalViews?.toLocaleString()}
            icon="bi-eye"
            color="primary"
            change={12}
          />
        </Col>
        <Col sm={6} lg={3} className="mb-3">
          <StatCard
            title="Total Shares"
            value={analyticsData?.totalShares?.toLocaleString()}
            icon="bi-share"
            color="success"
            change={8}
          />
        </Col>
        <Col sm={6} lg={3} className="mb-3">
          <StatCard
            title="Downloads"
            value={analyticsData?.totalDownloads?.toLocaleString()}
            icon="bi-download"
            color="info"
            change={-2}
          />
        </Col>
        <Col sm={6} lg={3} className="mb-3">
          <StatCard
            title="Contacts"
            value={analyticsData?.totalContacts?.toLocaleString()}
            icon="bi-telephone"
            color="warning"
            change={15}
          />
        </Col>
      </Row>

      <Row>
        {/* Card Performance Table */}
        <Col lg={8} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Card Performance</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0" hover>
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 py-3">Card Name</th>
                      <th className="border-0 py-3">Views</th>
                      <th className="border-0 py-3">Shares</th>
                      <th className="border-0 py-3">Downloads</th>
                      <th className="border-0 py-3">Contacts</th>
                      <th className="border-0 py-3">Engagement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData?.cardStats?.map((card, index) => (
                      <tr key={card.cardId || index}>
                        <td className="py-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                              style={{
                                width: "32px",
                                height: "32px",
                                fontSize: "14px",
                              }}
                            >
                              {card.cardName
                                ? card.cardName.charAt(0).toUpperCase()
                                : "C"}
                            </div>
                            <span className="fw-medium">{card.cardName}</span>
                          </div>
                        </td>
                        <td className="py-3">{card.views.toLocaleString()}</td>
                        <td className="py-3">{card.shares.toLocaleString()}</td>
                        <td className="py-3">
                          {card.downloads.toLocaleString()}
                        </td>
                        <td className="py-3">
                          {card.contacts.toLocaleString()}
                        </td>
                        <td className="py-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="progress me-2"
                              style={{ width: "60px", height: "8px" }}
                            >
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${card.engagementRate}%` }}
                              ></div>
                            </div>
                            <small className="text-muted">
                              {card.engagementRate}%
                            </small>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col lg={4} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Activity</h5>
              <Badge bg="primary">
                {analyticsData?.recentActivity?.length}
              </Badge>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {analyticsData?.recentActivity?.length > 0 ? (
                  <div className="p-3">
                    {analyticsData?.recentActivity?.map((activity, index) => (
                      <ActivityItem key={index} activity={activity} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i
                      className="bi bi-activity text-muted"
                      style={{ fontSize: "2rem" }}
                    ></i>
                    <p className="text-muted mt-2 mb-0">No recent activity</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top Performing Cards */}
      {analyticsData.topPerformingCards?.length > 0 && (
        <Row>
          <Col lg={12}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">Top Performing Cards</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {analyticsData?.topPerformingCards
                    ?.slice(0, 3)
                    ?.map((card, index) => (
                      <Col md={4} key={card.cardId} className="mb-3">
                        <div className="text-center p-3 border rounded">
                          <div
                            className="rounded-circle bg-gradient mx-auto mb-2 d-flex align-items-center justify-content-center"
                            style={{
                              width: "60px",
                              height: "60px",
                              background: `linear-gradient(45deg, var(--bs-primary), var(--bs-info))`,
                              color: "white",
                              fontSize: "1.5rem",
                            }}
                          >
                            {index + 1}
                          </div>
                          <h6 className="fw-bold">{card.cardName}</h6>
                          <p className="text-muted small mb-2">
                            {card.totalEngagements} total engagements
                          </p>
                          <div className="d-flex justify-content-center gap-3 small">
                            <span>
                              <i className="bi bi-eye me-1"></i>
                              {card.views}
                            </span>
                            <span>
                              <i className="bi bi-share me-1"></i>
                              {card.shares}
                            </span>
                            <span>
                              <i className="bi bi-download me-1"></i>
                              {card.downloads}
                            </span>
                          </div>
                        </div>
                      </Col>
                    ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CardAnalyticsDashboard;

export const StatCard = ({ title, value, icon, color, change }) => (
  <Card className="h-100 border-0 shadow-sm">
    <Card.Body>
      <div className="d-flex align-items-center">
        <div className="flex-grow-1">
          <p className="text-muted mb-1 small">{title}</p>
          <h3 className="mb-0 fw-bold">{value}</h3>
          {change && (
            <small className={`text-${change >= 0 ? "success" : "danger"}`}>
              <i
                className={`bi bi-arrow-${change >= 0 ? "up" : "down"} me-1`}
              ></i>
              {Math.abs(change)}% from last period
            </small>
          )}
        </div>
        <div
          className={`rounded-circle d-flex align-items-center justify-content-center`}
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: `var(--bs-${color})`,
            color: "white",
          }}
        >
          <i className={`bi ${icon} fs-5`}></i>
        </div>
      </div>
    </Card.Body>
  </Card>
);
