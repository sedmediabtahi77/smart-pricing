const pool = require("./database");

async function testConnection() {

    try {

        const result = await pool.query("SELECT NOW()");

        console.log("✅ اتصال برقرار شد.");

        console.log(result.rows[0]);

    } catch (err) {

        console.log("❌ اتصال برقرار نشد.");

        console.log(err.message);

    } finally {

        await pool.end();

    }

}

testConnection();