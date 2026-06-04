const db = require("../db");

const SUPER_EMAIL = "madhureddy@gmail.com";
const SUPER_PASSWORD = "123456";

// LOGIN
exports.loginSuperUser = (req, res) => {
  const { email, password } = req.body;

  if (email === SUPER_EMAIL && password === SUPER_PASSWORD) {
    return res.json({
      success: true,
      message: "Superuser Login Success"
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid credentials"
  });
};

// GET ADMINS
exports.getAllAdmins = (req, res) => {
  db.query("SELECT * FROM admins", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// GET USERS
exports.getAllUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// DELETE ADMIN
exports.deleteAdmin = (req, res) => {
  db.query(
    "DELETE FROM admins WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Admin deleted" });
    }
  );
};

// DELETE USER
exports.deleteUser = (req, res) => {
  db.query(
    "DELETE FROM users WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User deleted" });
    }
  );
};

// BLOCK ADMIN
exports.blockAdmin = (req, res) => {
  db.query(
    "UPDATE admins SET blocked=1 WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Admin blocked" });
    }
  );
};

// BLOCK USER
exports.blockUser = (req, res) => {
  db.query(
    "UPDATE users SET blocked=1 WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User blocked" });
    }
  );
};