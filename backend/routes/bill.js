const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate, staffOnly } = require("../middleware/auth");

router.post("/generate", authenticate, staffOnly, async (req, res) => {
    const { reservation_id, guests } = req.body;
    try {
        if (!reservation_id) {
            return res.status(400).json({ message: "reservation_id is required" });
        }

        const [resCheck] = await db.query(
            "SELECT r.*, c.email FROM reservation r JOIN customer c ON r.customer_id = c.customer_id WHERE r.reservation_id = ?",
            [reservation_id]
        );
        if (resCheck.length === 0) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        const [existing] = await db.query("SELECT * FROM bill WHERE reservation_id = ?", [reservation_id]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "Bill already generated for this reservation", bill: existing[0] });
        }

        const no_of_guests = parseInt(guests) || resCheck[0].no_of_guests || 1;
        const subtotal = no_of_guests * 100;
        const tax = parseFloat((subtotal * 0.10).toFixed(2));
        const totalAmount = parseFloat((subtotal + tax).toFixed(2));

        const [result] = await db.query(
            "INSERT INTO bill (reservation_id, total_amount, tax) VALUES (?, ?, ?)",
            [reservation_id, totalAmount, tax]
        );

        console.log(`[DB] Bill created: bill_no=${result.insertId}, reservation_id=${reservation_id}, total=${totalAmount}, tax=${tax}`);

        await db.query("UPDATE reservation SET status = 'completed' WHERE reservation_id = ?", [reservation_id]);
        console.log(`[DB] Reservation ${reservation_id} status updated to 'completed'`);

        const [resData] = await db.query("SELECT table_id FROM reservation WHERE reservation_id = ?", [reservation_id]);
        if (resData.length > 0 && resData[0].table_id) {
            await db.query("UPDATE restaurant_table SET table_status = 'available' WHERE table_id = ?", [resData[0].table_id]);
            console.log(`[DB] Table ${resData[0].table_id} status set to 'available'`);
        }

        res.status(201).json({
            message: "Bill generated successfully",
            bill_no: result.insertId,
            total_amount: totalAmount,
            tax: tax
        });
    } catch (err) {
        console.error("[Error] Bill generation failed:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

router.get("/customer/:customer_id", authenticate, async (req, res) => {
    try {
        const customerId = req.params.customer_id;

        if (req.user.role === 'customer' && req.user.id != customerId) {
            return res.status(403).json({ message: "Unauthorized to view these bills" });
        }

        const query = `
            SELECT 
                b.bill_no,
                r.reservation_id,
                r.no_of_guests,
                r.date,
                b.tax,
                b.total_amount,
                p.payment_status
            FROM bill b
            JOIN reservation r ON b.reservation_id = r.reservation_id
            LEFT JOIN payment p ON b.bill_no = p.bill_no
            WHERE r.customer_id = ?
            ORDER BY b.bill_no DESC
        `;

        const [bills] = await db.query(query, [customerId]);
        console.log(`[DB] Fetched ${bills.length} bills for customer_id=${customerId}`);
        res.json(bills);
    } catch (err) {
        console.error("[Error] Fetching customer bills failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/by-id/:bill_no", authenticate, async (req, res) => {
    try {
        const [bills] = await db.query(
            `SELECT b.*, r.date, r.time, r.no_of_guests, c.phone, c.email
             FROM bill b
             JOIN reservation r ON b.reservation_id = r.reservation_id
             JOIN customer c ON r.customer_id = c.customer_id
             WHERE b.bill_no = ?`,
            [req.params.bill_no]
        );

        if (bills.length === 0) {
            return res.status(404).json({ message: "Bill not found" });
        }

        console.log(`[DB] Fetched bill bill_no=${req.params.bill_no}`);
        res.json(bills[0]);
    } catch (err) {
        console.error("[Error] Fetching bill by id failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/:reservation_id", authenticate, async (req, res) => {
    try {
        const [bills] = await db.query(
            `SELECT b.*, r.date, r.time, r.no_of_guests, c.phone, c.email
             FROM bill b
             JOIN reservation r ON b.reservation_id = r.reservation_id
             JOIN customer c ON r.customer_id = c.customer_id
             WHERE b.reservation_id = ?`,
            [req.params.reservation_id]
        );

        if (bills.length === 0) {
            return res.status(404).json({ message: "Bill not found" });
        }

        res.json(bills[0]);
    } catch (err) {
        console.error("[Error] Fetching bill by reservation_id failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/", authenticate, async (req, res) => {
    try {
        let query = `
            SELECT b.*, r.date, r.customer_id, c.email, p.payment_status, p.payment_method 
            FROM bill b
            JOIN reservation r ON b.reservation_id = r.reservation_id
            JOIN customer c ON r.customer_id = c.customer_id
            LEFT JOIN payment p ON b.bill_no = p.bill_no
        `;
        const params = [];

        if (req.user.role === "customer") {
            query += " WHERE r.customer_id = ?";
            params.push(req.user.id);
        }

        query += " ORDER BY b.bill_no DESC";

        const [bills] = await db.query(query, params);
        console.log(`[DB] Fetched ${bills.length} bills for ${req.user.role} id=${req.user.id}`);
        res.json(bills);
    } catch (err) {
        console.error("[Error] Fetching all bills failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
