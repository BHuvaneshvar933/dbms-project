import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: "user", 
},

  organization_name: {
  type: DataTypes.STRING,
  allowNull: true
}
}, {
  tableName: "users", 
});

export default User;
