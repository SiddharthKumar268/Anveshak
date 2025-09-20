// services/anomalyService.js
const { spawn } = require("child_process");
const path = require("path");

const pyPath = path.join(__dirname, "anomalyService.py");

function detectAnomaly(log) {
  return new Promise((resolve) => {
    const py = spawn("python3", [pyPath]);

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    py.stderr.on("data", (chunk) => (stderr += chunk.toString()));

    py.on("close", (code) => {
      if (stderr) {
        console.error("anomalyService.py stderr:", stderr);
      }
      try {
        const parsed = stdout ? JSON.parse(stdout) : { anomaly: false, severity: "low" };
        resolve(parsed);
      } catch (err) {
        console.error("Failed to parse anomalyService output:", err);
        resolve({ anomaly: false, severity: "low" });
      }
    });

    try {
      py.stdin.write(JSON.stringify(log));
      py.stdin.end();
    } catch (err) {
      console.error("Failed to write to anomaly service stdin:", err);
      resolve({ anomaly: false, severity: "low" });
    }
  });
}

module.exports = { detectAnomaly };
