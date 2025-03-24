const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Alert = sequelize.define("Alert", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  sensorId: { type: DataTypes.UUID, allowNull: false },
  message: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM("Active", "Resolved"), defaultValue: "Active" },
});

module.exports = Alert;
