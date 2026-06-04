const express = require("express");
const router = express.Router();

const {
  addReservation,
  getReservations,
  deleteReservation,
  getUserReservations
} = require("../controllers/reservationController");

// Add new reservation
// Add new reservation
router.post("/add", addReservation);

// Get user-specific reservations (KEEP THIS FIRST)
router.get("/user/:adminId/:userId", getUserReservations);

// Get reservations by adminId
router.get("/:adminId", getReservations);

// Delete reservation
router.delete("/delete/:id", deleteReservation);

module.exports = router;