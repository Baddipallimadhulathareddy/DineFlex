const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  signupAdmin,
  loginAdmin,
  getOverview
} = require("../controllers/adminController");

// ✅ Ensure uploads folder exists
const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ Routes
router.post("/signup", upload.single("image"), signupAdmin);
router.post("/login", loginAdmin);
router.get("/overview/:id", getOverview); // ✅ important route

module.exports = router;