import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";
import Event from "./event.js";

const Booking = sequelize.define("Booking", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  event_id: { type: DataTypes.INTEGER, allowNull: false },
  no_of_tickets: { type: DataTypes.INTEGER, allowNull: false },
  total_price: { type: DataTypes.FLOAT, allowNull: false },
});

User.hasMany(Booking, { foreignKey: "user_id" });
Booking.belongsTo(User, { foreignKey: "user_id" });

Event.hasMany(Booking, { foreignKey: "event_id" });
Booking.belongsTo(Event, { foreignKey: "event_id" });

export default Booking;
