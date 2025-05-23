import { Button, Card, Col, Row } from "react-bootstrap";
import { cardTemplates } from "./cardTemplates";

const TemplateSelector = ({ onSelectTemplate }) => {
  return (
    <div className="mb-4">
      <h4 className="mb-3">Choose a Template</h4>
      <Row xs={1} md={3} className="g-3">
        {cardTemplates.map((template) => (
          <Col key={template.id}>
            <Card
              className="h-100 shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() => onSelectTemplate(template)}
            >
              {template.preview ? (
                <Card.Img
                  variant="top"
                  src={template.preview}
                  alt={template.name}
                  style={{ height: "120px", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    height: "120px",
                    background:
                      template.backgroundType === "color"
                        ? template.theme === "blue"
                          ? "#1565c0"
                          : template.theme === "dark"
                          ? "#212121"
                          : template.theme === "green"
                          ? "#2e7d32"
                          : template.theme === "purple"
                          ? "#6a1b9a"
                          : template.theme === "orange"
                          ? "#e65100"
                          : "#1565c0"
                        : template.backgroundImage,
                  }}
                />
              )}
              <Card.Body className="text-center">
                <Card.Title className="fs-6">{template.name}</Card.Title>
                <Card.Text className="small text-muted">
                  {template.description}
                </Card.Text>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template);
                  }}
                >
                  Use Template
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TemplateSelector;
