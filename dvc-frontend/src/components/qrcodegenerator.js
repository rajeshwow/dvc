// QRCodeGenerator.js
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { Alert, Button } from "react-bootstrap";

const QRCodeGenerator = ({ cardId, userName }) => {
  const [size, setSize] = useState(256);
  const downloadFormat = "svg";
  const qrRef = useRef(null);
  const bgColor = "#ffffff";
  const fgColor = "#000000";
  const [showAlert, setshowAlert] = useState(false);

  // Generate the URL to the user's digital card
  const cardUrl = `${window.location.origin}/view/${cardId}`;

  // Handle QR code download
  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-code-canvas");
    if (!canvas) return;

    let url;
    if (downloadFormat === "svg") {
      // For SVG format
      const svgData = new XMLSerializer().serializeToString(
        qrRef.current.querySelector("svg")
      );
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      url = URL.createObjectURL(svgBlob);
    } else {
      // For PNG format
      url = canvas.toDataURL("image/png");
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = `${
      userName ? userName.replace(/\s+/g, "-").toLowerCase() : "digital-card"
    }-qrcode.${downloadFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fallback: Share just the URL to WhatsApp
  const shareUrlToWhatsApp = () => {
    const message = `Check out my digital visiting card! 🌟\n\n${cardUrl}\n\n${
      userName ? `Connect with ${userName}` : "Connect with me"
    } digitally! 📱`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Copy QR code URL to clipboard
  const copyUrlToClipboard = async () => {
    // setTimeout(() => setshowAlert(false), 3000); // auto-close after 3 seconds

    try {
      // eslint-disable-next-line no-debugger
      await navigator.clipboard.writeText(cardUrl);
      setshowAlert(true);
      setTimeout(() => setshowAlert(false), 5000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = cardUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setshowAlert(true);
      setTimeout(() => setshowAlert(false), 5000);
    }
  };
  console.log("ssssssssssssss", showAlert);
  return (
    <div className="qr-code-generator">
      {showAlert && (
        <div className="alert-container">
          <Alert
            variant="light"
            onClose={() => setshowAlert(false)}
            dismissible
          >
            Copied
          </Alert>
        </div>
      )}

      <h3>QR Code for Your Digital Card</h3>
      <div className="qr-code-container" ref={qrRef}>
        <QRCodeSVG
          id="qr-code-canvas"
          value={cardUrl}
          size={size}
          bgColor={bgColor}
          fgColor={fgColor}
          level="H"
          //   includeMargin={includeMargin}
          renderAs={downloadFormat === "svg" ? "svg" : "canvas"}
        />
      </div>
      <div className="qr-code-controls">
        <div className="d-flex justify-content-between">
          <Button
            title="Share on WhatsApp"
            onClick={shareUrlToWhatsApp}
            variant="outline-primary"
          >
            <i className="bi bi-share-fill"></i>
          </Button>
          <Button
            title="Download QR Code"
            onClick={downloadQRCode}
            variant="outline-primary"
          >
            <i className="bi bi-download"></i>
          </Button>
          <Button
            title="Copy to Clipboard"
            onClick={copyUrlToClipboard}
            variant="outline-primary"
          >
            <i className="bi bi-copy"></i>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
