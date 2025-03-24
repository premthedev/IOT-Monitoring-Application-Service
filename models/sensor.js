const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Sensor = sequelize.define("Sensor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  deviceId: { type: DataTypes.STRING, allowNull: false, unique: true },
  deviceName: { type: DataTypes.STRING, allowNull: true },
  temperature: { type: DataTypes.FLOAT, allowNull: true },
  humidity: { type: DataTypes.FLOAT, allowNull: true },
  powerUsage: { type: DataTypes.FLOAT, allowNull: true },
  current: { type: DataTypes.FLOAT, allowNull: true },
  voltage: { type: DataTypes.FLOAT, allowNull: true },
  thresholds: { type: DataTypes.JSON, allowNull: true }, 
  userId: { type: DataTypes.UUID, allowNull: true },
  timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
});

module.exports = Sensor;