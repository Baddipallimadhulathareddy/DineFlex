const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  addDish,
  getDishes,
  deleteDish,
  updateDishQuantity
} = require("../controllers/dishController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

router.post("/add", upload.single("image"), addDish);
router.get("/:adminId", getDishes);
router.delete("/:id", deleteDish);

// Update dish quantity
router.put("/quantity/:id", updateDishQuantity);

module.exports = router;