const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticate, customerOnly } = require("../middleware/auth");

router.get("/", authenticate, async (req, res) => {
    try {
        const [customers] = await db.query(
            `SELECT c.customer_id, c.phone, c.email, c.role, 
      i.name as name, i.age as age, i.id_proof as id_proof,
      gb.booking_person_name, gb.booking_person_age, gb.booking_person_id, gb.number_of_members
      FROM customer c
      LEFT JOIN individual i ON c.customer_id = i.customer_id
      LEFT JOIN group_booking gb ON c.customer_id = gb.customer_id`
        );
        res.json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.get("/:id", authenticate, async (req, res) => {
    try {
        const [customers] = await db.query(
            `SELECT c.customer_id, c.phone, c.email, c.role, 
      i.name as name, i.age as age, i.id_proof as id_proof,
      gb.booking_person_name, gb.booking_person_age, gb.booking_person_id, gb.number_of_members
      FROM customer c
      LEFT JOIN individual i ON c.customer_id = i.customer_id
      LEFT JOIN group_booking gb ON c.customer_id = gb.customer_id
      WHERE c.customer_id = ?`,
            [req.params.id]
        );

        if (customers.length === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(customers[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.put("/:id", authenticate, async (req, res) => {
    const { phone, name, age } = req.body;

    try {
        await db.query("UPDATE customer SET phone = ? WHERE customer_id = ?", [phone, req.params.id]);
        await db.query("UPDATE individual SET name = ?, age = ? WHERE customer_id = ?", [name, age, req.params.id]);
        res.json({ message: "Customer updated" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.delete("/:id", authenticate, async (req, res) => {
    try {
        await db.query("DELETE FROM customer WHERE customer_id = ?", [req.params.id]);
        res.json({ message: "Customer deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
