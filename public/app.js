function toPersianNumber(number) {

    return number
        .toString()
        .replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);

}

const villaNames = [

    "اول",

    "دوم",

    "سوم",

    "چهارم",

    "پنجم"

];

async function loadPrices(){

    const response=await fetch("/api/prices");
    
    const data=await response.json();
    
    const cards=document.getElementById("competitors");
    
    cards.innerHTML="";
    
    data.competitors.forEach((room,index)=>{
    
    cards.innerHTML+=`
    
    <div class="card">
    
        <a
    href="${room.url}"
    target="_blank"
    class="villa-link">

اقامتگاه ${villaNames[index]}
    </a>
    
    <div class="price">
    
    ${toPersianNumber(room.finalPrice.toLocaleString())} تومان    
    </div>
    
    </div>
    
    `;
    
    });
    
    document.getElementById("suggestedPrice").innerText =

toPersianNumber(
    data.suggestedPrice.toLocaleString()
) + " تومان";
    
    const now=new Date();
    
    document.getElementById("lastUpdate").innerText=
    
    now.toLocaleTimeString("fa-IR",{
    
    hour:"2-digit",
    
    minute:"2-digit"
    
    });
    
const demoRows = [

    {
        day:"شنبه",
        prices:["۶٬۰۰۰٬۰۰۰","۵٬۳۵۰٬۰۰۰","۴٬۲۰۰٬۰۰۰","۵٬۰۰۰٬۵۵۰"],
        suggested:"۴٬۸۸۰٬۷۵۶"
    },

    {
        day:"یکشنبه",
        prices:["۶٬۱۰۰٬۰۰۰","۵٬۴۰۰٬۰۰۰","۴٬۳۰۰٬۰۰۰","۵٬۱۰۰٬۰۰۰"],
        suggested:"۴٬۹۵۰٬۰۰۰"
    },

    {
        day:"دوشنبه",
        prices:["۶٬۲۰۰٬۰۰۰","۵٬۵۰۰٬۰۰۰","۴٬۴۰۰٬۰۰۰","۵٬۲۰۰٬۰۰۰"],
        suggested:"۵٬۰۲۰٬۰۰۰"
    },

    {
        day:"سه‌شنبه",
        prices:["۶٬۳۰۰٬۰۰۰","۵٬۶۰۰٬۰۰۰","۴٬۵۰۰٬۰۰۰","۵٬۳۰۰٬۰۰۰"],
        suggested:"۵٬۱۰۰٬۰۰۰"
    },

    {
        day:"چهارشنبه",
        prices:["۶٬۱۵۰٬۰۰۰","۵٬۴۸۰٬۰۰۰","۴٬۳۰۰٬۰۰۰","۵٬۱۸۰٬۰۰۰"],
        suggested:"۴٬۹۸۰٬۰۰۰"
    },

    {
        day:"پنجشنبه",
        prices:["۶٬۰۵۰٬۰۰۰","۵٬۳۲۰٬۰۰۰","۴٬۲۵۰٬۰۰۰","۵٬۰۲۰٬۰۰۰"],
        suggested:"۴٬۹۲۰٬۰۰۰"
    },

    {
        day:"جمعه",
        prices:["۵٬۹۰۰٬۰۰۰","۵٬۲۵۰٬۰۰۰","۴٬۱۸۰٬۰۰۰","۴٬۹۸۰٬۰۰۰"],
        suggested:"۴٬۸۸۰٬۰۰۰"
    }

];

const tbody=document.getElementById("forecastBody");

tbody.innerHTML="";

demoRows.forEach(row=>{

    tbody.innerHTML+=`

<tr>

<td>${row.day}</td>

<td>${row.prices[0]}</td>

<td>${row.prices[1]}</td>

<td>${row.prices[2]}</td>

<td>${row.prices[3]}</td>

<td>${row.suggested}</td>

</tr>

`;

});

    }
    
    loadPrices();
    
    setInterval(loadPrices,60000);