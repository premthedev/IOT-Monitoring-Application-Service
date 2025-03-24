const express = require("express");
const { Sensor } = require("../models");
const { authMiddleware, authorize } = require("../middleware/auth");

const router = express.Router();

// Add a new IoT device (Admin only)
router.post("/", authMiddleware, authorize("Admin"), async (req, res) => {
  const { deviceId, deviceName, thresholds } = req.body;

  if (!deviceId) {
    return res.status(400).json({ message: "Device ID is required." });
  }

  try {
    const device = await Sensor.create({
      deviceId,
      deviceName,
      thresholds,
    });
    res.status(201).json({ message: "Device added successfully.", device });
  } catch (error) {
    console.error("Error adding device:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Update an existing IoT device (Admin only)
router.put("/:id", authMiddleware, authorize("Admin"), async (req, res) => {
  const { id } = req.params;
  const { deviceName, thresholds } = req.body;

  try {
    const device = await Sensor.findByPk(id);
    if (!device) {
      return res.status(404).json({ message: "Device not found." });
    }

    device.deviceName = deviceName || device.deviceName;
    device.thresholds = thresholds || device.thresholds;
    await device.save();

    res.json({ message: "Device updated successfully.", device });
  } catch (error) {
    console.error("Error updating device:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Delete an IoT device (Admin only)
router.delete("/:id", authMiddleware, authorize("Admin"), async (req, res) => {
  const { id } = req.params;

  try {
    const device = await Sensor.findByPk(id);
    if (!device) {
      return res.status(404).json({ message: "Device not found." });
    }

    await device.destroy();
    res.json({ message: "Device deleted successfully." });
  } catch (error) {
    console.error("Error deleting device:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});
// Get all devices (Admin only)
router.get("/", authMiddleware, authorize("Admin"), async (req, res) => {
    try {
      const devices = await Sensor.findAll();
      res.json(devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ message: "Internal Server Error." });
    }
  });
  // Add validation for thresholds
const validateThresholds = (thresholds) => {
    if (thresholds && typeof thresholds !== "object") {
      throw new Error("Thresholds must be a valid JSON object.");
    }
    if (thresholds?.powerUsage && typeof thresholds.powerUsage !== "number") {
      throw new Error("Power usage threshold must be a number.");
    }
  };
  
  // Add a new IoT device (Admin only)
  router.post("/", authMiddleware, authorize("Admin"), async (req, res) => {
    const { deviceId, deviceName, thresholds } = req.body;
  
    try {
      validateThresholds(thresholds);
  
      const device = await Sensor.create({
        deviceId,
        deviceName,
        thresholds,
      });
      res.status(201).json({ message: "Device added successfully.", device });
    } catch (error) {
      console.error("Error adding device:", error);
      res.status(400).json({ message: error.message });
    }
  });
  
  // Update an existing IoT device (Admin only)
  router.put("/:id", authMiddleware, authorize("Admin"), async (req, res) => {
    const { id } = req.params;
    const { deviceName, thresholds } = req.body;
  
    try {
      validateThresholds(thresholds);
  
      const device = await Sensor.findByPk(id);
      if (!device) {
        return res.status(404).json({ message: "Device not found." });
      }
  
      device.deviceName = deviceName || device.deviceName;
      device.thresholds = thresholds || device.thresholds;
      await device.save();
  
      res.json({ message: "Device updated successfully.", device });
    } catch (error) {
      console.error("Error updating device:", error);
      res.status(400).json({ message: error.message });
    }
  });

module.exports = router;