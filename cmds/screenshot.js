const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
    name: "screenshot",
    version: "1.0",
    author: "Jonnelsoriano",
    role: 0,
    shortDescription: "Capture website screenshot",
    longDescription: "Gets a screenshot of any website using public API.",
  },

  onStart: async function({ api, event, args }) {
    const url = args[0];

    if (!url) {
      return api.sendMessage("❗ Usage: screenshot <url>", event.threadID, event.messageID);
    }

    const apiURL = `https://betadash-api-swordslush-production.up.railway.app/screenshot?url=${encodeURIComponent(url)}`;

    api.sendMessage("📸 Taking screenshot... please wait...", event.threadID, event.messageID);

    try {
      const response = await axios({
        url: apiURL,
        method: "GET",
        responseType: "arraybuffer"
      });

      const imgPath = `${__dirname}/screenshot_${Date.now()}.png`;
      fs.writeFileSync(imgPath, response.data);

      api.sendMessage(
        {
          body: "✔ Here is your screenshot:",
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath), // auto delete
        event.messageID
      );

    } catch (err) {
      console.log(err);
      api.sendMessage("❌ Failed to capture screenshot!", event.threadID, event.messageID);
    }
  }
};