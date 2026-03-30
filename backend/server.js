const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/customers", require("./routes/customers"));
app.use("/api/reservations", require("./routes/reservations"));
app.use("/api/tables", require("./routes/tables"));
app.use("/api/bill", require("./routes/bill"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/staff", require("./routes/staff"));

// Global error handler
app.use((err, req, res, next) => {
    console.error("[Unhandled Error]", err.stack || err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
