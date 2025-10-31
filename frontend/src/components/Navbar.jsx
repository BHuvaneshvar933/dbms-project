import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { token, user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-left">
            <Link to="/" className="logo-link">
              <span className="logo-icon"></span>
              EventHub
            </Link>
          </div>

          <div className="navbar-right">
            <div className="navbar-menu">
              <Link to="/" className="nav-link" onClick={closeMenu}>
                Home
              </Link>
              <Link to="/events" className="nav-link" onClick={closeMenu}>
                Events
              </Link>

              {token && user?.role === "user" && (
                <Link to="/user-dashboard" className="nav-link" onClick={closeMenu}>
                  Dashboard
                </Link>
              )}
              {token && user?.role === "organizer" && (
                <Link to="/organizer-dashboard" className="nav-link" onClick={closeMenu}>
                  Dashboard
                </Link>
              )}
            </div>

            <div className="navbar-auth">
              {token ? (
                <>
                  <div className="user-info">
                    <span className="user-welcome">
                      <span className="user-icon">👤</span>
                      <span className="user-name">{user?.name}</span>
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="auth-button auth-button-logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="auth-button auth-button-login">
                    Login
                  </Link>
                  <Link to="/register" className="auth-button auth-button-register">
                    Register
                  </Link>
                </>
              )}
            </div>

            <div className="mobile-menu-button">
              <button
                onClick={toggleMenu}
                className="menu-toggle"
                aria-label="Toggle menu"
              >
                <svg className="menu-icon" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mobile-menu">
            {token && (
              <div className="mobile-user-info">
                <div className="mobile-user-welcome">Welcome back,</div>
                <div className="mobile-user-name">{user?.name}</div>
              </div>
            )}

            <Link to="/" className="mobile-nav-link" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/events" className="mobile-nav-link" onClick={closeMenu}>
              Events
            </Link>
            {token && user?.role === "user" && (
              <Link to="/user-dashboard" className="mobile-nav-link" onClick={closeMenu}>
                My Bookings
              </Link>
            )}
            {token && user?.role === "organizer" && (
              <Link to="/organizer-dashboard" className="mobile-nav-link" onClick={closeMenu}>
                Dashboard
              </Link>
            )}

            <div className="mobile-auth-buttons">
              {token ? (
                <button onClick={handleLogout} className="mobile-logout-button">
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="mobile-auth-button login" onClick={closeMenu}>
                    Login
                  </Link>
                  <Link to="/register" className="mobile-auth-button register" onClick={closeMenu}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
