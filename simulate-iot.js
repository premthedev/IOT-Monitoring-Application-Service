const { io } = require("socket.io-client");

// Connect to the WebSocket server with explicit options
const socket = io("http://localhost:5000", {
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

// Define 10 static devices with different characteristics
const devices = [
  { id: "Device-001", name: "Temperature Sensor 1", type: "temperature", location: "Server Room" },
  { id: "Device-002", name: "Humidity Sensor 1", type: "humidity", location: "Server Room" },
  { id: "Device-003", name: "Power Meter 1", type: "power", location: "Data Center" },
  { id: "Device-004", name: "Temperature Sensor 2", type: "temperature", location: "Office" },
  { id: "Device-005", name: "Humidity Sensor 2", type: "humidity", location: "Office" },
  { id: "Device-006", name: "Power Meter 2", type: "power", location: "Building A" },
  { id: "Device-007", name: "Current Sensor 1", type: "current", location: "Electrical Room" },
  { id: "Device-008", name: "Voltage Sensor 1", type: "voltage", location: "Electrical Room" },
  { id: "Device-009", name: "Combined Sensor 1", type: "combined", location: "Lab" },
  { id: "Device-010", name: "Combined Sensor 2", type: "combined", location: "Workshop" },
];

// Track current device index
let currentDeviceIndex = 0;
let intervalId = null;

socket.on("connect", () => {
  console.log("✅ Connected to WebSocket Server. Sending Sensor Data...");
  console.log("   Socket ID:", socket.id);

  // Send data from each device in rotation
  intervalId = setInterval(() => {
    // Get current device and increment index (rotate through devices)
    const device = devices[currentDeviceIndex];
    currentDeviceIndex = (currentDeviceIndex + 1) % devices.length;

    // Generate data based on device type
    let powerUsage = parseFloat((Math.random() * 500).toFixed(2));
    
    // Sometimes generate high power usage to trigger alerts
    if (Math.random() > 0.7) {
      powerUsage = parseFloat((Math.random() * 100 + 400).toFixed(2));
    }

    const sensorData = {
      deviceId: device.id,
      deviceName: device.name,
      deviceType: device.type,
      location: device.location,
      temperature: parseFloat((Math.random() * 50).toFixed(2)),
      humidity: parseFloat((Math.random() * 100).toFixed(2)),
      powerUsage: powerUsage,
      current: parseFloat((Math.random() * 10).toFixed(2)),
      voltage: parseFloat((Math.random() * 240).toFixed(2)),
      thresholds: { powerUsage: 400 },
      timestamp: new Date().toISOString(),
    };

    console.log(`📡 Sending from ${device.id} (${device.name}):`);
    socket.emit("sensorData", JSON.stringify(sensorData));
  }, 3000);
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected from WebSocket Server.");
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
});

socket.on("connect_error", (err) => {
  console.error("❌ WebSocket Connection Error:", err.message);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Simulator received SIGTERM signal. Shutting down gracefully...');
  if (intervalId) {
    clearInterval(intervalId);
  }
  socket.disconnect();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Simulator received SIGINT signal. Shutting down gracefully...');
  if (intervalId) {
    clearInterval(intervalId);
  }
  socket.disconnect();
  process.exit(0);
});