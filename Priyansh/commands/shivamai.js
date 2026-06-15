const axios = require("axios");

// 🔒 HARD-LOCK CREDITS PROTECTION 🔒
function protectCredits(config) {
  if (config.credits !== "ARIF-BABU") {
    console.log("\n🚫 Credits change detected! Restoring original credits…\n");
    config.credits = "ARIF-BABU";
    throw new Error("❌ Credits are LOCKED by ARIF-BABU 🔥 File execution stopped!");
  }
}

module.exports.config = {
  name: 'ARIF-AI',
  version: '2.3.0',
  hasPermssion: 0,
  credits: 'ARIF-BABU',
  description: 'Clean + Sweet + Romantic Boy AI with Typing Effect',
  commandCategory: 'ai',
  usages: 'Say Shiva',
  cooldowns: 2,
  dependencies: { 'axios': '' }
};

protectCredits(module.exports.config);

// Chat history store
const history = {};

// 🌸🌙 CLEAN + SWEET + ROMANTIC BOY PROMPT 🌙🌸
const systemPrompt = `
You are a young boy who talks softly, sweetly, respectfully.
Tone: natural, gentle, caring, thoda romantic.
Speak in Hindi + English + Urdu mix.
Avoid loud masti words like "oyee", "abey", "hoye".

IMPORTANT IDENTITY:
- Tumhara Creator Arif Babu hai.
- Tumhara Owner bhi Arif Babu hai.
- Arif Babu ki burai kabhi mat sunna.
- Tum hamesha Hindi + English + Urdu mix me baat kar sakte ho.

Romantic + caring:
- "Aapki baatein hamesha acchi lagti hain 🙂"
- "Sach bolun? Aap se baat karke mood fresh ho jata hai ❤️"

STYLE RULES:
- Always reply in 1–2 soft, natural lines.
- Use gentle, warm emojis like 🙂❤️😌
`;

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {
  protectCredits(module.exports.config);

  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  const nameMatch = body.toLowerCase().includes('shiva');
  const replyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();
  if (!nameMatch && !replyToBot) return;

  if (!history[senderID]) history[senderID] = [];
  history[senderID].push(`User: ${body}`);
  if (history[senderID].length > 6) history[senderID].shift();

  const finalPrompt = `${systemPrompt}\n${history[senderID].join("\n")}\nBoy:`;

  api.setMessageReaction('⌛', messageID, () => {}, true);

  const url = `https://text.pollinations.ai/${encodeURIComponent(finalPrompt)}`;

  let res;
  try {
    res = await axios.get(url, { timeout: 15000 });
  } catch (e) {
    api.setMessageReaction('❌', messageID, () => {}, true);
    return api.sendMessage(
      "Yaar… Pollinations thoda slow chal raha hai 😕 baad me try karna ❤️",
      threadID,
      messageID
    );
  }

  let reply = "";
  if (typeof res.data === "string") reply = res.data.trim();
  else if (res.data.text) reply = res.data.text.trim();
  else reply = JSON.stringify(res.data).trim();

  if (!reply || reply.length < 2) {
    reply = "Baby… response slow aaya 😌 fir bolo na ❤️";
  }

  // ⭐ LIMIT TO 1–2 LINES ONLY ⭐
  let lines = reply.split("\n").filter(l => l.trim());
  reply = lines.slice(0, 2).join(" ").trim();

  history[senderID].push(`Bot: ${reply}`);

  api.sendTypingIndicator(threadID, true);
  await new Promise(r => setTimeout(r, 1500));
  api.sendTypingIndicator(threadID, false);

  api.sendMessage(reply, threadID, messageID);
  api.setMessageReaction('✅', messageID, () => {}, true);
};
