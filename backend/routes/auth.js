const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

router.post("/register", async (req, res) => {
    const {
        phone, email, password, role,
        booking_type, // 'individual' or 'group'
        name, age, id_proof, // individual payload
        booking_person_name, booking_person_age, booking_person_id, number_of_members // group payload
    } = req.body;

    try {
        const [existing] = await db.execute("SELECT email FROM customer WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userRole = role === "staff" ? "staff" : "customer";

        const connection = await db.getConnection();
        try {
            if (userRole === "customer") {
                await connection.beginTransaction();
                const [result] = await connection.execute(
                    "INSERT INTO customer (phone, email, password, role) VALUES (?, ?, ?, ?)",
                    [phone, email, hashedPassword, "customer"]
                );
                const customerId = result.insertId;

                if (booking_type === 'individual' || !booking_type) {
                    await connection.execute(
                        "INSERT INTO individual (customer_id, name, age, id_proof) VALUES (?, ?, ?, ?)",
                        [customerId, name || 'Customer', age || null, id_proof || null]
                    );
                } else if (booking_type === 'group') {
                    await connection.execute(
                        "INSERT INTO group_booking (customer_id, booking_person_name, booking_person_age, booking_person_id, number_of_members) VALUES (?, ?, ?, ?, ?)",
                        [customerId, booking_person_name || 'Group Booker', booking_person_age || null, booking_person_id || null, number_of_members || 2]
                    );
                }
                await connection.commit();
                console.log(`[DB] New customer registered: customer_id=${customerId}, email=${email}`);
            } else {
                const [staffResult] = await db.execute(
                    "INSERT INTO staff (staff_name, email, password, role) VALUES (?, ?, ?, ?)",
                    [name || "Staff", email, hashedPassword, "staff"]
                );
                console.log(`[DB] New staff registered: staff_id=${staffResult.insertId}, email=${email}`);
            }

            res.status(201).json({ message: "User registered successfully" });
        } catch (err) {
            if (userRole === "customer") await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error("[Error] Registration failed:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password, role } = req.body;

    try {
        let user;
        let isCustomer = true;
        let displayName = null;

        if (role === 'staff') {
            const [staffs] = await db.execute("SELECT * FROM staff WHERE email = ?", [email]);
            if (staffs.length > 0) {
                user = staffs[0];
                isCustomer = false;
                displayName = user.staff_name;
            }
        } else {
            const [customers] = await db.execute("SELECT * FROM customer WHERE email = ?", [email]);
            if (customers.length > 0) {
                user = customers[0];
                isCustomer = true;

                const [indiv] = await db.execute("SELECT name FROM individual WHERE customer_id = ?", [user.customer_id]);
                if (indiv.length > 0) {
                    displayName = indiv[0].name;
                } else {
                    const [grp] = await db.execute("SELECT booking_person_name FROM group_booking WHERE customer_id = ?", [user.customer_id]);
                    if (grp.length > 0) {
                        displayName = grp[0].booking_person_name;
                    }
                }
            }
        }

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const payload = {
            id: isCustomer ? user.customer_id : user.staff_id,
            role: isCustomer ? "customer" : "staff",
            name: displayName || (isCustomer ? "Customer" : "Staff")
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || "supersecretrestaurantkey2024",
            { expiresIn: "10h" },
            (err, token) => {
                if (err) throw err;
                console.log(`[Auth] Login successful: role=${payload.role}, id=${payload.id}, name=${payload.name}`);
                res.json({ token, user: payload });
            }
        );
    } catch (err) {
        console.error("[Error] Login failed:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
