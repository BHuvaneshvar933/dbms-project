import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);

    if (success) {
      setError("");

      const storedUser = JSON.parse(localStorage.getItem("user"));
      const role = storedUser?.role;

      if (role === "user") {
        window.location.href = "/user-dashboard";
      } else if (role === "organizer") {
        window.location.href = "/organizer-dashboard";
      } else if (role === "admin") {
        window.location.href = "/admin-dashboard";
      } else {
        window.location.href = "/";
      }

    } else {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login to EventHub</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
      </div>
    </div>
  );
}
