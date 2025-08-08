// src/components/AppointmentScheduler.jsx
import { notification } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
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

const AppointmentScheduler = () => {
  const [activeDays, setActiveDays] = useState([]);
  const [timeRanges, setTimeRanges] = useState({});
  const [slotDuration, setSlotDuration] = useState(30);
  const [appointments, setAppointments] = useState([]);
  const [dayFilter, setDayFilter] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  // initialize default weekday ranges
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
  }, []);

  // fetch logged-in user's appointments
  useEffect(() => {
    (async () => {
      try {
        const me = await userAPI.getCurrentUser(); // needs valid token
        const res = await appointmentAPI.getAppointmentOfUser(me._id); // your existing API name

        if (!res?.success) throw new Error("API returned unsuccessful");

        const rows = (res.data || []).map((a) => {
          const d = new Date(a.appointmentDate);
          const day = d.toLocaleDateString(undefined, { weekday: "long" });
          return {
            id: a._id,
            name: a.visitorName,
            date: d.toISOString().slice(0, 10), // YYYY-MM-DD
            time: a.appointmentTime,
            day,
            status: a.status, // "Pending" | "Approved" | "Rejected"
          };
        });

        setAppointments(rows);
      } catch (err) {
        console.error("Couldn’t load appointments:", err);
        notification.error({
          message: "Couldn’t load appointments",
          description: "Please try again in a bit.",
        });
      }
    })();
  }, []);

  const handleDayToggle = (day, checked) => {
    if (checked) {
      setActiveDays((prev) => [...prev, day]);
      setTimeRanges((prev) => ({ ...prev, [day]: ["10:00", "18:00"] }));
    } else {
      setActiveDays((prev) => prev.filter((d) => d !== day));
      setTimeRanges((prev) => {
        const next = { ...prev };
        delete next[day];
        return next;
      });
    }
  };

  const handleSelectAllToggle = (checked) => {
    setAllChecked(checked);
    if (checked) {
      const allRanges = {};
      defaultDays.forEach((day) => (allRanges[day] = ["10:00", "18:00"]));
      setActiveDays(defaultDays);
      setTimeRanges(allRanges);
    } else {
      setActiveDays([]);
      setTimeRanges({});
    }
  };

  const handleTimeRangeChange = (day, from, to) => {
    setTimeRanges((prev) => ({ ...prev, [day]: [from, to] }));
  };

  const handleSlotDurationChange = (e) => {
    setSlotDuration(parseInt(e.target.value, 10));
  };

  // (local-only) approve/reject toggles; wire to backend later if needed
  const handleApprove = async (id, index) => {
    try {
      setApprovingId(id);
      const res = await appointmentAPI.approveAppointment(id);
      if (!res?.success) throw new Error(res?.message || "Approve failed");

      // Optimistically update the row
      setAppointments((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], status: "Approved" };
        return next;
      });
      notification.success({ message: "Appointment approved" });
    } catch (err) {
      console.error("Approve failed:", err);
      notification.error({
        message: "Failed to approve",
        description: String(err.message || err),
      });
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = (index) => {
    setAppointments((prev) => {
      const next = [...prev];
      next[index].status = "Rejected";
      return next;
    });
  };

  const filteredAppointments = useMemo(
    () =>
      dayFilter
        ? appointments.filter((a) => a.day === dayFilter)
        : appointments,
    [appointments, dayFilter]
  );

  const saveAppointmentSettings = async () => {
    try {
      const me = await userAPI.getCurrentUser();
      const payload = {
        userId: me._id,
        activeDays,
        timeRanges,
        slotDuration,
      };

      const res = await appointmentAPI.createAppointmentScheduler(payload);

      if (res?.success) {
        notification.success({
          message: "Settings saved",
          description: res.message || "Your availability has been updated.",
        });
      } else {
        throw new Error(res?.message || "Save failed");
      }
    } catch (error) {
      console.error("Failed to save appointment settings:", error);
      notification.error({
        message: "Failed to save",
        description: "Please check your inputs and try again.",
      });
    }
  };

  return (
    <Container className="py-4">
      <h3 className="mb-4 fw-bold">My Appointment Slots</h3>

      <Accordion defaultActiveKey={["availability"]} alwaysOpen>
        {/* Panel 1: Availability / Slots */}
        <Accordion.Item eventKey="availability">
          <Accordion.Header>Availability & Slot Settings</Accordion.Header>
          <Accordion.Body>
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
                            bg={
                              activeDays.includes(day) ? "primary" : "secondary"
                            }
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
          </Accordion.Body>
        </Accordion.Item>

        {/* Panel 2: Pending Appointments */}
        <Accordion.Item eventKey="appointments">
          <Accordion.Header>Pending Appointments</Accordion.Header>
          <Accordion.Body>
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
                    <tr key={`${appt.date}-${appt.time}-${index}`}>
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
                          onClick={() => handleApprove(appt.id, index)}
                          disabled={appt.status !== "Pending"}
                        >
                          Approve
                        </Button>{" "}
                        {/* <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleReject(index)}
                          disabled={appt.status !== "Pending"}
                        >
                          Reject
                        </Button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default AppointmentScheduler;
