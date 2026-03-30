const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate } = require("../middleware/auth");

router.post("/", authenticate, async (req, res) => {
    const { bill_no, amount, payment_method } = req.body;

    try {
        if (!bill_no || !amount || !payment_method) {
            return res.status(400).json({ message: "Please enter all fields: bill_no, amount, payment_method" });
        }

        const [bills] = await db.query("SELECT * FROM bill WHERE bill_no = ?", [bill_no]);
        if (bills.length === 0) {
            return res.status(404).json({ message: "Bill not found" });
        }

        const [existingPayment] = await db.query("SELECT * FROM payment WHERE bill_no = ?", [bill_no]);
        if (existingPayment.length > 0) {
            return res.status(400).json({ message: "This bill has already been paid", payment: existingPayment[0] });
        }

        const [result] = await db.query(
            "INSERT INTO payment (bill_no, amount, payment_method, payment_status) VALUES (?, ?, ?, 'successful')",
            [bill_no, amount, payment_method]
        );

        console.log(`[DB] Payment inserted: payment_id=${result.insertId}, bill_no=${bill_no}, amount=${amount}, method=${payment_method}`);

        res.status(201).json({
            payment_id: result.insertId,
            message: "Payment successful",
            bill_no,
            amount,
            payment_method,
            payment_status: "successful"
        });
    } catch (err) {
        console.error("[Error] Payment failed:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

router.get("/:bill_no", authenticate, async (req, res) => {
    try {
        const [payments] = await db.query("SELECT * FROM payment WHERE bill_no = ?", [req.params.bill_no]);

        if (payments.length === 0) {
            return res.status(404).json({ message: "Payment not found for this bill" });
        }

        console.log(`[DB] Fetched payment for bill_no=${req.params.bill_no}`);
        res.json(payments);
    } catch (err) {
        console.error("[Error] Fetching payment failed:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
