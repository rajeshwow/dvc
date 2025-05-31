import { useEffect, useState } from "react";
import {
  Alert,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { analyticsAPI } from "../services/api";
import { StatCard } from "./cardAnalyticsDashboard";

const CardAnalytics = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState("30"); // Default to last 30 days

  // COLORS for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    // Verify the ID is available
    if (!id) {
      setError("Card ID is missing");
      setLoading(false);
      return;
    }

    console.log("Fetching analytics for card ID:", id);
    fetchAnalytics();
  }, [id, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      // Calculate date based on selected range
      const endDate = new Date();
      const startDate = new Date();

      switch (dateRange) {
        case "7":
          startDate.setDate(endDate.getDate() - 7);
          break;
        case "30":
          startDate.setDate(endDate.getDate() - 30);
          break;
        case "90":
          startDate.setDate(endDate.getDate() - 90);
          break;
        case "all":
          startDate.setFullYear(2020); // Set to a past date to get all data
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      const response = await analyticsAPI.getCardAnalytics(id, dateRange);

      setAnalytics(response);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for device breakdown pie chart
  const prepareDeviceData = () => {
    if (!analytics || !analytics.deviceBreakdown) return [];

    return Object.entries(analytics.deviceBreakdown).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  };

  console.log("ddddddddddddgggggggggggggggg", analytics);

  // Convert interactions to data for bar/pie chart
  const prepareInteractionsData = () => {
    if (!analytics || !analytics.summary) return [];

    return [
      { name: "Contact Clicks", value: analytics?.summary?.contactClicks },
      { name: "Social Clicks", value: analytics?.summary?.socialClicks },
      { name: "Downloads", value: analytics?.summary?.downloads },
      { name: "Shares", value: analytics?.summary?.shares },
    ];
  };

  // Fill in missing dates in timeline data
  const fillMissingDates = (data) => {
    if (!data || data.length === 0) return [];

    const filledData = [];
    const startDate = new Date(data[0].date);
    const endDate = new Date(data[data.length - 1].date);

    // Create a map of existing dates for quick lookup
    const dateMap = data.reduce((acc, item) => {
      acc[item.date] = item.views;
      return acc;
    }, {});

    // Loop through each day and create entries
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      filledData.push({
        date: dateStr,
        views: dateMap[dateStr] || 0,
      });

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return filledData;
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!analytics) {
    return <Alert variant="warning">No analytics data available.</Alert>;
  }

  // Prepare timeline data with filled missing dates
  const timelineData = fillMissingDates(analytics.dailyViews || []);

  return (
    <Container>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Card Analytics</h2>
          <p className="text-muted mb-3 mb-md-0">
            Track your digital card performance and engagement
          </p>
        </div>
        <div className="d-flex gap-2">
          {/* Card Filter */}

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

      <Row className="mb-4">
        <Col sm={6} lg={3} className="mb-3">
          <StatCard
            title="Total Views"
            value={analytics?.totalViews?.toLocaleString()}
            icon="bi-eye"
            color="primary"
            change={12}
          />
        </Col>
        <Col sm={6} lg={3} className="mb-3">
          <StatCard
            title="Total Shares"
            value={analytics?.totalShares?.toLocaleString()}
            icon="bi-share"
            color="success"
            change={8}
          />
        </Col>
        <Col sm={6} lg={3} className="mb-3">
          <StatCard
            title="Downloads"
            value={analytics?.totalDownloads?.toLocaleString()}
            icon="bi-download"
            color="info"
            change={-2}
          />
        </Col>
        <Col sm={6} lg={3} className="mb-3">
          <StatCard
            title="Contacts"
            value={analytics?.totalContacts?.toLocaleString()}
            icon="bi-telephone"
            color="warning"
            change={15}
          />
        </Col>
      </Row>

      <Tabs defaultActiveKey="timeline" className="mb-4">
        <Tab eventKey="timeline" title="View Timeline">
          <Card>
            <Card.Body>
              <Card.Title>Views Over Time</Card.Title>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={timelineData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} views`, "Views"]}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString();
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Views"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="devices" title="Device Breakdown">
          <Row>
            <Col md={7}>
              <Card>
                <Card.Body>
                  <Card.Title>Views by Device</Card.Title>
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={prepareDeviceData()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareDeviceData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={5}>
              <Card>
                <Card.Body>
                  <Card.Title>Device Statistics</Card.Title>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Device Type</th>
                        <th>Views</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prepareDeviceData().map((device, index) => {
                        const totalViews = analytics?.summary?.totalViews;
                        const percentage =
                          totalViews > 0
                            ? ((device.value / totalViews) * 100).toFixed(1)
                            : "0";

                        return (
                          <tr key={index}>
                            <td>{device.name}</td>
                            <td>{device.value}</td>
                            <td>{percentage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="interactions" title="Interactions">
          <Row>
            <Col md={7}>
              <Card>
                <Card.Body>
                  <Card.Title>User Interactions</Card.Title>
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={prepareInteractionsData()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareInteractionsData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={5}>
              <Card>
                <Card.Body>
                  <Card.Title>Interaction Details</Card.Title>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Contact Button Clicks</td>
                        <td>{analytics?.summary?.contactClicks}</td>
                      </tr>
                      <tr>
                        <td>Social Media Clicks</td>
                        <td>{analytics?.summary?.socialClicks}</td>
                      </tr>
                      <tr>
                        <td>Downloads (vCard)</td>
                        <td>{analytics?.summary?.downloads}</td>
                      </tr>
                      <tr>
                        <td>Shares</td>
                        <td>{analytics?.summary?.shares}</td>
                      </tr>
                    </tbody>
                  </Table>

                  <div className="mt-3">
                    <h6>Engagement Rate</h6>
                    <p className="small text-muted">
                      Percentage of views that resulted in an interaction
                    </p>
                    {analytics?.summary?.totalViews > 0 ? (
                      <h4 className="text-success">
                        {(
                          ((analytics?.summary?.contactClicks +
                            analytics?.summary?.socialClicks +
                            analytics?.summary?.downloads +
                            analytics?.summary?.shares) /
                            analytics?.summary?.totalViews) *
                          100
                        ).toFixed(1)}
                        %
                      </h4>
                    ) : (
                      <p>No views yet</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default CardAnalytics;
