const logError = require("./errorLogger");
const pool = require("./database");
const cron = require("node-cron");
const sendMessage = require("./baleSender");
const axios = require("axios");

// لینک ۵ ویلای رقیب
const roomUrls = [
  "https://www.otaghak.com/room/2446492/?checkIn=2026-07-26&checkOut=2026-07-28&person=3",
  "https://www.otaghak.com/room/2501944/",
  "https://www.otaghak.com/room/2484846/?checkIn=2026-07-26&checkOut=2026-07-28&person=3",
  "https://www.otaghak.com/room/2487027/?checkIn=2026-07-26&checkOut=2026-07-28&person=3",
  "https://www.otaghak.com/room/2497478/?checkIn=2026-07-26&checkOut=2026-07-28&person=3"
];

// استخراج Room ID
function getRoomId(url) {
  const match = url.match(/room\/(\d+)/);
  return match ? match[1] : null;
}

// دریافت قیمت هر ویلا
async function getRoomPrice(url) {

  const roomId = getRoomId(url);

  const apiUrl =
    `https://core.otaghak.com/api/v3/Rooms/GetRoomPdp?roomId=${roomId}&checkInDate=2026-07-26&checkOutDate=2026-07-28&utmSource=&generatedDevice=WebSite`;

    try {

      const response = await axios.get(apiUrl, {
          timeout: 10000,
          headers: {
              "User-Agent": "Mozilla/5.0",
              "Accept": "application/json"
          }
      });
  
      const data = response.data;
  
      if (!data.price) {
          throw new Error("Price object not found.");
      }
  
      const finalPrice =
          data.price.afterDiscount > 0
              ? data.price.afterDiscount
              : data.price.basePrice;
  
      return {
          roomId,
          finalPrice
      };
  
  }
  catch (err) {

    console.log("Error in room:", roomId);

    if (err.response) {

        console.log("Status:", err.response.status);

        await logError(
            roomId,
            "HTTP_ERROR",
            `Status ${err.response.status}`
        );

    } else {

        console.log(err.message);

        await logError(
            roomId,
            "NETWORK_ERROR",
            err.message
        );

    }

    return null;

}

}

// اعمال Time Decay
function applyTimeDecay(price) {

  const currentHour = new Date().getHours();

  let discount = 0;

  if (currentHour >= 20) {
    discount = 0.06;
  } else if (currentHour >= 17) {
    discount = 0.04;
  } else if (currentHour >= 14) {
    discount = 0.02;
  }

  return {
    currentHour,
    discountPercent: discount * 100,
    finalPrice: Math.round(price * (1 - discount))
  };

}

// برنامه اصلی
async function main() {

  console.log("\n==========================");
  console.log("Checking competitor villas...");
  console.log("==========================\n");

  const prices = [];

  for (const url of roomUrls) {

    console.log("Checking:", getRoomId(url));

    const result = await getRoomPrice(url);

    if (result) {
      prices.push(result);
    }

  }

  if (prices.length === 0) {
    console.log("❌ هیچ قیمتی دریافت نشد.");
    return;
  }

  console.log("\nCompetitor Prices");
  console.table(prices);

  // میانگین قیمت رقبا
  const totalPrice = prices.reduce(
    (sum, room) => sum + room.finalPrice,
    0
  );

  const averagePrice = Math.round(totalPrice / prices.length);

  // قیمت پایه (۵ درصد کمتر)
  const ourBasePrice = Math.round(averagePrice * 0.95);

  // اعمال تخفیف زمانی
  const result = applyTimeDecay(ourBasePrice);

  for (const room of prices) {

    await pool.query(
        `
        INSERT INTO price_history
        (
            room_id,
            competitor_price,
            average_price,
            suggested_price
        )
        VALUES ($1,$2,$3,$4)
        `,
        [
            room.roomId,
            room.finalPrice,
            averagePrice,
            result.finalPrice
        ]
    );

}

  console.log("\nAverage Competitor Price:",
    averagePrice.toLocaleString());

  console.log("Our Base Price:",
    ourBasePrice.toLocaleString());

  console.log("Current Hour:",
    result.currentHour + ":00");

  console.log("Time Decay Discount:",
    result.discountPercent + "%");

  console.log("Final Suggested Price:",
    result.finalPrice.toLocaleString());

  const message = `🏡 پیشنهاد قیمت

📊 میانگین قیمت ۵ رقیب:
${averagePrice.toLocaleString()} تومان

💰 قیمت پایه:
${ourBasePrice.toLocaleString()} تومان

⏰ ساعت:
${result.currentHour}:00

📉 تخفیف زمانی:
${result.discountPercent}%

✅ قیمت پیشنهادی:
${result.finalPrice.toLocaleString()} تومان`;

  await sendMessage(message);

}

// اجرای اولیه
main();

// اجرای خودکار هر ۱ دقیقه
cron.schedule("*/1 * * * *", () => {

  console.log("\nاجرای خودکار...\n");

  main();

});