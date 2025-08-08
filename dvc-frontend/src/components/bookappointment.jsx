import { notification } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { appointmentAPI } from "../services/api";

// Helper: HH:mm string → minutes
const toMin = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
// Helper: minutes → HH:mm string
const fromMin = (mins) => {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};
// weekday index → name
const weekdayName = (d) =>
  [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][d.getDay()];

// Props: pass the DVC owner's id/handle from URL or parent
const BookAppointment = () => {
  const { ownerId } = useParams(); // <-- use this ownerId

  const [scheduler, setScheduler] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [takenSlots, setTakenSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", note: "" });

  useEffect(() => {
    const load = async () => {
      try {
        // get scheduler for profile owner
        const res = await appointmentAPI.getAppointmentScheduler(ownerId);
        setScheduler(res.data); // expect { activeDays, timeRanges, slotDuration }
      } catch (e) {
        notification.error({ message: "Unable to load slots" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [ownerId]);

  // When date changes, fetch booked slots for that date
  useEffect(() => {
    (async () => {
      if (!date) return;
      try {
        const res = await appointmentAPI.getBookedSlots({ ownerId, date });
        // Expect array of strings like ["10:00","11:30"] OR objects containing time
        const list = Array.isArray(res.data)
          ? res.data.map((x) => (typeof x === "string" ? x : x.time))
          : [];
        setTakenSlots(list);
      } catch {
        setTakenSlots([]);
      }
    })();
  }, [date, ownerId]);

  // Compute allowed slots for selected date
  const slotsForDate = useMemo(() => {
    if (!scheduler || !date) return [];
    const d = new Date(date + "T00:00:00");
    const dayName = weekdayName(d);
    if (!scheduler.activeDays.includes(dayName)) return [];

    const [from, to] = scheduler.timeRanges[dayName] || [];
    if (!from || !to) return [];

    const start = toMin(from);
    const end = toMin(to);
    const step = Math.max(5, scheduler.slotDuration || 30);

    const now = new Date();
    const isToday =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();

    const list = [];
    for (let t = start; t + step <= end; t += step) {
      const label = fromMin(t);
      // block past times if booking "today"
      if (isToday) {
        const [hh, mm] = label.split(":").map(Number);
        const slotDate = new Date(d);
        slotDate.setHours(hh, mm, 0, 0);
        if (slotDate <= now) continue;
      }
      list.push(label);
    }
    // remove taken ones
    return list.filter((s) => !takenSlots.includes(s));
  }, [scheduler, date, takenSlots]);

  const handleBook = async () => {
    if (!date || !selectedSlot || !form.name || !form.phone) {
      notification.warning({
        message: "Please fill name, phone, date and slot.",
      });
      return;
    }
    try {
      //   const currentUser = await userAPI.getCurrentUser().catch(() => null);
      // payload the backend expects
      const payload = {
        userId: ownerId,
        customerId: form.phone,
        visitorName: form.name,
        visitorPhone: form.phone,
        note: form.note,
        appointmentDate: date, // "YYYY-MM-DD"
        appointmentTime: selectedSlot, // "HH:mm"
      };
      const res = await appointmentAPI.createAppointment(payload);
      if (res.status === 201) {
        notification.success({ message: "Appointment requested!" });
        setTakenSlots((t) => [...t, selectedSlot]);
        setSelectedSlot("");
        setForm((f) => ({ ...f, note: "" }));
      } else {
        notification.error({ message: res.message || "Booking failed" });
      }
    } catch (e) {
      notification.error({
        message: e?.response?.data?.message || "Booking failed",
      });
    }
  };

  const isDayEnabled = (isoDate) => {
    if (!scheduler) return false;
    const d = new Date(isoDate + "T00:00:00");
    return scheduler.activeDays.includes(weekdayName(d));
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!scheduler) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          The owner hasn’t enabled appointments yet.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h3 className="mb-4 fw-bold">Book an Appointment</h3>

      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Your details</h5>
              <Form.Group className="mb-3">
                <Form.Label>Full name</Form.Label>
                <Form.Control
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Mobile number"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Note (optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Anything specific to discuss?"
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Pick date & time</h5>

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSelectedSlot("");
                  }}
                  // prevent picking past dates
                  min={new Date().toISOString().slice(0, 10)}
                />
                {date && !isDayEnabled(date) && (
                  <div className="mt-2">
                    <Badge bg="danger">
                      Owner has not enabled appointments for this day.
                    </Badge>
                  </div>
                )}
              </Form.Group>

              {date && isDayEnabled(date) && (
                <>
                  {slotsForDate.length === 0 ? (
                    <Alert variant="info">
                      No slots left for this day. Try another date.
                    </Alert>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {slotsForDate.map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant={
                            s === selectedSlot ? "primary" : "outline-primary"
                          }
                          onClick={() => setSelectedSlot(s)}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div className="d-flex justify-content-end mt-4">
                <Button
                  onClick={handleBook}
                  disabled={!date || !selectedSlot || !form.name || !form.phone}
                >
                  Book Appointment
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookAppointment;
