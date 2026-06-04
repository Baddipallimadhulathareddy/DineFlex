const express = require("express");
const router = express.Router();
const db = require("../db");

// SUPER LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === "madhureddy@gmail.com" &&
    password === "123456"
  ) {
    return res.json({
      success: true,
      name: "Super User"
    });
  }

  res.status(401).json({
    message: "Invalid Super User credentials"
  });
});

// GET ADMINS
router.get("/admins", (req, res) => {
  db.query("SELECT * FROM admins", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET USERS
router.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// BLOCK ADMIN
router.put("/block-admin/:id", (req, res) => {
  db.query(
    "UPDATE admins SET blocked=1 WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Admin blocked" });
    }
  );
});

// UNBLOCK ADMIN
router.put("/unblock-admin/:id", (req, res) => {
  db.query(
    "UPDATE admins SET blocked=0 WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Admin unblocked" });
    }
  );
});

// DELETE ADMIN
router.delete("/delete-admin/:id", (req, res) => {
  db.query(
    "DELETE FROM admins WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Admin deleted" });
    }
  );
});

// BLOCK USER
router.put("/block-user/:id", (req, res) => {
  db.query(
    "UPDATE users SET blocked=1 WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User blocked" });
    }
  );
});

// UNBLOCK USER
router.put("/unblock-user/:id", (req, res) => {
  db.query(
    "UPDATE users SET blocked=0 WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User unblocked" });
    }
  );
});

// DELETE USER
router.delete("/delete-user/:id", (req, res) => {
  db.query(
    "DELETE FROM users WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User deleted" });
    }
  );
});

module.exports = router;