const express = require("express");
const router = express.Router();

const {
  addTable,
  getTables,
  deleteTable
} = require("../controllers/tableController");

router.post("/add", addTable);
router.get("/:adminId", getTables);
router.delete("/:id", deleteTable);

module.exports = router;