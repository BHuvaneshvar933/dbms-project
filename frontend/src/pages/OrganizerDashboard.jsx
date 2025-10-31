import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/OrganizerDashboard.css";

export default function OrganizerDashboard() {
  const { token, user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewingFeedbacks, setViewingFeedbacks] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
    price: "",
    category_name: "",
  });

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/events/categories/list");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch organizer's events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const organizerEvents = data.filter(
          (event) => event.created_by === user.id
        );
        setEvents(organizerEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, [token, user.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCategory = categories.find(
      (c) => c.name === formData.category_name
    );
    const category_id = selectedCategory ? selectedCategory.id : null;

    if (!category_id) {
      setMessage("Please select a valid category.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          location: formData.location,
          start_date: formData.start_date,
          end_date: formData.end_date,
          price: formData.price,
          category_id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Event created successfully!");
        setEvents([...events, data.event]);
        setFormData({
          name: "",
          description: "",
          location: "",
          start_date: "",
          end_date: "",
          price: "",
          category_name: "",
        });
      } else {
        setMessage(data.message || "Failed to create event.");
      }
    } catch (err) {
      console.error("Error creating event:", err);
      setMessage("Error creating event.");
    }
  };

  // Fetch bookings for a specific event
  const fetchBookings = async (event) => {
    setLoadingBookings(true);
    setViewingFeedbacks(false);
    try {
      const res = await fetch(`http://localhost:5000/events/${event.id}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data);
      setSelectedEvent(event);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Fetch feedbacks for a specific event
  const fetchFeedbacks = async (event) => {
    setLoadingFeedbacks(true);
    setViewingFeedbacks(true);
    try {
      const res = await fetch(`http://localhost:5000/feedback/event/${event.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFeedbacks(data);
      setSelectedEvent(event);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setFeedbacks([]);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  return (
    <div className="organizer-dashboard">
      <div className="dashboard-container">
        <h2 className="dashboard-title">Organizer Dashboard</h2>

        {message && (
          <div className={`message ${message.includes("success") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <section className="create-event-section">
          <h3 className="section-title">Create New Event</h3>
          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-group">
              <label htmlFor="name">Event Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter event name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your event"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                name="location"
                placeholder="Event venue"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start_date">Start Date</label>
                <input
                  id="start_date"
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="end_date">End Date</label>
                <input
                  id="end_date"
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Ticket Price (₹)</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  placeholder="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category_name">Category</label>
                <select
                  id="category_name"
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="submit-button">
              + Create Event
            </button>
          </form>
        </section>

        <section className="events-list-section">
          <h3 className="section-title">My Events</h3>
          {events.length === 0 ? (
            <p className="empty-state">No events created yet.</p>
          ) : (
            <div className="events-list">
              {events.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-info">
                    <h4 className="event-name">{event.name}</h4>
                    <p className="event-price">₹{event.price}</p>
                    <p className="event-details">
                      {event.start_date} to {event.end_date} @ {event.location}
                    </p>
                  </div>
                  <div className="event-actions">
                    <button
                      onClick={() => fetchBookings(event)}
                      className="action-button bookings-button"
                    >
                      View Bookings
                    </button>
                    <button
                      onClick={() => fetchFeedbacks(event)}
                      className="action-button feedback-button"
                    >
                      View Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedEvent && !viewingFeedbacks && (
          <section className="data-section">
            <h3 className="section-title">
              Bookings for <span className="highlight">{selectedEvent.name}</span>
            </h3>
            

            {loadingBookings ? (
              <p className="loading-state">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="empty-state">No bookings yet.</p>
            ) : (
              <div className="bookings-list">
                {bookings.map((b) => (
                  <div key={b.id} className="booking-card">
                    <div className="booking-info">
                      <p><strong>User:</strong> {b.User?.name} ({b.User?.email})</p>
                      <p><strong>Tickets:</strong> {b.no_of_tickets}</p>
                      <p><strong>Total Paid:</strong> ₹{b.total_price}</p>
                      <p>
                        <strong>Payment Status:</strong>{" "}
                        <span className={`status ${b.payment_status || "pending"}`}>
                          {b.payment_status || "completed"}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {selectedEvent && viewingFeedbacks && (
          <section className="data-section">
            <h3 className="section-title">
              Feedback for <span className="highlight">{selectedEvent.name}</span>
            </h3>
           

            {loadingFeedbacks ? (
              <p className="loading-state">Loading feedback...</p>
            ) : feedbacks.length === 0 ? (
              <p className="empty-state">No feedback given yet.</p>
            ) : (
              <div className="feedbacks-list">
                {feedbacks.map((f) => (
                  <div key={f.id} className="feedback-card">
                    <div className="feedback-header">
                      <p className="feedback-user">{f.User?.name || "Anonymous"}</p>
                      <p className="feedback-rating">⭐ {f.rating}/5</p>
                    </div>
                    <p className="feedback-comment">
                      {f.comment || "No comment provided"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
