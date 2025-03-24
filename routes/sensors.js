const express = require("express");
const { Sensor } = require("../models");
const { Op } = require("sequelize");
const { authMiddleware, authorize } = require("../middleware/auth");

const router = express.Router();

// Get all sensors (Admin and Operator only)
router.get("/", authMiddleware, authorize(["Admin", "Operator"]), async (req, res) => {
  try {
    const sensors = await Sensor.findAll();
    res.json(sensors);
  } catch (error) {
    console.error("Error fetching sensors:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Get historical data for a specific sensor (Admin and Operator only)
router.get("/id/history", authMiddleware, authorize(["Admin", "Operator"]), async (req, res) => {
  try {
    const { id } = req.params;
    const sensor = await Sensor.findByPk(id);
    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found." });
    }
    res.json(sensor);
  } catch (error) {
    console.error("Error fetching sensor history:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Get historical data for a specific sensor with date filtering
router.get("/:deviceId/history", authMiddleware, async (req, res) => {
  const { deviceId } = req.params;
  const { startDate, endDate } = req.query;
  
  try {
    // Verify the device exists
    const device = await Sensor.findOne({ where: { deviceId } });
    if (!device) {
      return res.status(404).json({ message: "Sensor not found." });
    }

    // Define query conditions
    let whereClause = { deviceId };
    
    // Add date range if provided
    if (startDate && endDate) {
      whereClause.timestamp = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    const sensorData = await Sensor.findAll({
      where: whereClause,
      order: [['timestamp', 'DESC']]
    });
    
    // Even if we get empty array, return it (frontend will handle empty data)
    res.json(sensorData);
  } catch (error) {
    console.error("Error fetching historical sensor data:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

module.exports = router;