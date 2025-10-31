import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { User } from "./models/index.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import sequelize from "./config/db.js";
import "./models/index.js"; 
import categoryRoutes from "./routes/categoryRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler);


app.get("/", (req, res) => {
  res.send("🚀 Event Management Backend Running!");
});

//routes
app.use("/events", eventRoutes);
app.use("/bookings", bookingRoutes);
app.use("/payments", paymentRoutes);
app.use("/users", userRoutes);
app.use("/categories",categoryRoutes);
app.use("/feedback", feedbackRoutes);

console.log(" Starting backend server...");


const PORT = process.env.PORT || 5000;
sequelize
  .sync({ alter: true }) 
  .then(() => {
    console.log(" MySQL Connected & Tables Synced");
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => console.error(" Database connection failed:", err));
