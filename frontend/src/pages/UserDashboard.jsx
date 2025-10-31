import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/UserDashboard.css";

export default function UserDashboard() {
  const { token, user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [feedbackForms, setFeedbackForms] = useState({});
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`http://localhost:5000/bookings/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, [token, user.id]);

  const handleFeedbackChange = (bookingId, field, value) => {
    setFeedbackForms((prev) => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], [field]: value },
    }));
  };

  const handleFeedbackSubmit = async (bookingId, eventId) => {
    const feedback = feedbackForms[bookingId];
    if (!feedback?.rating || feedback.rating < 1 || feedback.rating > 5) {
      setMessage("Please provide a valid rating (1–5).");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: eventId,
          userId: user.id,
          rating: feedback.rating,
          comment: feedback.comment || "",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Feedback submitted successfully!");
        setMessageType("success");
        setSubmittedFeedbacks((prev) => ({ ...prev, [bookingId]: true }));
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Feedback submission failed.");
        setMessageType("error");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setMessage("Error submitting feedback.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        <h2 className="dashboard-title">Welcome, {user.name}</h2>
        
        <div className="user-info-section">
          <div className="user-info-card">
            <p className="user-info-item">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="user-info-item">
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        </div>

        <div className="bookings-section">
          <h3 className="section-title">Your Bookings</h3>
          
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          {bookings.length === 0 ? (
            <div className="empty-state">
              You haven't booked any events yet.
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((b) => (
                <div key={b.id} className="booking-card">
                  <div className="booking-info">
                    <p className="event-name">{b.Event?.name}</p>
                    <p>
                      <strong>Tickets:</strong> {b.no_of_tickets}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{b.total_price}
                    </p>
                    
                    {b.Payment?.status === "pending" && (
                      <button
                        className="action-button payment-button"
                        onClick={() => navigate(`/payments/${b.Payment.id}/pay`)}
                      >
                        Complete Payment
                      </button>
                    )}
                  </div>

                  {!submittedFeedbacks[b.id] && (
                    <div className="feedback-section">
                      <h4 className="feedback-title">Give Feedback</h4>
                      <div className="feedback-form">
                        <div className="form-group">
                          <label>Rating (1–5):</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={feedbackForms[b.id]?.rating || ""}
                            onChange={(e) =>
                              handleFeedbackChange(b.id, "rating", e.target.value)
                            }
                            className="rating-input"
                            placeholder="Enter rating"
                          />
                        </div>
                        <div className="form-group">
                          <label>Comment:</label>
                          <textarea
                            value={feedbackForms[b.id]?.comment || ""}
                            onChange={(e) =>
                              handleFeedbackChange(b.id, "comment", e.target.value)
                            }
                            className="comment-textarea"
                            placeholder="Share your experience (optional)"
                            rows="3"
                          />
                        </div>
                        <button
                          className="action-button submit-feedback-button"
                          onClick={() => handleFeedbackSubmit(b.id, b.Event.id)}
                        >
                          Submit Feedback
                        </button>
                      </div>
                    </div>
                  )}

                  {submittedFeedbacks[b.id] && (
                    <div className="feedback-submitted">
                      ✓ Feedback submitted. Thank you!
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}