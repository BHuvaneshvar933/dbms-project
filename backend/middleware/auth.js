import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const verifyOrganizer = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1]; // make sure "Bearer <token>"
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    const user = await User.findByPk(decoded.id);
    if (!user || user.role !== "organizer") {
      return res.status(403).json({ message: "Access denied. Only organizers can perform this action." });
    }

    req.user = user; // attach the organizer user object
    next();
  } catch (err) {
    console.log("Token error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
