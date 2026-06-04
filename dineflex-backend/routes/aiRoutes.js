const express = require("express");
const router = express.Router();

const {
  getInsights
} = require("../controllers/aiController");

router.get("/:adminId", getInsights);

module.exports = router;