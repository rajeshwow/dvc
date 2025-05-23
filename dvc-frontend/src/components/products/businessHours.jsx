// src/components/BusinessHours.js
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Form, Modal, Row } from "react-bootstrap";

const DAYS_OF_WEEK = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const TIME_OPTIONS = [
  { value: "00:00", label: "12:00 AM" },
  { value: "00:30", label: "12:30 AM" },
  { value: "01:00", label: "1:00 AM" },
  { value: "01:30", label: "1:30 AM" },
  { value: "02:00", label: "2:00 AM" },
  { value: "02:30", label: "2:30 AM" },
  { value: "03:00", label: "3:00 AM" },
  { value: "03:30", label: "3:30 AM" },
  { value: "04:00", label: "4:00 AM" },
  { value: "04:30", label: "4:30 AM" },
  { value: "05:00", label: "5:00 AM" },
  { value: "05:30", label: "5:30 AM" },
  { value: "06:00", label: "6:00 AM" },
  { value: "06:30", label: "6:30 AM" },
  { value: "07:00", label: "7:00 AM" },
  { value: "07:30", label: "7:30 AM" },
  { value: "08:00", label: "8:00 AM" },
  { value: "08:30", label: "8:30 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "09:30", label: "9:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "13:30", label: "1:30 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "14:30", label: "2:30 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "15:30", label: "3:30 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "16:30", label: "4:30 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "17:30", label: "5:30 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "18:30", label: "6:30 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "19:30", label: "7:30 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "20:30", label: "8:30 PM" },
  { value: "21:00", label: "9:00 PM" },
  { value: "21:30", label: "9:30 PM" },
  { value: "22:00", label: "10:00 PM" },
  { value: "22:30", label: "10:30 PM" },
  { value: "23:00", label: "11:00 PM" },
  { value: "23:30", label: "11:30 PM" },
];

// Function to format time for display
const formatTimeDisplay = (timeValue) => {
  if (!timeValue) return "";

  // Handle both "HH:MM" and "HH:mm" formats
  const normalizedTime = timeValue.length === 5 ? timeValue : `${timeValue}:00`;
  const option = TIME_OPTIONS.find((opt) => opt.value === normalizedTime);

  if (option) {
    return option.label;
  }

  // Fallback: convert manually if not found in options
  const [hours, minutes] = normalizedTime.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const displayMinutes =
    minutes === 0 ? "" : `:${minutes.toString().padStart(2, "0")}`;

  return `${displayHours}${displayMinutes} ${period}`;
};

// Function to convert time string to minutes for comparison
const timeToMinutes = (timeString) => {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

// Function to check if business is currently open
const isCurrentlyOpen = (businessHours) => {
  if (!businessHours) return false;

  const now = new Date();
  const currentDay = DAYS_OF_WEEK[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const dayHours = businessHours[currentDay];

  if (!dayHours || !dayHours.isOpen) return false;

  const openMinutes = timeToMinutes(dayHours.open);
  const closeMinutes = timeToMinutes(dayHours.close);

  // Handle cases where close time is next day (e.g., 22:00 to 02:00)
  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  }

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
};

const BusinessHours = ({ businessHours, isOwner, onSave }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  // Initialize form data when businessHours prop changes
  useEffect(() => {
    const initialData = {};
    DAYS_OF_WEEK.forEach((day) => {
      if (businessHours && businessHours[day]) {
        // Use API data if available
        initialData[day] = {
          isOpen: businessHours[day].isOpen,
          open: businessHours[day].open,
          close: businessHours[day].close,
        };
      } else {
        // Default to closed for days not in API response
        initialData[day] = {
          isOpen: false,
          open: "09:00",
          close: "17:00",
        };
      }
    });
    setFormData(initialData);
  }, [businessHours]);

  // Check if currently open
  useEffect(() => {
    const checkOpenStatus = () => {
      setIsOpen(isCurrentlyOpen(businessHours));
    };

    checkOpenStatus(); // Check immediately

    // Set up timer to check open status every minute
    const timer = setInterval(checkOpenStatus, 60000);

    return () => clearInterval(timer);
  }, [businessHours]);

  const handleOpenChange = (day) => {
    setFormData((prevData) => ({
      ...prevData,
      [day]: {
        ...prevData[day],
        isOpen: !prevData[day].isOpen,
      },
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [day]: {
        ...prevData[day],
        [field]: value,
      },
    }));
  };

  const handleSaveHours = () => {
    // Validate times before saving
    const validatedData = { ...formData };

    DAYS_OF_WEEK.forEach((day) => {
      if (validatedData[day].isOpen) {
        const openMinutes = timeToMinutes(validatedData[day].open);
        const closeMinutes = timeToMinutes(validatedData[day].close);

        // If close time is earlier than open time, it's likely an overnight business
        // This is valid, so we don't need to change anything
        console.log(
          `${day}: ${validatedData[day].open} - ${validatedData[day].close}`
        );
      }
    });

    onSave(validatedData);
    setShowEditModal(false);
  };

  const handleModalClose = () => {
    // Reset form data to current businessHours when modal is closed without saving
    const resetData = {};
    DAYS_OF_WEEK.forEach((day) => {
      if (businessHours && businessHours[day]) {
        resetData[day] = {
          isOpen: businessHours[day].isOpen,
          open: businessHours[day].open,
          close: businessHours[day].close,
        };
      } else {
        // Default to closed for days not in API response
        resetData[day] = {
          isOpen: false,
          open: "09:00",
          close: "17:00",
        };
      }
    });
    setFormData(resetData);
    setShowEditModal(false);
  };

  const renderDay = (day) => {
    const dayInfo = businessHours?.[day];
    if (!dayInfo || !dayInfo.isOpen) {
      return <span>Closed</span>;
    }

    return (
      <span>
        {formatTimeDisplay(dayInfo.open)} - {formatTimeDisplay(dayInfo.close)}
      </span>
    );
  };

  console.log("formData", formData);
  console.log("businessHours", businessHours);

  return (
    <>
      <Card className="business-hours-card mt-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Business Hours</h5>
            {isOwner && (
              <Button
                variant="outline-secondary"
                size="sm"
                className="edit-hours-btn"
                onClick={() => setShowEditModal(true)}
              >
                <i className="bi bi-pencil me-1"></i>
                Edit
              </Button>
            )}
          </div>

          <div className="hours-status mb-3">
            <Badge bg={isOpen ? "success" : "secondary"} className="me-2">
              {isOpen ? "Open Now" : "Closed Now"}
            </Badge>
          </div>

          <ul className="business-hours-list">
            {DAYS_OF_WEEK.map((day, index) => (
              <li
                key={day}
                className={`business-day ${
                  day === DAYS_OF_WEEK[new Date().getDay()] ? "current-day" : ""
                }`}
              >
                <div className="day-name">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </div>
                <div className="day-hours">{renderDay(day)}</div>
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>

      {/* Edit Business Hours Modal */}
      <Modal show={showEditModal} onHide={handleModalClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Business Hours</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {DAYS_OF_WEEK.map((day) => (
              <Row
                key={day}
                className="mb-3 align-items-center business-hours-row"
              >
                <Col xs={3} md={2}>
                  <Form.Label className="mb-0 day-label">
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Form.Label>
                </Col>
                <Col xs={3} md={2}>
                  <Form.Check
                    type="switch"
                    id={`${day}-switch`}
                    label="Open"
                    checked={formData[day]?.isOpen || false}
                    onChange={() => handleOpenChange(day)}
                  />
                </Col>
                <Col xs={6} md={8}>
                  {formData[day]?.isOpen ? (
                    <Row>
                      <Col>
                        <Form.Select
                          value={formData[day]?.open || "09:00"}
                          onChange={(e) =>
                            handleTimeChange(day, "open", e.target.value)
                          }
                          disabled={!formData[day]?.isOpen}
                        >
                          {TIME_OPTIONS.map((time) => (
                            <option
                              key={`${day}-open-${time.value}`}
                              value={time.value}
                            >
                              {time.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col xs="auto" className="text-center">
                        <span>to</span>
                      </Col>
                      <Col>
                        <Form.Select
                          value={formData[day]?.close || "17:00"}
                          onChange={(e) =>
                            handleTimeChange(day, "close", e.target.value)
                          }
                          disabled={!formData[day]?.isOpen}
                        >
                          {TIME_OPTIONS.map((time) => (
                            <option
                              key={`${day}-close-${time.value}`}
                              value={time.value}
                            >
                              {time.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                  ) : (
                    <div className="closed-text text-muted">Closed</div>
                  )}
                </Col>
              </Row>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveHours}>
            Save Hours
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

BusinessHours.propTypes = {
  businessHours: PropTypes.object,
  isOwner: PropTypes.bool,
  onSave: PropTypes.func,
};

BusinessHours.defaultProps = {
  isOwner: false,
  onSave: () => {},
};

export default BusinessHours;
