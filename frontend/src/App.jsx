import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDashboard from "./pages/UserDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/NavBar";
import EventBookingPage from "./pages/EventBookingPage";
import PaymentPage from "./pages/PaymentPage";
import EventsPage from "./pages/EventsPage";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<EventsPage />} />
         <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer-dashboard"
          element={
            <ProtectedRoute requiredRole="organizer">
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/event/:id/book"
          element={
            <ProtectedRoute requiredRole="user">
              <EventBookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments/:paymentId/pay"
          element={
            <ProtectedRoute requiredRole="user">
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        </Routes>
    </AuthProvider>
  );
}
