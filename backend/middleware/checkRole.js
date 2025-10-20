import jwt from "jsonwebtoken";
import User from "../models/user.js";

const checkRole = (roles = []) => {
  if (typeof roles === "string") roles = [roles];

  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "No token provided" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
      const user = await User.findByPk(decoded.id);

      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default checkRole;
