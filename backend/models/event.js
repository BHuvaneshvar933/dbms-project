import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const Event = sequelize.define("Event", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  start_date: {                     
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {                     
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {                      
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  available_seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100, 
  },
  total_seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

// Associations
Event.belongsTo(User, { foreignKey: "created_by" });
User.hasMany(Event, { foreignKey: "created_by" });

export default Event;
