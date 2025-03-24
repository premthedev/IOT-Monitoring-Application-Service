const sequelize = require("../config/db");
const User = require("./User");
const Sensor = require("./sensor");
const Alert = require("./alert");

User.hasMany(Sensor, { foreignKey: "userId" });
Sensor.belongsTo(User, { foreignKey: "userId" });

Sensor.hasMany(Alert, { foreignKey: "sensorId" });
Alert.belongsTo(Sensor, { foreignKey: "sensorId" });

const db = {
  sequelize,
  User,
  Sensor,
  Alert
};

module.exports = db;