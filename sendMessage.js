require("dotenv").config();
const axios = require("axios");

async function sendMessage(text) {
    const url = `https://tapi.bale.ai/bot${process.env.BOT_TOKEN}/sendMessage`;

    try {
        const response = await axios.post(url, {
            chat_id: process.env.CHAT_ID,
            text: text
        });

        console.log("✅ پیام با موفقیت ارسال شد.");
    } catch (error) {
        console.error("❌ خطا در ارسال پیام:");

        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
}

module.exports = sendMessage;