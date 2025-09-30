// backend/index.js

const express = require("express");
const { WebSocketServer } = require("ws");
const { spawn } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 3001;

// Store session info
const sessions = {};

// Create a new session
app.get("/session/new", (req, res) => {
  const id = uuidv4(); // generate unique session ID
  const containerName = `selfcore_${id}`;

  // Start a permanent Docker container running bash
  spawn("docker", ["run", "-dit", "--name", containerName, "ubuntu", "bash"]);

  sessions[id] = { containerName };

  // Public link for the user
  const publicLink = `http://selfcorex.duckdns.org:5173/?id=${id}`;
  res.json({ id, link: publicLink });
});

// Start backend server
const server = app.listen(port, () =>
  console.log(`SelfCore backend running at http://localhost:${port}`)
);

// WebSocket server for terminal communication
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  const params = new URLSearchParams(req.url.replace("/?", ""));
  const sessionId = params.get("id");

  if (!sessions[sessionId]) {
    ws.send("Invalid session ID");
    ws.close();
    return;
  }

  // Connect WebSocket to the Docker container bash
  const dockerExec = spawn("docker", [
    "exec",
    "-i",
    sessions[sessionId].containerName,
    "bash",
  ]);

  dockerExec.stdout.on("data", (data) => ws.send(data.toString()));
  dockerExec.stderr.on("data", (data) => ws.send(data.toString()));

  ws.on("message", (msg) => dockerExec.stdin.write(msg));
  ws.on("close", () => dockerExec.kill());
});
