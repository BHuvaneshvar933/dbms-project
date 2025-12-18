import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-icon">🎉</span>
          <h1 className="hero-title">Discover Amazing Events</h1>
          <p className="hero-subtitle">
            Book tickets to concerts, conferences, workshops, and more. 
            Your next unforgettable experience is just a click away!
          </p>
          <div className="hero-buttons">
            <button 
              className="hero-button primary"
              onClick={() => navigate("/events")}
            >
              Browse Events
            </button>
            {!token ? (
              <button 
                className="hero-button secondary"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            ) : (
              <button 
                className="hero-button secondary"
                onClick={() => navigate(user?.role === "organizer" ? "/organizer-dashboard" : "/user-dashboard")}
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Us?</h2>
          <p className="section-subtitle">
            Everything you need for a seamless event booking experience
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🎫</span>
            <h3 className="feature-title">Easy Booking</h3>
            <p className="feature-description">
              Book your tickets in seconds with our streamlined checkout process. 
              No hassle, just pure convenience.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3 className="feature-title">Secure Payments</h3>
            <p className="feature-description">
              Your transactions are protected with industry-leading security. 
              Pay with confidence every time.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">📱</span>
            <h3 className="feature-title">Instant Access</h3>
            <p className="feature-description">
              Get immediate confirmation and access your tickets anytime, anywhere. 
              All your bookings in one place.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">⭐</span>
            <h3 className="feature-title">Rate & Review</h3>
            <p className="feature-description">
              Share your experience and help others discover great events. 
              Your feedback matters.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3 className="feature-title">Personalized</h3>
            <p className="feature-description">
              Track your bookings, view history, and manage everything from your 
              personal dashboard.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🌟</span>
            <h3 className="feature-title">Quality Events</h3>
            <p className="feature-description">
              Curated selection of the best events in your area. 
              Never miss out on what matters to you.
            </p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Events Hosted</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Cities Covered</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.8★</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-card">
          <h2 className="cta-title">Ready to Start?</h2>
          <p className="cta-description">
            Join thousands of event-goers who trust us with their entertainment. 
            Your next adventure awaits!
          </p>
          <button 
            className="cta-button"
            onClick={() => navigate("/events")}
          >
            Explore Events Now
          </button>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <p className="footer-text">
            © 2025 Event Booking Platform. Making memories, one event at a time.
          </p>
          <div className="footer-links">
            <a href="/events" className="footer-link">Events</a>
            <a href="/about" className="footer-link">About Us</a>
            <a href="/contact" className="footer-link">Contact</a>
            <a href="/privacy" className="footer-link">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;