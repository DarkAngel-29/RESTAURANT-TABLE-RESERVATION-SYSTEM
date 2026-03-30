const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate, staffOnly } = require("../middleware/auth");

router.get("/", async (req, res) => {
    try {
        const [tables] = await db.query("SELECT * FROM restaurant_table ORDER BY table_id ASC");
        console.log(`[DB] Fetched ${tables.length} tables`);
        res.json(tables);
    } catch (err) {
        console.error("[Error] Fetching tables failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.post("/", authenticate, staffOnly, async (req, res) => {
    const { seating_capacity, table_status } = req.body;
    try {
        if (!seating_capacity || seating_capacity < 1) {
            return res.status(400).json({ message: "seating_capacity must be at least 1" });
        }
        const [result] = await db.query(
            "INSERT INTO restaurant_table (seating_capacity, table_status) VALUES (?, ?)",
            [seating_capacity, table_status || "available"]
        );
        console.log(`[DB] Table created: table_id=${result.insertId}, capacity=${seating_capacity}, status=${table_status || 'available'}`);
        res.status(201).json({ table_id: result.insertId, message: "Table created successfully" });
    } catch (err) {
        console.error("[Error] Creating table failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/:id", authenticate, staffOnly, async (req, res) => {
    const { seating_capacity, table_status } = req.body;
    try {
        await db.query(
            "UPDATE restaurant_table SET seating_capacity = COALESCE(?, seating_capacity), table_status = COALESCE(?, table_status) WHERE table_id = ?",
            [seating_capacity || null, table_status || null, req.params.id]
        );
        console.log(`[DB] Table ${req.params.id} updated: capacity=${seating_capacity}, status=${table_status}`);
        res.json({ message: "Table updated successfully" });
    } catch (err) {
        console.error("[Error] Updating table failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.delete("/:id", authenticate, staffOnly, async (req, res) => {
    try {
        await db.query("DELETE FROM restaurant_table WHERE table_id = ?", [req.params.id]);
        console.log(`[DB] Table ${req.params.id} deleted`);
        res.json({ message: "Table deleted successfully" });
    } catch (err) {
        console.error("[Error] Deleting table failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
