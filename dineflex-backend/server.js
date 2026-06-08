require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Import Routes
const reservationRoutes = require("./routes/reservationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const superRoutes = require("./routes/superRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes =
require("./routes/paymentRoutes");
// Middlewares
app.use(cors());
app.use(express.json());

// Serve uploads folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// API Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admins", require("./routes/adminRoutes"));
app.use("/api/dishes", require("./routes/dishRoutes"));
app.use("/api/tables", require("./routes/tableRoutes"));
app.use("/api/reservations", reservationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/super", superRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
// Notifications Route
app.use(
  "/api/payments",
  paymentRoutes
);
app.get("/", (req, res) => {
  res.send("DineFlex Backend is Running 🚀");
});
// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});