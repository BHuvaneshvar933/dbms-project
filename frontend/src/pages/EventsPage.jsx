import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/EventPage.css";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="events-page">
      <div className="events-container">
        <h2 className="events-title">All Upcoming Events</h2>
        {events.length === 0 ? (
          <p className="no-events">No events available</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <h3 className="event-name">{event.name}</h3>
                <p className="event-description">{event.description}</p>
                
                <div className="event-details">
                  <div className="event-detail-item">
                    <span className="detail-label">Venue:</span>
                    <span className="detail-value">{event.venue}</span>
                  </div>
                  
                  <div className="event-detail-item">
                    <span className="detail-label">Start:</span>
                    <span className="detail-value">
                      {new Date(event.start_date).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="event-detail-item">
                    <span className="detail-label">End:</span>
                    <span className="detail-value">
                      {new Date(event.end_date).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="event-detail-item">
                    <span className="detail-label">Price:</span>
                    <span className="detail-value price">₹{event.price}</span>
                  </div>
                </div>
                
                <button
                  className="register-button"
                  onClick={() => navigate(`/event/${event.id}/book`)}
                >
                  Register
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}