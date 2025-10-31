import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/EventBookingPage.css";

export default function EventBookingPage() {
  const { token, user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [noOfTickets, setNoOfTickets] = useState(1);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/events/${id}`);
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [id]);

  // Handle booking
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!noOfTickets || noOfTickets <= 0) {
      setMessage("Please enter a valid number of tickets.");
      setMessageType("error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/bookings/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id: id,
          user_id: user.id,
          no_of_tickets: parseInt(noOfTickets),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const paymentId = data.booking.payment.id;
        navigate(`/payments/${paymentId}/pay`);
      } else {
        setMessage(data.message || "Booking failed");
        setMessageType("error");
      }
    } catch (err) {
      console.error("Error booking event:", err);
      setMessage("Error booking event.");
      setMessageType("error");
    }
  };

  // Calculate total price
  const totalPrice = event ? event.price * noOfTickets : 0;

  if (!event) {
    return (
      <div className="event-booking-page">
        <div className="booking-container">
          <div className="loading-state">Loading event details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-booking-page">
      <div className="booking-container">
        {/* Event Details Card */}
        <div className="event-details-card">
          <h2 className="event-title">{event.name}</h2>
          
          <p className="event-description">{event.description}</p>
          
          <div className="event-info">
            <div className="event-info-item">
              <strong>Venue:</strong>
              <span>{event.venue}</span>
            </div>
            <div className="event-info-item">
              <strong>Start Date:</strong>
              <span>{new Date(event.start_date).toLocaleString()}</span>
            </div>
            <div className="event-info-item">
              <strong>End Date:</strong>
              <span>{new Date(event.end_date).toLocaleString()}</span>
            </div>
          </div>

          <div className="event-price">
            Price per ticket: ₹{event.price}
          </div>
        </div>

        {/* Booking Form Card */}
        <div className="booking-form-card">
          <h3 className="booking-form-title">Book Your Tickets</h3>
          
          <form onSubmit={handleBooking} className="booking-form">
            <div className="form-group">
              <label htmlFor="tickets">Number of Tickets:</label>
              <input
                id="tickets"
                type="number"
                className="ticket-input"
                value={noOfTickets}
                min="1"
                onChange={(e) => setNoOfTickets(e.target.value)}
                required
                placeholder="Enter number of tickets"
              />
            </div>

            {noOfTickets > 0 && (
              <div className="total-price-display">
                <div className="total-price-label">Total Amount:</div>
                <div className="total-price-amount">₹{totalPrice.toLocaleString()}</div>
              </div>
            )}

            <button type="submit" className="submit-button">
              Proceed to Payment
            </button>
          </form>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}