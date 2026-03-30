const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate, staffOnly } = require("../middleware/auth");

router.get("/reservations", authenticate, staffOnly, async (req, res) => {
    try {
        const [reservations] = await db.query(
            `SELECT r.*, c.phone, c.email, t.seating_capacity, s.staff_name 
             FROM reservation r
             LEFT JOIN customer c ON r.customer_id = c.customer_id
             LEFT JOIN restaurant_table t ON r.table_id = t.table_id
             LEFT JOIN staff s ON r.staff_id = s.staff_id
             ORDER BY r.date DESC, r.time DESC`
        );
        console.log(`[DB] Staff fetched ${reservations.length} reservations`);
        res.json(reservations);
    } catch (err) {
        console.error("[Error] Fetching staff reservations failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/tables", authenticate, staffOnly, async (req, res) => {
    try {
        const [tables] = await db.query("SELECT * FROM restaurant_table ORDER BY table_id ASC");
        console.log(`[DB] Staff fetched ${tables.length} tables`);
        res.json(tables);
    } catch (err) {
        console.error("[Error] Fetching staff tables failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/table-status", authenticate, staffOnly, async (req, res) => {
    const { table_id, status } = req.body;
    try {
        if (!table_id || !status) {
            return res.status(400).json({ message: "Provide table_id and status" });
        }

        await db.query("UPDATE restaurant_table SET table_status = ? WHERE table_id = ?", [status, table_id]);
        console.log(`[DB] Table ${table_id} status updated to '${status}' by staff`);
        res.json({ message: "Table status updated successfully" });
    } catch (err) {
        console.error("[Error] Updating table status failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/stats", authenticate, staffOnly, async (req, res) => {
    try {
        const [[{ res_count }]] = await db.query("SELECT COUNT(*) AS res_count FROM reservation WHERE date = CURDATE();");
        const [[{ avail_count }]] = await db.query("SELECT COUNT(*) AS avail_count FROM restaurant_table WHERE table_status = 'available';");
        const [[{ bill_count }]] = await db.query("SELECT COUNT(*) AS bill_count FROM bill;");
        const [[{ total_rev }]] = await db.query("SELECT COALESCE(SUM(amount), 0) AS total_rev FROM payment WHERE payment_status = 'successful';");

        console.log(`[DB] Staff stats: bookings=${res_count}, tables=${avail_count}, bills=${bill_count}, revenue=${total_rev}`);
        res.json({
            today_bookings: res_count || 0,
            available_tables: avail_count || 0,
            bills_generated: bill_count || 0,
            total_revenue: total_rev || 0
        });
    } catch (err) {
        console.error("[Error] Fetching staff stats failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
