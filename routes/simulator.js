const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/auth'); // Import both from auth.js

let simulatorProcess = null;

// Start the simulator - restricted to Admin and Operator
router.post('/start', authMiddleware, authorize(['Admin', 'Operator']), function(req, res) {
  try {
    if (simulatorProcess) {
      return res.status(400).json({ 
        message: "Simulator is already running" 
      });
    }

    const scriptPath = path.join(__dirname, '..', 'simulate-iot.js');
    simulatorProcess = spawn('node', [scriptPath], {
      detached: false
    });

    console.log('🚀 Simulator started with PID:', simulatorProcess.pid);

    simulatorProcess.stdout.on('data', (data) => {
      console.log(`Simulator output: ${data}`);
    });

    simulatorProcess.stderr.on('data', (data) => {
      console.error(`Simulator error: ${data}`);
    });

    simulatorProcess.on('close', (code) => {
      console.log(`Simulator process exited with code ${code}`);
      simulatorProcess = null;
    });

    return res.status(200).json({ 
      message: "Simulator started successfully",
      status: "running"
    });
  } catch (error) {
    console.error('Error starting simulator:', error);
    return res.status(500).json({ 
      message: "Failed to start simulator" 
    });
  }
});

// Stop the simulator - restricted to Admin and Operator
router.post('/stop', authMiddleware, authorize(['Admin', 'Operator']), function(req, res) {
  try {
    if (!simulatorProcess) {
      return res.status(400).json({ 
        message: "Simulator is not running" 
      });
    }

    // Kill the simulator process
    simulatorProcess.kill();
    simulatorProcess = null;

    return res.status(200).json({ 
      message: "Simulator stopped successfully",
      status: "stopped"
    });
  } catch (error) {
    console.error('Error stopping simulator:', error);
    return res.status(500).json({ 
      message: "Failed to stop simulator" 
    });
  }
});

// Get simulator status - accessible to all authenticated users
router.get('/status', authMiddleware, function(req, res) {
  return res.status(200).json({ 
    status: simulatorProcess ? "running" : "stopped" 
  });
});

module.exports = router;