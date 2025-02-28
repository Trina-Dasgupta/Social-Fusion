import http from "http";
import app from "./app.js";
import { initSocket } from "./sockets/chat.js";
import db from "../config/database.js"; 

const server = http.createServer(app);
initSocket(server);

// Sync Database
db.sync({ alter: true })
  .then(() => console.log("✅ Database Synced"))
  .catch((err) => console.error("❌ Database Sync Error:", err));

server.listen(5000, () => console.log("🚀 Server running on port 5000"));
