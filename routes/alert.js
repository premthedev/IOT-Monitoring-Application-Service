const express = require("express");
const { Alert } = require("../models");
const { authMiddleware, authorize } = require("../middleware/auth");

const router = express.Router();

// Get all active alerts
router.get("/", authMiddleware, authorize(["Admin", "Operator"]), async (req, res) => {
  try {
    const alerts = await Alert.findAll({ where: { status: "Active" } });
    res.json(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});
// Get alerts for a specific sensor (Admin and Operator only)
router.get("/:sensorId", authMiddleware, authorize(["Admin", "Operator"]), async (req, res) => {
  const { sensorId } = req.params;

  try {
    const alerts = await Alert.findAll({ where: { sensorId } });
    res.json(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

module.exports = router;