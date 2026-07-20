const axios = require("axios");

const roomUrls = [
  "https://www.otaghak.com/room/2446492/?checkIn=2026-07-26&checkOut=2026-07-28&person=3",
  "https://www.otaghak.com/room/9999999/?checkIn=2026-07-26&checkOut=2026-07-28&person=3",
  "https://www.otaghak.com/room/2484846/?checkIn=2026-07-26&checkOut=2026-07-28&person=3",
  "https://www.otaghak.com/room/2487027/?checkIn=2026-07-26&checkOut=2026-07-28&person=3",
  "https://www.otaghak.com/room/2497478/?checkIn=2026-07-26&checkOut=2026-07-28&person=3"
];

function getRoomId(url) {
    const match = url.match(/room\/(\d+)/);
    return match ? match[1] : null;
}

async function getRoomPrice(url, checkInDate, checkOutDate){
    const roomId = getRoomId(url);

    const apiUrl =
`https://core.otaghak.com/api/v3/Rooms/GetRoomPdp?roomId=${roomId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&utmSource=&generatedDevice=WebSite`;

    try{

        const response = await axios.get(apiUrl,{
            headers:{
                "User-Agent":"Mozilla/5.0"
            }
        });

        const data = response.data;

        const finalPrice =
    data.price.afterDiscount > 0
        ? data.price.afterDiscount
        : data.price.basePrice;

return {
    roomId,
    finalPrice,
    url
};

    }catch{

        return null;

    }

}

function applyTimeDecay(price){

    const hour=new Date().getHours();

    let discount=0;

    if(hour>=20) discount=0.06;
    else if(hour>=17) discount=0.04;
    else if(hour>=14) discount=0.02;

    return{
        finalPrice:Math.round(price*(1-discount))
    }

}

async function calculatePrices(checkInDate, checkOutDate){
    const competitors=[];

    for(const url of roomUrls){

        const room = await getRoomPrice(
            url,
            checkInDate,
            checkOutDate
        );
        if(room){
            competitors.push(room);
        }

    }

    const averagePrice=Math.round(
        competitors.reduce((a,b)=>a+b.finalPrice,0)
        /competitors.length
    );

    const suggestedPrice=
    applyTimeDecay(
        Math.round(averagePrice*0.95)
    ).finalPrice;

    return{

        competitors,

        averagePrice,

        suggestedPrice

    }

}

module.exports={
    calculatePrices
};