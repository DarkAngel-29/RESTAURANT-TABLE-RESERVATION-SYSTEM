// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretrestaurantkey2024");
        req.user = decoded; // Contains id and role
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

const customerOnly = (req, res, next) => {
    if (req.user && req.user.role === "customer") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Customer API only." });
    }
};

const staffOnly = (req, res, next) => {
    if (req.user && req.user.role === "staff") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Staff API only." });
    }
};

module.exports = { authenticate, customerOnly, staffOnly };
