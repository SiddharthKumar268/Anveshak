const API_BASE = "http://localhost:5000/api";
const TOKEN = localStorage.getItem("token");

async function apiFetch(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Authorization: "Bearer " + TOKEN }
    });
    return await res.json();
  } catch (err) {
    console.error("API error:", endpoint, err);
    return null;
  }
}

// Update stats panel
async function updateStats() {
  const logs = await apiFetch("/logs");
  const incidents = await apiFetch("/incidents");
  const chain = await apiFetch("/blockchain");
  const anomalies = await apiFetch("/anomalies");

  document.getElementById("main-log").textContent = logs?.length || 0;
  document.getElementById("incidents").textContent = incidents?.length || 0;
  document.getElementById("blockchain").textContent = chain?.length || 0;
  document.getElementById("anomalies").textContent = anomalies?.length || 0;

  // Alert gauge %
  if (incidents && incidents.length > 0) {
    const critical = incidents.filter(i => i.level === "critical").length;
    const percent = Math.min(
      100,
      Math.round((critical / incidents.length) * 100)
    );
    document.getElementById("alert-level").textContent = percent + "%";
    document.querySelector(".progress-circle").style.borderTopColor =
      percent > 70 ? "red" : percent > 40 ? "orange" : "green";
  }
}

// Update live logs
async function updateLogs() {
  const logs = await apiFetch("/logs");
  if (!logs) return;
  const logBox = document.getElementById("log-stream");
  logBox.textContent = logs
    .slice(-10)
    .map(l => `[${l.level.toUpperCase()}] ${l.message}`)
    .join("\n");
}

// Power button (health check)
document.getElementById("power-toggle").addEventListener("click", async () => {
  const health = await apiFetch("/health");
  if (health && health.status === "ok") {
    alert("✅ Backend is online");
  } else {
    alert("❌ Backend offline");
  }
});

// Add port button → refresh stats
document.querySelector(".add-port").addEventListener("click", () => {
  updateStats();
});

// Auto refresh
setInterval(() => {
  updateStats();
  updateLogs();
}, 5000);

// Initial load
updateStats();
updateLogs();
