require("dotenv").config();
const express = require("express");
const db = require("./models");
const sequelize = db.sequelize;
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const Sensor = require("./models/sensor");
const Alert = require("./models/alert");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
const alertRoutes = require("./routes/alert");
app.use("/alerts", alertRoutes);
const sensorRoutes = require("./routes/sensors");
app.use("/sensors", sensorRoutes);
const deviceRoutes = require("./routes/devices");
app.use("/devices", deviceRoutes);
const simulatorRoutes = require("./routes/simulator");
app.use("/simulator", simulatorRoutes);

// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  },
  
  transports: ['websocket', 'polling']
});

// WebSocket server setup
io.on("connection", (socket) => {
  // console.log("✅ New client connected, ID:", socket.id);

  // Handle sensor data from IoT devices
  socket.on("sensorData", async (data) => {
    try {
      const sensorData = typeof data === 'string' ? JSON.parse(data) : data;
      console.log("📡 Received Sensor Data:", sensorData);

      // Validate and store the sensor data
      const [sensor, created] = await Sensor.upsert({
        deviceId: sensorData.deviceId,
        deviceName: sensorData.deviceName,
        temperature: sensorData.temperature,
        humidity: sensorData.humidity,
        powerUsage: sensorData.powerUsage,
        current: sensorData.current,
        voltage: sensorData.voltage,
        thresholds: sensorData.thresholds || null,
        userId: sensorData.userId || null,
        timestamp: new Date(),
      });

      console.log("✅ Sensor data stored in the database");

      // Fetch the sensor ID explicitly
      const sensorRecord = await Sensor.findOne({ where: { deviceId: sensorData.deviceId } });

      // Emit the data to all connected clients
      io.emit("sensorData", JSON.stringify(sensorData));

      // Trigger alert if power usage exceeds threshold
      if (sensorData.powerUsage > 400) {
        const alert = await Alert.create({
          sensorId: sensorRecord.id,
          message: `High power usage detected: ${sensorData.powerUsage}W`,
        });
        console.log("⚠️ Alert triggered for high power usage");
        
        // Emit alert to all connected clients
        io.emit("alert", JSON.stringify({
          id: alert.id,
          message: alert.message,
          deviceId: sensorData.deviceId,
          powerUsage: sensorData.powerUsage,
          timestamp: new Date()
        }));
      }
    } catch (error) {
      console.error("❌ Error processing sensor data:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("⚠️ Client disconnected, ID:", socket.id);
  });
});

// Database connection and server start
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully.");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("✅ Database Synchronized");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Socket.IO server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });
