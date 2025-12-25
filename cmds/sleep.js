const fs = require("fs");
const path = require("path");

const sleepFile = path.join(__dirname, "..", "sleepMode.json");

module.exports.config = {
  name: "sleep",
  version: "1.0",
  role: 1, // admin only
  description: "Master sleep mode: turn bot OFF/ON"
};

// Helper: get current sleep state
function getSleepState() {
  if (!fs.existsSync(sleepFile)) return false;
  try {
    const data = JSON.parse(fs.readFileSync(sleepFile, "utf8"));
    return data.enabled;
  } catch (err) {
    console.error("Error reading sleepMode.json:", err);
    return false;
  }
}

// Helper: set sleep state
function setSleepState(state) {
  try {
    fs.writeFileSync(sleepFile, JSON.stringify({ enabled: state }, null, 2));
  } catch (err) {
    console.error("Error writing sleepMode.json:", err);
  }
}

// Command executor
module.exports.execute = async function({ api, event, args }) {
  const ADMIN_UID = "100082770721408"; // Palitan ng FB ID mo
  if (event.senderID !== ADMIN_UID) {
    return api.sendMessage("❌ You are not authorized to toggle sleep mode.", event.threadID);
  }

  const action = args[0]?.toLowerCase();
  if (!action || !["on", "off"].includes(action)) {
    return api.sendMessage("Gamitin: sleep on / sleep off", event.threadID);
  }

  if (action === "on") {
    setSleepState(true);
    return api.sendMessage("💤 Sleep mode activated! Lahat ng commands at auto responses OFF.", event.threadID);
  } else {
    setSleepState(false);
    return api.sendMessage("🌞 Bot awake na! Lahat ng commands at auto responses ON.", event.threadID);
  }
};

// Export helper para sa index.js
module.exports.isSleeping = getSleepState;