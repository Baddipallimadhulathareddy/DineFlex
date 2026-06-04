const express = require("express");
const router = express.Router();

const {
  signupUser,
  loginUser,
  getRestaurants,
  getRestaurantById
} = require("../controllers/userController");

// Auth routes
router.post("/signup", signupUser);
router.post("/login", loginUser);

// Restaurant routes
router.get("/restaurants", getRestaurants);
router.get("/restaurant/:id", getRestaurantById);

module.exports = router;