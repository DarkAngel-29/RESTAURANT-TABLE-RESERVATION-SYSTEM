const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate } = require("../middleware/auth");

router.post("/", authenticate, async (req, res) => {
    const { table_id, date, time, no_of_guests } = req.body;
    const customer_id = req.user.role === "customer" ? req.user.id : req.body.customer_id;

    try {
        if (!date || !time || !no_of_guests) {
            return res.status(400).json({ message: "date, time, and no_of_guests are required" });
        }

        if (table_id) {
            const [tables] = await db.query("SELECT * FROM restaurant_table WHERE table_id = ?", [table_id]);
            if (tables.length === 0 || tables[0].table_status !== "available") {
                return res.status(400).json({ message: "Table is not available" });
            }
            await db.query("UPDATE restaurant_table SET table_status = 'reserved' WHERE table_id = ?", [table_id]);
            console.log(`[DB] Table ${table_id} status set to 'reserved'`);
        }

        const [result] = await db.query(
            "INSERT INTO reservation (customer_id, table_id, staff_id, date, time, no_of_guests, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [customer_id, table_id || null, req.user.role === "staff" ? req.user.id : null, date, time, no_of_guests, "pending"]
        );

        console.log(`[DB] Reservation created: reservation_id=${result.insertId}, customer_id=${customer_id}, date=${date}, guests=${no_of_guests}`);
        res.status(201).json({ reservation_id: result.insertId, message: "Reservation created successfully" });
    } catch (err) {
        console.error("[Error] Creating reservation failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/", authenticate, async (req, res) => {
    try {
        let query = `
            SELECT r.*, c.phone, c.email, t.seating_capacity, s.staff_name 
            FROM reservation r
            JOIN customer c ON r.customer_id = c.customer_id
            LEFT JOIN restaurant_table t ON r.table_id = t.table_id
            LEFT JOIN staff s ON r.staff_id = s.staff_id
        `;
        const queryParams = [];

        if (req.user.role === "customer") {
            query += " WHERE r.customer_id = ?";
            queryParams.push(req.user.id);
        }

        query += " ORDER BY r.date DESC, r.time DESC";

        const [reservations] = await db.query(query, queryParams);
        console.log(`[DB] Fetched ${reservations.length} reservations for ${req.user.role} id=${req.user.id}`);
        res.json(reservations);
    } catch (err) {
        console.error("[Error] Fetching reservations failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/:id", authenticate, async (req, res) => {
    try {
        const [reservations] = await db.query(
            `SELECT r.*, c.phone, c.email, t.seating_capacity, s.staff_name 
             FROM reservation r
             JOIN customer c ON r.customer_id = c.customer_id
             LEFT JOIN restaurant_table t ON r.table_id = t.table_id
             LEFT JOIN staff s ON r.staff_id = s.staff_id
             WHERE r.reservation_id = ?`,
            [req.params.id]
        );

        if (reservations.length === 0) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.json(reservations[0]);
    } catch (err) {
        console.error("[Error] Fetching reservation failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/:id", authenticate, async (req, res) => {
    const { status, table_id } = req.body;
    try {
        const queryParams = [];
        let setClause = "";

        if (status) {
            setClause += "status = ?";
            queryParams.push(status);
        }
        if (table_id) {
            if (setClause) setClause += ", ";
            setClause += "table_id = ?";
            queryParams.push(table_id);

            await db.query("UPDATE restaurant_table SET table_status = 'reserved' WHERE table_id = ?", [table_id]);
            console.log(`[DB] Table ${table_id} marked as 'reserved' via reservation update`);
        }

        if (status === "completed" || status === "cancelled") {
            const [resData] = await db.query("SELECT table_id FROM reservation WHERE reservation_id = ?", [req.params.id]);
            if (resData.length > 0 && resData[0].table_id) {
                await db.query("UPDATE restaurant_table SET table_status = 'available' WHERE table_id = ?", [resData[0].table_id]);
                console.log(`[DB] Table ${resData[0].table_id} freed (status='available') due to reservation ${status}`);
            }
        }

        if (setClause) {
            queryParams.push(req.params.id);
            await db.query(`UPDATE reservation SET ${setClause} WHERE reservation_id = ?`, queryParams);
            console.log(`[DB] Reservation ${req.params.id} updated: status=${status}, table_id=${table_id}`);
        }

        res.json({ message: "Reservation updated successfully" });
    } catch (err) {
        console.error("[Error] Updating reservation failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.delete("/:id", authenticate, async (req, res) => {
    try {
        const [resData] = await db.query("SELECT table_id FROM reservation WHERE reservation_id = ?", [req.params.id]);
        if (resData.length > 0 && resData[0].table_id) {
            await db.query("UPDATE restaurant_table SET table_status = 'available' WHERE table_id = ?", [resData[0].table_id]);
            console.log(`[DB] Table ${resData[0].table_id} freed on reservation deletion`);
        }
        await db.query("DELETE FROM reservation WHERE reservation_id = ?", [req.params.id]);
        console.log(`[DB] Reservation ${req.params.id} deleted`);
        res.json({ message: "Reservation deleted successfully" });
    } catch (err) {
        console.error("[Error] Deleting reservation failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
