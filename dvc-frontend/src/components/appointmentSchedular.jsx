import { notification } from "antd";
import { useEffect, useState } from "react";

import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { appointmentAPI, userAPI } from "../services/api";

const defaultDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const defaultAppointments = [
  {
    name: "John Doe",
    date: "2025-08-08",
    time: "10:00",
    day: "Monday",
    status: "Pending",
  },
  {
    name: "Jane Smith",
    date: "2025-08-09",
    time: "11:30",
    day: "Wednesday",
    status: "Pending",
  },
  {
    name: "Alice Johnson",
    date: "2025-08-10",
    time: "15:00",
    day: "Friday",
    status: "Pending",
  },
];

const AppointmentScheduler = () => {
  const [activeDays, setActiveDays] = useState([]);
  const [timeRanges, setTimeRanges] = useState({});
  const [slotDuration, setSlotDuration] = useState(30);
  const [appointments, setAppointments] = useState([]);
  const [dayFilter, setDayFilter] = useState("");
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    const defaultRange = { from: "10:00", to: "18:00" };
    const initialRanges = {};
    defaultDays.forEach((day) => {
      if (
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day)
      ) {
        initialRanges[day] = [defaultRange.from, defaultRange.to];
      }
    });
    setTimeRanges(initialRanges);
    setActiveDays(Object.keys(initialRanges));
    setAppointments(defaultAppointments);
  }, []);

  const handleDayToggle = (day, checked) => {
    if (checked) {
      setActiveDays([...activeDays, day]);
      setTimeRanges({ ...timeRanges, [day]: ["10:00", "18:00"] });
    } else {
      setActiveDays(activeDays.filter((d) => d !== day));
      const newRanges = { ...timeRanges };
      delete newRanges[day];
      setTimeRanges(newRanges);
    }
  };

  const handleSelectAllToggle = (checked) => {
    setAllChecked(checked);
    if (checked) {
      const allRanges = {};
      defaultDays.forEach((day) => {
        allRanges[day] = ["10:00", "18:00"];
      });
      setActiveDays(defaultDays);
      setTimeRanges(allRanges);
    } else {
      setActiveDays([]);
      setTimeRanges({});
    }
  };

  const handleTimeRangeChange = (day, from, to) => {
    const newTimeRanges = {
      ...timeRanges,
      [day]: [from, to],
    };
    setTimeRanges(newTimeRanges);
  };

  const handleSlotDurationChange = (e) => {
    setSlotDuration(parseInt(e.target.value));
  };

  const handleApprove = (index) => {
    const updated = [...appointments];
    updated[index].status = "Approved";
    setAppointments(updated);
  };

  const handleReject = (index) => {
    const updated = [...appointments];
    updated[index].status = "Rejected";
    setAppointments(updated);
  };

  const filteredAppointments = dayFilter
    ? appointments.filter((a) => a.day === dayFilter)
    : appointments;

  const saveAppointmentSettings = async () => {
    const appointmentData = {
      activeDays,
      timeRanges,
      slotDuration,
    };
    // eslint-disable-next-line no-debugger

    const userId = await userAPI.getCurrentUser().then((user) => user._id);
    // eslint-disable-next-line no-debugger
    try {
      const response = await appointmentAPI.createAppointmentScheduler({
        ...appointmentData,
        userId,
      });
      if (response.status === 200) {
        notification.success({
          message: "Success",
          description: response.message || "Settings saved successfully.",
        });
      }
    } catch (error) {
      console.error("Failed to save appointment settings:", error);
      alert("Something went wrong while saving.");
    }
  };

  return (
    <Container className="py-4">
      <h3 className="mb-4  fw-bold">My Appointment Slots</h3>

      <div className="mb-3">
        <Form.Check
          type="checkbox"
          label="Toggle All Days"
          checked={allChecked}
          onChange={(e) => handleSelectAllToggle(e.target.checked)}
        />
      </div>

      <Row className="g-4">
        {defaultDays.map((day) => (
          <Col xs={12} sm={6} md={4} lg={3} key={day}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <Form.Check
                  type="checkbox"
                  className="mb-2"
                  label={
                    <Badge
                      bg={activeDays.includes(day) ? "primary" : "secondary"}
                    >
                      {day}
                    </Badge>
                  }
                  checked={activeDays.includes(day)}
                  onChange={(e) => handleDayToggle(day, e.target.checked)}
                />
                <div className="d-flex justify-content-center gap-2 mt-2">
                  <Form.Control
                    type="time"
                    size="sm"
                    value={timeRanges[day]?.[0] || ""}
                    onChange={(e) =>
                      handleTimeRangeChange(
                        day,
                        e.target.value,
                        timeRanges[day]?.[1] || ""
                      )
                    }
                  />
                  <Form.Control
                    type="time"
                    size="sm"
                    value={timeRanges[day]?.[1] || ""}
                    onChange={(e) =>
                      handleTimeRangeChange(
                        day,
                        timeRanges[day]?.[0] || "",
                        e.target.value
                      )
                    }
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="mt-5">
        <h5 className="fw-semibold">Slot Duration (in minutes)</h5>
        <Form.Select
          value={slotDuration}
          onChange={handleSlotDurationChange}
          style={{ maxWidth: "180px" }}
        >
          {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </Form.Select>
      </div>
      <Button
        variant="primary"
        className="mt-3"
        onClick={saveAppointmentSettings}
      >
        Save Changes
      </Button>

      <div className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0 fw-semibold">Pending Appointments</h5>
          <Form.Select
            style={{ maxWidth: "200px" }}
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
          >
            <option value="">All Days</option>
            {defaultDays.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Form.Select>
        </div>

        {filteredAppointments.length === 0 ? (
          <Alert variant="info">No appointments yet.</Alert>
        ) : (
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Day</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt, index) => (
                <tr key={index}>
                  <td>{appt.name}</td>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                  <td>{appt.day}</td>
                  <td>
                    <Badge
                      bg={
                        appt.status === "Approved"
                          ? "success"
                          : appt.status === "Rejected"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {appt.status}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleApprove(index)}
                      disabled={appt.status !== "Pending"}
                    >
                      Approve
                    </Button>{" "}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleReject(index)}
                      disabled={appt.status !== "Pending"}
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Container>
  );
};

export default AppointmentScheduler;
