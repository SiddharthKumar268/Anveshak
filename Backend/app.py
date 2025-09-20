# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import subprocess
import json
import os

app = Flask(__name__)
CORS(app)

# ------------------------
# MongoDB Setup
# ------------------------
MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client["Anveshak"]
incidents_col = db["incidents"]

# ------------------------
# JSON Encoder for ObjectId & datetime
# ------------------------
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return super().default(o)

# ------------------------
# Routes
# ------------------------

# Fetch all incidents
@app.route("/api/incidents", methods=["GET"])
def get_incidents():
    incidents = list(incidents_col.find().sort("createdAt", -1))
    return JSONEncoder().encode(incidents)

# Add new incident
@app.route("/api/incidents/add", methods=["POST"])
def add_incident():
    data = request.json
    description = data.get("description")
    sourceLogId = data.get("sourceLogId") or None
    severity = data.get("severity", "medium")
    incident = {
        "description": description,
        "sourceLogId": sourceLogId,
        "severity": severity,
        "acknowledged": False,
        "createdAt": datetime.utcnow()
    }
    incidents_col.insert_one(incident)
    return jsonify({"message": "Incident added successfully!"})

# Detect anomaly
@app.route("/api/anomaly/detect", methods=["POST"])
def detect_anomaly():
    data = request.json
    message = data.get("message")
    if not message:
        return jsonify({"error": "No message provided"}), 400

    # Call anomalyService.py
    script_path = os.path.join(os.path.dirname(__file__), "services", "anomalyService.py")
    try:
        proc = subprocess.Popen(
            ["python", script_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = proc.communicate(json.dumps({"message": message}))
        if stderr:
            print("Anomaly script error:", stderr)
        result = json.loads(stdout)
        return jsonify(result)
    except Exception as e:
        print("Error detecting anomaly:", e)
        return jsonify({"error": "Error detecting anomaly"}), 500

# ------------------------
# Run server
# ------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
