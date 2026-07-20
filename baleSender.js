require("dotenv").config();
const axios = require("axios");

async function sendMessage(text) {
    const url = `https://tapi.bale.ai/bot${process.env.BOT_TOKEN}/sendMessage`;

    await axios.post(url, {
        chat_id: process.env.CHAT_ID,
        text
    });

    console.log("✅ پیام ارسال شد.");
}

module.exports = sendMessage;