import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";
import Event from "./event.js";

const Feedback = sequelize.define("Feedback", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Feedback.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Feedback.belongsTo(Event, { foreignKey: "eventId", onDelete: "CASCADE" });

export default Feedback;
