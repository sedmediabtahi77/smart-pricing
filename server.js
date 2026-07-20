const express = require("express");

const { calculatePrices } = require("./pricingService");

const app = express();

app.use(express.static("public"));

app.get("/api/prices", async (req, res) => {

    try {

        const data = await calculatePrices(

            "2026-07-26",

            "2026-07-28"

        );

        res.json(data);

    } catch (err) {

        console.error(err);

        res.status(500).json({

            error: "Server Error"

        });

    }

});

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {

    console.log(`Server running on port ${PORT}`);

});