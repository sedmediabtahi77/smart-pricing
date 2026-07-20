const pool = require("./database");

async function logError(roomId, type, message) {

    try {

        await pool.query(
            `
            INSERT INTO error_logs
            (
                room_id,
                error_type,
                error_message
            )
            VALUES($1,$2,$3)
            `,
            [
                roomId,
                type,
                message
            ]
        );

    } catch (err) {

        console.log("خطا در ذخیره Error Log");

    }

}

module.exports = logError;