import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/PaymentPage.css";

export default function PaymentPage() {
  const { token } = useContext(AuthContext);
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await fetch(`http://localhost:5000/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setPayment(data);
        } else {
          setMessage(data.message || "Failed to load payment details.");
          setMessageType("error");
        }
      } catch (err) {
        console.error(err);
        setMessage("Error fetching payment details.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [paymentId, token]);

  const handlePay = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`http://localhost:5000/payments/${paymentId}/pay`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setPayment({ ...payment, status: "completed" });
        setMessage("Payment successful! Redirecting to your dashboard...");
        setMessageType("success");
        setTimeout(() => navigate("/user-dashboard"), 2000);
      } else {
        setMessage(data.message || "Payment failed. Please try again.");
        setMessageType("error");
        setProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error processing payment. Please try again.");
      setMessageType("error");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="loading-state">Loading payment details...</div>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="error-state">
            <p>{message || "Payment not found."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-card">
          <span className="payment-icon">💳</span>
          
          <h2 className="payment-title">
            Payment for Booking #{payment.booking_id}
          </h2>

          <div className="payment-details">
            <div className="payment-detail-item payment-amount-highlight">
              <span className="payment-detail-label">Amount to Pay</span>
              <span className="payment-detail-value">₹{payment.amount.toLocaleString()}</span>
            </div>

            <div className="payment-detail-item">
              <span className="payment-detail-label">Payment Status</span>
              <span className={`status-badge ${payment.status}`}>
                {payment.status === "completed" ? "✓ Completed" : "⏱ Pending"}
              </span>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={payment.status === "completed" || processing}
            className={`payment-button ${
              payment.status === "completed" || processing ? "disabled" : "active"
            }`}
          >
            {processing ? (
              "Processing..."
            ) : payment.status === "completed" ? (
              <>
                <span className="success-icon">✓</span>
                Payment Completed
              </>
            ) : (
              "Pay Now"
            )}
          </button>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          <div className="security-notice">
            <p>
              <span className="security-icon">🔒</span>
              Your payment is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}